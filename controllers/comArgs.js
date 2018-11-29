import db from '../config/database'
import { updateData ,addData} from './sql'
export const query_comArgs=async (ctx)=>{
    const sql = `select * from system_function`
    const res = await db.query(sql)
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }
  export const query_comArgsLinkFunction=async (ctx)=>{
    const sql = `select link.id,api.type,api.oper,api.alias,p.apikey,t.tablename
    from system_project p,graphql_table t,system_api api,
    system_link_fun link,system_function fun 
    where p.id=t.projectid and api.tableid=t.id 
    and link.fid=api.id and link.cfid=fun.id
    and p.id=? and fun.id=?`

    const res = await db.query(sql,[ctx.query.pid,ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }
  export const create_link_com=async (ctx)=>{
    const { cfid , fid} = ctx.query
    const res = await addData('system_link_fun',{
      cfid:cfid,
      fid:fid
    })
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

  export const delete_linkComArgs=async (ctx)=>{
    const sql = `delete from system_link_fun where id=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const delete_comArgs=async (ctx)=>{
    const sql = `delete from system_function where id=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const update_comArgs=async (ctx)=>{
    const { name, type ,relationid,id,isupdate,isdelete,iscreate,issingle,islist,isindex} = ctx.query
    
    const res = await updateData('system_function',{
      name,type,relationid,isupdate,isdelete,iscreate,issingle,islist,isindex
    },`id=${id}`)

    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const create_comArgs=async (ctx)=>{
    const {  name, type ,relationid,tableid,isupdate,isdelete,iscreate,issingle,islist,isindex} = ctx.query
    
    const res = await addData('system_function',{
      name, type ,relationid,isupdate,isdelete,iscreate,issingle,islist,isindex,tableid
    })
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }