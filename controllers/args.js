import db from '../config/database'

export const query_args=async (ctx)=>{
    const sql = `select * from system_arg where tableid=? order by type DESC`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }


export const delete_args=async (ctx)=>{
    const sql = `delete from system_arg where id=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const update_args=async (ctx)=>{
    const { id, alias, oper, type } = ctx.query
    const sql = `update system_arg set alias=? ,oper=? ,type=?   where id=?`
    const res = await db.query(sql,[alias , oper , type , id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const create_args=async (ctx)=>{
    const { alias, oper, type ,tableid} = ctx.query
    const sql = `insert into  system_arg(alias , oper ,type ,tableid) values (? , ? , ? ,?)`
    const res = await db.query(sql,[alias , oper , type , tableid])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }
export const import_args=async (ctx)=>{
    
}