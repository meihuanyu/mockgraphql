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
            if(typeof(object[key])!=='object'){
                values.push(object[key])
                temp_zw.push("?")
                attributes.push(key)
            }
        }
        zhanwei.push("("+temp_zw.join()+")")
    }
    const sql = "INSERT INTO " + table_name + " (" + attributes.join(',') + ") " + "VALUES "+zhanwei.join()
    try {
        let res = await db.query(sql,values);
        return res
    } catch (error) {
        console.error(error)
        return {}
    }
}

//删
//where: 查询条件，传字符串
//type：删除的类型，默认删除数据（data）,删除表传（table）
export const deleteData = async function(table_name,object){
    let sqlArr = ['1=1']

    for(const key in object){
        sqlArr.push(` ${key}=${object[key]} `)
    }
    
    const sql = `delete from  ${table_name} where  ${sqlArr.join(' and ')}`
    let res = await db.query(sql);
    return res
}

//改
//object: 需要修改的属性，传 对象
//where: 查询条件，传 字符串
export const updateData = async function(table_name,object,where = '1=1'){
    var newAtts = []
    for (var i in object) {
        //临时措施
        if(i!=='id' && object[i]!=="null"){
            if(typeof(object[i])=='string'){
                object[i] = "'" + object[i] + "'"
            }
            newAtts.push(i + "=" + object[i]); //属性
        }
    }
    const sql ="UPDATE " + table_name + " SET " + newAtts.join(',') + " WHERE id=?";
    try {
        let res=await db.query(sql,[object.id]);
        return res
    } catch (error) {
        console.error(error)
        return {}
    }
}

//查
//attributes: 要查询的字段，传 字符串 或 数组
//where: 查询条件，传 字符串
export const getOneData = async function(table_name,params){
    var values = []
    var _where = []
    for(let key in params){
        values.push(params[key])
        _where.push(` ${key}=? `)
    }

    const sql = "SELECT * FROM " + table_name +( _where.length?' where '+_where.join(' and '):"")
    try {
        let res = await db.query(sql,values);
        return res[0]
    } catch (error) {
        console.error(error)
        return {}
    }
}
//查
//attributes: 要查询的字段，传 字符串 或 数组
//where: 查询条件，传 字符串
export const getData = async function(table_name,params){
    var values = []
    var _where = []
    for(let key in params){
        values.push(params[key])
        _where.push(` ${key}=? `)
    }

    const sql = "SELECT * FROM " + table_name +( _where.length?' where '+_where.join(' and '):"")
    try {
        let res = await db.query(sql,values);
        return res
    } catch (error) {
        console.error(error)
        return {}
    }
}