import db from '../config/database'
import {addData,getOneData, getData , updateData} from '../util/sql'
const router = require('koa-router')()

const query_args=async (ctx)=>{
    const sql = `select * from system_arg where tableId=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }


const delete_args=async (ctx)=>{
    const sql = `delete from system_arg where id=?`
    const res = await db.query(sql,[ctx.query.id])
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

const update_args=async (ctx)=>{
    const { name, type ,id,isupdate,isdelete,iscreate,issingle,islist,isindex} = ctx.query
    
    const res = await updateData('system_arg',{
      name,type,isupdate,isdelete,iscreate,issingle,islist,isindex
    }, {id})

    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }

const create_args=async (ctx)=>{
    const {  name, type ,tableid,tableId,isupdate,isdelete,iscreate,issingle,islist,isindex} = ctx.query
    
    const res = await addData('system_arg',{
      name, type ,tableid,isupdate,isdelete,iscreate,issingle,islist,isindex,tableId
    })
    if(res){
      ctx.body={
          success:true,
          data:res
      }
    }
  }
const import_args=async (ctx)=>{
  const { id } = ctx.query
  const fieldsSql = `select * from system_field where tableId=?`
  const argsSql = `select name from system_arg where tableId=${id}`
  const args = await db.query(argsSql)
  const argsName = args.map(item=>item.name)
  const fields = await db.query(fieldsSql,[id])
  let _values=[]
  for(let i=0;i<fields.length;i++){
    const {name,type,tableId} = fields[i]
    if(argsName.indexOf(name)===-1){
      _values.push(`('${name}','${type}',${tableId},1,1,1,1,1)`)
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
    const addArgsSql=`insert into system_arg (name,type,tableId,iscreate,isdelete,isupdate,issingle,islist) values ${_values}`
    const res = await db.query(addArgsSql)
    ctx.body={
      success:true,
      data:res
    }
  }
 
}
router.get('/app/query_args',query_args);
router.get('/app/delete_args',delete_args);
router.get('/app/update_args',update_args);
router.get('/app/create_args',create_args);
router.get('/app/import_args',import_args);

module.exports = router