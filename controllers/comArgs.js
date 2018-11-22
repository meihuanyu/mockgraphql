import db from '../config/database'
import { updateData ,addData} from './sql'
export const query_comArgs=async (ctx)=>{
    const sql = `select * from system_common_function`
    const res = await db.query(sql)
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }
  export const query_comArgsLinkFunction=async (ctx)=>{

    const sql = `select sf.*,lf.id linkid,t.tablename,p.apikey from system_common_link_fun lf,system_function sf,graphql_table t ,system_project p where  lf.fid=sf.id and t.id=sf.tableid and t.projectid=p.id and lf.cfid=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res.map(item=>{
            item.tablename=item.tablename.split(item.apikey+"_")[1]
            return item
          })
      }
    }
  }
  export const create_link_com=async (ctx)=>{
    const { cfid , fid} = ctx.query
    const res = await addData('system_common_link_fun',{
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
    const sql = `delete from system_common_link_fun where id=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const delete_comArgs=async (ctx)=>{
    const sql = `delete from system_common_function where id=?`
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
    
    const res = await updateData('system_common_function',{
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
    
    const res = await addData('system_common_function',{
      name, type ,relationid,isupdate,isdelete,iscreate,issingle,islist,isindex,tableid
    })
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }