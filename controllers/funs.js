import db from '../config/database'

export const query_fun=async (ctx)=>{
    const sql = `select * from system_function where tableid=? order by type DESC`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }


export const delete_fun=async (ctx)=>{
    const sql = `delete from system_function where id=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const update_fun=async (ctx)=>{
    const { id, alias, oper, type } = ctx.query
    const sql = `update system_function set alias=? ,oper=? ,type=?   where id=?`
    const res = await db.query(sql,[alias , oper , type , id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const create_fun=async (ctx)=>{
    const { alias, oper, type ,tableid} = ctx.query
    const sql = `insert into  system_function(alias , oper ,type ,tableid) values (? , ? , ? ,?)`
    const res = await db.query(sql,[alias , oper , type , tableid])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }