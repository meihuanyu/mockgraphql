import {dbOper} from '../util/dbOper'
import redis from '../config/redis'

export const functionOper = async (ctx)=>{
  const functionName = ctx.params.function
  const projectName = ctx.params.api
  let params = ctx.request.query
  let schemaData = await redis.get('lol')
  schemaData = JSON.parse(schemaData)
  const functionData = schemaData.tFuns[functionName]
  if(functionData){
    const  {oper,tablename} = functionData
    params = matchingParams(params,oper,tablename,schemaData.tArgs)
    console.log(params)
    const res = await dbOper(oper,params,tablename,functionName,ctx,projectName,schemaData)
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