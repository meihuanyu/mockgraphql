import db from '../config/database'
//增
//object: 增加的数据，传 对象
export const addData = async function(table_name,object){
    var attributes = []
    var values = []
    var zhanwei=[]

    if(Array.isArray(object)){
        
        for(let i=0;i<object.length;i++){
            let temp_zw=[]
            for(let key in object[i]){
                values.push(object[i][key])
                temp_zw.push("?")
            }
            zhanwei.push("("+temp_zw.join()+")")
        }
        attributes=Object.keys(object[0])
    }else{
        let temp_zw=[]
        for(let key in object){
            values.push(object[key])
            temp_zw.push("?")
        }
        zhanwei.push("("+temp_zw.join()+")")
        attributes=Object.keys(object)
    }
    const sql = "INSERT INTO " + table_name + " (" + attributes.join(',') + ") " + "VALUES "+zhanwei.join()
    console.log(sql)
    console.log(values)
    let res = await db.query(sql,values);
    return res
}

//删
//where: 查询条件，传字符串
//type：删除的类型，默认删除数据（data）,删除表传（table）
export const deleteData = async function(table_name,where = '1=1',type = 'data'){
    if(type == "table"){
        const sql = "DROP TABLE " + table_name//删表
    }else{
        const sql = "DELETE FROM " + table_name + "WHERE " + where//删数据
    }
    let res = await db.query(sql);
    return res
}

//改
//object: 需要修改的属性，传 对象
//where: 查询条件，传 字符串
export const updateData = async function(table_name,object,where = '1=1'){
    var newAtts = []
    for (var i in object) {
        if(typeof(object[i])=='string'){
            object[i] = "'" + object[i] + "'"
        }
        newAtts.push(i + "=" + object[i]); //属性
    }
    const sql ="UPDATE " + table_name + " SET " + newAtts.join(',') + "WHERE " + where;
    let res=await db.query(sql);
    return res
}

//查
//attributes: 要查询的字段，传 字符串 或 数组
//where: 查询条件，传 字符串
export const getData = async function(table_name,attributes = '*',where = '1=1'){
    if (Array.isArray(attributes)){
        att = attributes.join(',')
    }else{
        att = attributes
    }
    const sql = "SELECT" + att + "FROM" + table_name + "WHERE" + where
    const res=await db.query(sql);
    return res
}
