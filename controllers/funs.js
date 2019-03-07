import db from '../config/database'
const router = require('koa-router')()
const query_funs=async (ctx)=>{
    const sql = `select * from d_api where tableid=? order by type DESC`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

const query_project_funs=async (ctx)=>{
    const projectId = ctx.query.pid
    const resTable = await db.query(`select * from graphql_table where projectid=?`,[projectId])
    
    const tablesSql = resTable.map(item=>{
      return ` f.tableid = ${item.id} `
    })

    const sql = `select f.*,t.tablename,p.apikey from d_api f, graphql_table t ,system_project p 
    where f.tableid=t.id and t.projectid=p.id and (${tablesSql.join(' or ')}) order by type DESC`
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



const delete_funs=async (ctx)=>{
    const sql = `delete from d_api where id=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

const update_funs=async (ctx)=>{
    const { id, alias, oper, type } = ctx.query
    const sql = `update d_api set alias=? ,oper=? ,type=?   where id=?`
    const res = await db.query(sql,[alias , oper , type , id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

const create_funs=async (ctx)=>{
    const { alias, oper, type ,tableid} = ctx.query
    const sql = `insert into  d_api(alias , oper ,type ,tableid) values (? , ? , ? ,?)`
    const res = await db.query(sql,[alias , oper , type , tableid])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }


  router.get('/app/query_funs',query_funs);
  router.get('/app/delete_funs',delete_funs);
  router.get('/app/update_funs',update_funs);
  router.get('/app/create_funs',create_funs);
  router.get('/app/query_project_funs',query_project_funs);
  
  module.exports = router