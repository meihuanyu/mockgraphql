import db from '../config/database'
import { updateData ,addData} from './sql'
export const query_comArgs=async (ctx)=>{
    const sql = `select * from d_function fun,d_fun_link_project fp where fp.fid=fun.id and fp.pid=?`
    const res = await db.query(sql,[ctx.query.projectId])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }
  export const query_comArgsLinkFunction=async (ctx)=>{
    const sql = `select lpf.id,api.type,api.oper,api.alias,t.tablename 
    from d_api api ,d_api_link_pfun lpf,d_fun_link_project flp,graphql_table t 
    where api.id=lpf.aid and lpf.fpid=flp.id and api.tableid=t.id and flp.fid=? and flp.pid=?`

    const res = await db.query(sql,[ctx.query.fid,ctx.query.pid])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }
  export const create_link_com=async (ctx)=>{
    const { fpid , aid} = ctx.query
    const res = await addData('d_api_link_pfun',{
      fpid:fpid,
      aid:aid
    })
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

  export const delete_linkComArgs=async (ctx)=>{
    const sql = `delete from d_api_link_pfun where id=?`
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