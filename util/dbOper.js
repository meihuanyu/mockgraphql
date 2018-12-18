
import {addData , updateData ,getData,deleteData,getOneData} from '../controllers/sql'
const clearRequire = (_path)=>{
    var path = require('path');
    var pwd = path.resolve();
    pwd += _path;
    delete require.cache[pwd]; 
}
//params.type:single list delete create update
const beforRunFun = async (params,tableName,root,api,obj) =>{
    // const comObj = this.tComFuns
    // if(comObj[api] && comObj[api].type=='befor'){
    //     //刷新 require的缓存
    //     this.clearRequire("\\commonFun\\" +comObj[api].funName+ ".js")
    //     params =  await require(`../commonFun/${comObj[api].funName}.js`)(params,tableName,type)
    // }
    const real_funs =  obj[api].beforFunction
    if(real_funs){
        for(let i=0;i<real_funs.length;i++){
            const funName = real_funs[i].funName
            // this.clearRequire("\\commonFun\\" +funName+ ".js")
            params =  await require(`../commonFun/${funName}.js`)(params,tableName,'占位oper',root)
        }
    }
    return params
}
const  afterRunFun= async(params,tableName,res,type,api,obj)=>{
    // const comObj = this.tComFuns
    // if(comObj[api] && comObj[api].type=='after'){
    //     res =  await require(`../commonFun/${api}.js`)(params,tableName,type,res)
    // }
    if(obj[api] && obj[api].type==="after" ){
        res=await require(`../functions/${tableName}/${api}.js`)(params,tableName,type,res)

    }else{         
        return res
    }
}
const  dbOper = async (operType,params,tableName,api,root,projectName,allData) =>{
    let res
    params = await beforRunFun(params,tableName,root,api,allData.funs)
    if(operType === 'single'){
        res = await getOneData(projectName+"_"+tableName,params)   
    }else if(operType === 'list'){
        res = await getData(projectName+"_"+tableName,params)   
    }else if(operType === 'delete'){
        res = await deleteData(projectName+"_"+tableName,params)
    }else if(operType === 'update'){

        const tableName_project=projectName+"_"+tableName
        const ids = allData.args[tableName].filter(item=>item.isindex)
        const whereIndexSql = ids.map(item=>` ${item.name}=${params[item.name]} `)
        res = await updateData(tableName_project,params,whereIndexSql.join('and'))   
          
    }else if(operType === 'create'){
        let resTable = {}
        const argNames=allData.args[tableName].map(item=>item.name)
        const gObjs= allData.paramsObj[tableName].filter(item=>{return item.fieldtype==='graphqlObj' && argNames.indexOf(item.fieldname)!==-1})
        
        //graphql类型的字段会根据自己的create
        for(let i=0; i<gObjs.length;i++){
            const thisFieldName = gObjs[i].fieldname
            const viceTable=gObjs[i].fieldrelationtablename
            const graphqlObjTableName = projectName+'_'+viceTable
            //判断grap字段 有没有关联表
            if(gObjs[i].issingleorlist){
                //多个个创建

                /*创建原始表的数据  */
                resTable=await addData(projectName+"_"+tableName,params)
                /** 没有传值 则不去创建graphqlObj 也无需关联中间表 */
                if(params[thisFieldName]){
                    let transferParams = []
                    const transferTableName = projectName+'_'+tableName+'_'+viceTable

                    /** 创建grapqlObj 数据 */
                    const grapObjRes = await addData(graphqlObjTableName,params[thisFieldName])
                    /** 返回的insertId 去叠加取id */
                    for(let i=0;i<grapObjRes.affectedRows;i++){
                        let tempT = {}
                        tempT[viceTable+'id'] = grapObjRes.insertId+i
                        tempT[tableName+'id'] = resTable.insertId
                        transferParams.push(tempT)
                    }
                    /** insert 中间表关联数据 */
                    addData(transferTableName,transferParams)
                }
                
            }else{
                //单个创建
                const resCur=await await addData(graphqlObjTableName,params[thisFieldName])
                params[viceTable+'id'] = resCur.insertId

                /*创建原始表的数据  */
                resTable=await addData(projectName+"_"+tableName,params)
            }
        }
        // 正常create  无graphqlObj字段
        if(!gObjs.length){
            /*创建原始表的数据  */
            resTable=await addData(projectName+"_"+tableName,params)
        }

    }
                         
    return afterRunFun(params,tableName,res,root,api,allData.funs);
}

export default dbOper