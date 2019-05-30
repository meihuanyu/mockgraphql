
import {addData , updateData ,getData,deleteData,getOneData} from './sql'
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
export const  afterRunFun= async(params,tableName,res,type,api,funs)=>{

    if(funs[api] && funs[api].type==="after" ){
        res=await require(`../functions/${tableName}/${api}.js`)(params,tableName,type,res)

    }else{         
        return res
    }
}
export const  dbOper = async (operType,params,tableName,api,root,apiKey,allData) =>{
    let res
    params = await beforRunFun(params,tableName,root,api,allData.apiMap)
    if(operType === 'single'){
        res = await getOneData(apiKey+"_"+tableName,params)   
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
    return afterRunFun(params,tableName,res,root,api,allData.apiMap);
}
