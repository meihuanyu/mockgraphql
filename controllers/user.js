import db from '../config/database'

import md5 from 'md5'
export const  permissions=async function (ctx,next){
    const graphql_name=ctx.request.body.operationName
    
    const usertoken=ctx.header.authorization
    const user =await db.query('select roleid from user where token="'+usertoken+'"')
    if(!user[0].roleid){
        ctx.status=401
    }
    if(ctx.request.header.referer.split('/')[4]=="graphiql"){
        await next()
    }
    if(graphql_name){
            let tableName="",oper="",fIndex=graphql_name.length;
            for(let i=0;i<graphql_name.length;i++){
            if(graphql_name[i].toUpperCase()==graphql_name[i]){
                fIndex=i
            }
            }
            tableName=graphql_name.slice(0,fIndex)
            oper=graphql_name.slice(fIndex,graphql_name.length)
            const operObj={List:"table_query",Create:"table_add",Update:"table_update",Delete:"table_delete"}

            const psql="select * from permissions where roleid="+user[0].roleid+" and itable='"+tableName+"'"
            const res=await db.query(psql)
            if(res[0][operObj[oper]]){
                await next()
            }else{
                ctx.body={
                    success:false,
                    data:"无访问权限"
                }
            }
            
    }
}