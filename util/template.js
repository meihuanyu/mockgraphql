import db from '../config/database'
import { updateData ,addData,getOneData, deleteData, getData} from './sql'
export const formartJson = (data)=>{
    let str = removeJsComments(data)
    str = str.replace(/:(.*?)\s+/g, ":\"$1\",");
    str = str.replace(/{/g, ":{");
    str = str.replace(/}/g, "},");
    str =  "{"+str+"}"
    let Json = null
    try {
      Json = eval('(' + str + ')');
    }catch(e){
      console.log(e)
      return false
    }
    return Json
  }
     
//比对两个对象
export const comparisonTemplate =(newData,oldData)=> {
    var addObj={},updateObj={},
    deleteObj={};
    for(let key in newData){
        //如果老数据中 存在表
        if(oldData[key]){
            for(let k in newData[key]){
                // 如果老数据中 表字段 存在一样的key
                if(oldData[key][k]){
                    // 如果新数据key 与 老数据key不同
                    if(oldData[key][k] !== newData[key][k]){
                        if(!updateObj[key]){ 
                            updateObj[key] = {}
                        }
                        updateObj[key][k] = newData[key][k]
                    }

                }else{
                    if(!addObj[key]){ 
                        addObj[key] = {}
                    }
                    addObj[key][k] = newData[key][k]
                }
            }
        }else{
            addObj[key] = newData[key]
        }
    }
    for(let key in oldData){
        // 如果新数据中 存在表
       if(newData[key]){    
            for(let k in oldData[key]){
                if(newData[key][k]){
                    // 新老数据不同
                    if(newData[key][k] !== oldData[key][k]){
                        if(!updateObj[key]){ 
                            updateObj[key] = {}
                        }
                        updateObj[key][k] = newData[key][k]
                    }
                }else{
                    if(!deleteObj[key]){ 
                        deleteObj[key] = {}
                    } 
                    deleteObj[key][k] = oldData[key][k]
                }
            }
       }else{
          deleteObj[key] = oldData[key]
       }
    }
    return {
        addObj,updateObj,deleteObj
    }
  }

// 校验值的类型 
// 结构一个varchar ,int... link(xx.xx) link(xx[a,b,c])
// renturn {type ,leng} or {name,params} or string
export const fromartFieldType = (type)=> {
    const nativeTypes = ['bigint','binary','bit','blob','char','date','int','integer','linestring','longblob','longtext','mediumblob','mediumint',
        'mediumtext','multilinestring','multipoint','multipolygon','numeric','point','polygon','real','set','smallint','text','time','timestamp'
        ,'tinyblob','timestamp','tinyblob','tinyint','tinytext','varbinary','year','varchar'];
    if(nativeTypes.indexOf(type) !== -1){
        return {type,leng:128}
    }else{ 
        // 如果是link类型
        if(type.split('link(')[1]){
            return formartLinkStr(type)
        }else{
            return 'varchar'
        }
        
    }
}

// 删除中间表
export const deleteMiddleTable = async(project,a,b)=> {
    const name = a+"_to_"+b

    const table = await getOneData('system_base_table',{name,projectId:project.id})
    try{
        await db.query(`DROP TABLE ${project.apiKey+ "_"+name}`) 
    }catch(e){console.log(e)}
    await deleteData('system_base_table',{id:table.id})
    return true
}
// 创建中间表
export const createMiddleTable = async (project,a,b)=> {
    const name = a+"_to_"+b
    const type = 2
    await addData('system_base_table',{
        name,
        projectId:project.id,
        type
    })
    const  sql=`CREATE TABLE IF NOT EXISTS ${project.apiKey+"_"+name}(
        ${a+'id'} varchar(255),
        ${b+'id'} varchar(255)
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;`
    const res = await db.query(sql)
    return res
}
// 创建表结构
export const createTableStructure=async function(project,tableName,fieldsObj){
    let fieldsArr = []
    for(let field in fieldsObj){
        const fieldType = fromartFieldType(fieldsObj[field])
        if(fieldType.type){
           fieldsArr.push( `${field} ${fieldType.type}(${fieldType.leng})`)
        }else{
            //如果是 link类型 则不创建字段  去创建中间表
           await  createMiddleTable(project,tableName,fieldType.name)
        }
        
    }
    // 最后一个添加,
    fieldsArr.push(' ')
    const  sql=`CREATE TABLE IF NOT EXISTS ${project.apiKey+"_"+tableName}(
        id varchar(255),
        ${fieldsArr.join(' , ')}
		createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (id)
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;`
    const res  = await db.query(sql);
    return res;
}

// 删除表结构
export const deleteTable = async(id)=> {
    const table = await getOneData('system_base_table',{id})
    const project = await getOneData('system_project',{id:table.projectId})
    try{
        await db.query(`DROP TABLE ${project.apiKey + "_" + table.name}`) 
    }catch(e){console.log(e)}
    await deleteData('system_base_table',{id})
    return true
}


export const createField = async function(name,project,fieldsObj){
    const tableDescInfo = await db.query(`show tables like "${project.apiKey+"_"+name}"`)
    if(tableDescInfo.length){
        for(let field in fieldsObj){
            const fieldType = fromartFieldType(fieldsObj[field])
            if(fieldType.type){
                try{
                    await db.query(`ALTER TABLE ${project.apiKey+"_"+name} add ${field} ${fieldType.type}(${fieldType.leng})`)
                }catch(e){console.log(e)}
            }else{
                // 删除以前字段
                await db.query(`alter table ${project.apiKey+"_"+name} drop column ${field}`)
                // 如果是 link类型 则不创建字段  去创建中间表
               await  createMiddleTable(project,name,fieldType.name)
            }       
        }
    }else{
        await addData('system_base_table',{
            name,
            projectId:project.id
        })
    
        const res =await createTableStructure(project,name,fieldsObj)
        return res
    }
}

export const deleteField =async function(key,project,fieldsObj){
    for(let k in fieldsObj){
        const fieldType = fromartFieldType(fieldsObj[k])
        if(fieldType.type){
            //删除字段
            try{
                await db.query(`alter table ${project.apiKey+"_"+key} drop column ${k}`)
            }catch(e){console.log(e)}
        }else{
            //删除中间表
            await deleteMiddleTable(project,key,fieldType.name)
        }
    }
    
    const resDesc = await db.query(`desc ${project.apiKey+"_"+key}`)
    // 查询表是否有除 id 以外的字段
    // 不允许传递空的对象
    if(resDesc.length <= 3){
        const table = await getOneData('system_base_table',{
            projectId:project.id,
            name:key
        })
        await deleteTable(table.id)
    }
    return true;

}

//  修改 字段
export const updateField  = async (key,project,obj,oldData)=>{
    const oldObj = oldData[key]
    for(let k in obj){
        const fieldType = fromartFieldType(obj[k])
        const oldFieldType = fromartFieldType(oldObj[k])
        if(oldFieldType.name){
            // 删除 老的中间表
            await deleteMiddleTable(project,key,oldFieldType.name)
        }
        if(fieldType.type){
            // 修改字段
            try{
                const operType = oldFieldType.name?"ADD":"MODIFY"
                await db.query(`ALTER TABLE ${project.apiKey+"_"+key} ${operType} ${k} ${fieldType.type}(${fieldType.leng})`)
            }catch(e){console.log(e)}
        }else{
            //如果是 link类型 则不创建字段  去创建中间表
           await  createMiddleTable(project,key,fieldType.name)
        }
    }
}


const formartLinkStr = (str)=> {
    let params = []
    let name = null
    const linkStr = str.split('link(')[1].split(')')[0]
    // 如果存在多个 参数
    if(linkStr.split('[')[1]){
        params = linkStr.split('[')[1].split(']')[0].split(',')
        name = linkStr.split('[')[0]
        
    }else{
        if(linkStr.split('.')[1]){
            params = [linkStr.split('.')[1]]
            name = linkStr.split('.')[0]
        }else{
            name = linkStr.split('[')[0]
        }
    }
    return {name,params}
}
// 删除空格
const removeJsComments = (code)=>{     
    return code.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');  
}