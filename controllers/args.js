import db from '../config/database'
import { updateData ,addData} from './sql'
export const query_args=async (ctx)=>{
    const sql = `select * from graohql_arg where tableid=? order by type DESC`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }


export const delete_args=async (ctx)=>{
    const sql = `delete from graohql_arg where id=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const update_args=async (ctx)=>{
    const { name, type ,relationid,id,isupdate,isdelete,iscreate,issingle,islist,isindex} = ctx.query
    
    const res = await updateData('graohql_arg',{
      name,type,relationid,isupdate,isdelete,iscreate,issingle,islist,isindex
    },`id=${id}`)

    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

export const create_args=async (ctx)=>{
    const {  name, type ,relationid,tableid,isupdate,isdelete,iscreate,issingle,islist,isindex} = ctx.query
    
    const res = await addData('graohql_arg',{
      name, type ,relationid,isupdate,isdelete,iscreate,issingle,islist,isindex,tableid
    })
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }
export const import_args=async (ctx)=>{
  const { id } = ctx.query
  const fieldsSql = `select fieldname name,fieldtype type,relationtableid tableid,graprelationid relationid from graphql_field where relationtableid=?`
  const argsSql = `select name from graohql_arg where tableid=${id}`
  const args = await db.query(argsSql)
  const argsName = args.map(item=>item.name)
  const fields = await db.query(fieldsSql,[id])
  let _values=[]
  for(let i=0;i<fields.length;i++){
    const {name,type,tableid,relationid} = fields[i]
    if(argsName.indexOf(name)===-1){
      _values.push(`('${name}','${type}',${tableid},${relationid},1,1,1,1,1)`)
    }
  }
  if(!_values.length){
    ctx.body={
      success:false,
      data:[],
      msg:"没有需要添加的默认参数"
    }
  }else{
    _values.join(',')
    const addArgsSql=`insert into graohql_arg (name,type,tableid,relationid,iscreate,isdelete,isupdate,issingle,islist) values ${_values}`
    console.log(addArgsSql)
    const res = await db.query(addArgsSql)
    ctx.body={
      success:true,
      data:res
    }
  }
 
}