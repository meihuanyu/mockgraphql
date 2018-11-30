import db from '../config/database'
import { updateData ,addData} from './sql'
export const query_comArgs=async (ctx)=>{
    const sql = `select * from d_function`
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
    from system_project p,graphql_table t,d_api api,
    d_api_link_fun link,d_function fun 
    where p.id=t.projectid and api.tableid=t.id 
    and link.aid=api.id and link.cfid=fun.id
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
    const res = await addData('d_api_link_fun',{
      cfid:cfid,
      aid:fid
    })
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

  export const delete_linkComArgs=async (ctx)=>{
    const sql = `delete from d_api_link_fun where id=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const delete_comArgs=async (ctx)=>{
    const sql = `delete from d_function where id=?`
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
    
    const res = await updateData('d_function',{
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
    
    const res = await addData('d_function',{
      name, type ,relationid,isupdate,isdelete,iscreate,issingle,islist,isindex,tableid
    })
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }