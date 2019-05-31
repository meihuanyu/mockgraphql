
import {addData , updateData ,getData,deleteData,getOneData} from './sql'
import db from '../config/database'

const clearRequire = (_path)=>{
    var path = require('path');
    var pwd = path.resolve();
    pwd += _path;
    delete require.cache[pwd]; 
}
//params.type:single list delete create update
export const beforRunFun = async (params,tableName,root,api,funs) =>{
    const real_funs =  funs[api].beforFunction
    if(real_funs){
        for(let i=0;i<real_funs.length;i++){
            const funName = real_funs[i].funName
            // this.clearRequire("\\commonFun\\" +funName+ ".js")
            params =  await require(`../commonFun/${funName}.js`)(params,tableName,'占位oper',root)
        }
    }
    return params
}
export const  afterRunFun= async(params,tableName,res,api,funs)=>{
    if(funs[api] && funs[api].type==="after" ){
        res=await require(`../functions/${tableName}/${api}.js`)(params,tableName,type,res)

    }else{         
        return res
    }
}
const  newRunFun= async(params,tableName,ctx,api,funs ,apiKey)=>{
    console.log(funs)
    console.log(api)
    if(funs[api] && funs[api].type==="new" ){
        return await require(`../functions/${apiKey}/${api}.js`)(params,tableName,ctx)
    }else{         
        return {}
    }
}
export const  dbOper = async (operType,params,tableName,api,root,apiKey,allData) =>{
    let res
    params = await beforRunFun(params,tableName,root,api,allData.apiMap)
    if(allData.apiMap[api].type === 'new' ){
        res = await newRunFun(params,tableName,root,api,allData.apiMap , apiKey)
    }else{
        const relationFields = allData.fields.filter(item => item.relationTableId);
        if(operType === 'single'){
            res = await getOneData(apiKey+"_"+tableName,params)
            for(let i=0;i<relationFields.length;i++){
                const { relationTableId , name } = relationFields[i];
                // 关联表
                const relationTableName = allData.tableMap[relationTableId].name
                // 中间表表名称
                const middleName = apiKey + "_" + tableName + "_" +relationTableName
                
                const sql = `SELECT * from ${apiKey + "_" +relationTableName} f 
                where 
                f.id in (select df.${name}Id from ${middleName} df where df.${relationTableName}Id=1)`
                const resMiddleData = await db.query(sql)
                res[name] = resMiddleData
            }   
        }else if(operType === 'list'){
            res = await getData(apiKey+"_"+tableName,params)   
        }else if(operType === 'delete'){  
            res = await deleteData(apiKey+"_"+tableName,params)
        }else if(operType === 'update'){
            const tableName_project=apiKey+"_"+tableName
            const indexS = allData.argMap[tableName].filter(item=>item.isindex)

            let temp = {}
            for(let i=0;i<indexS.length;i++){
                temp[indexS[i].name] = params[indexS[i].name]
            }
            console.log(temp)
            res = await updateData(tableName_project,params,temp)   
            
        }else if(operType === 'create'){
            /*创建原始表的数据  */
            let resTable=await addData(apiKey+"_"+tableName,params)
            res = resTable
        }     
    }
                   
    return afterRunFun(params,tableName,res,root,api,allData.apiMap);
}
