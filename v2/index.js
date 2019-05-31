import {dbOper} from '../util/dbOper'
// import redis from '../config/redis'
import {addData,getOneData, getData , updateData} from '../util/sql'
import db from '../config/database'

export const functionOper = async (ctx)=>{
  const functionName = ctx.params.function
  const apiKey = ctx.params.apiKey
  let params = ctx.request.query
  const project = await getOneData('system_project',{apiKey})
  const tables = await getData('system_table' , {projectId : project.id})
  const ids = tables.map(item => `tableId = '${item.id}'`)
  const apis = await db.query("SELECT * from system_api where " + ids.join(" or "))
  let tableMap = {}
  for(let i=0;i<tables.length;i++){
    tableMap[tables[i].id] = tables[i]
  }

  let apiMap = {};
  for(let i=0;i<apis.length;i++){
    const path = tableMap[apis[i].tableId].name + "_" + apis[i].oper
    apiMap[path] = {...apis[i] , tableName:tableMap[apis[i].tableId].name}
  }

  if(apiMap[functionName]){
      const { tableName , oper} = apiMap[functionName]
      const args = await db.query("SELECT * from system_arg where " + ids.join(" or "))
      let argMap = {};
      for(let i=0;i<tables.length;i++){
        argMap[tables[i].name] = args.filter(item => item.tableId === tables[i].id)
      }
      params = matchingParams(params,oper,tableName,argMap)
      const allData = {
        apiMap,
        argMap
      }
      console.log(params)
      const res = await dbOper(oper,params,tableName,functionName,ctx,project.apiKey,allData)
      ctx.body = {
          data:res,
          success:true
        }
  }else{
    ctx.body = {
      msg:"你访问的接口不存在",
      success:false
    }
  }
}
//过滤参数 
const matchingParams = (params,oper,tablename,args) =>{
  let realParams = {} 
  const tableArgs  = args[tablename]
  const paramsFields = tableArgs.filter(item=>item['is'+oper])
  for(const field of paramsFields){
    if(params[field.name]){
      realParams[field.name] = params[field.name]
    }
  }
  return realParams
}