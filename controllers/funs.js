import db from '../config/database'

export const query_funs=async (ctx)=>{
    const sql = `select * from system_api where tableid=? order by type DESC`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const query_project_funs=async (ctx)=>{
    const resProject = await db.query(`select * from system_project where userid=${ctx.user.id}`)
    //写死只要一个项目
    const projectId = resProject[0].id
    const resTable = await db.query(`select * from graphql_table where projectid=${projectId}`)
    
    const tablesSql = resTable.map(item=>{
      return ` tableid = ${item.id} `
    })

    const sql = `select f.*,t.tablename,p.apikey from system_api f, graphql_table t ,system_project p where f.tableid=t.id and t.projectid=p.id and (${tablesSql.join(' or ')}) order by type DESC`
    const res = await db.query(sql)
    if(res){
      ctx.body={
          success:true,
          data:res.map(item=>{
            const tablename=item.tablename
            const fileName = item.alias?item.alias:tablename+"_"+item.oper
            const path = `\/${tablename}/${fileName}`
            return {api:path,id:item.id}
          })
      }
    }
  }



export const delete_funs=async (ctx)=>{
    const sql = `delete from system_api where id=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const update_funs=async (ctx)=>{
    const { id, alias, oper, type } = ctx.query
    const sql = `update system_api set alias=? ,oper=? ,type=?   where id=?`
    const res = await db.query(sql,[alias , oper , type , id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const create_funs=async (ctx)=>{
    const { alias, oper, type ,tableid} = ctx.query
    const sql = `insert into  system_api(alias , oper ,type ,tableid) values (? , ? , ? ,?)`
    const res = await db.query(sql,[alias , oper , type , tableid])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }