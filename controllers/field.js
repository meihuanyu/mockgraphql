import db from '../config/database'
import {addData,getOneData, getData , updateData} from '../util/sql'

const router = require('koa-router')()

const getFields = async function(ctx,next){
    const res = await getData('system_field' , {tableId:ctx.query.id})
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
const updateFields = async function(ctx,next){
    const {name , type , isRes , tableId , id}=ctx.query;    
    const res=await updateData('system_field',{name , type , isRes , tableId} , {id})
    //  没有修改表里面 field
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
const createField=async function(ctx,next){    
    const {name , type , isRes , tableId}=ctx.query;
    const relationTable =  await getOneData('system_table',{
        id:tableId
    }) 
    const projectId                = relationTable.projectId
    const resProject               = await getOneData('system_project',{id:projectId})
    const projectName              = resProject.apiKey
    const mainTableName            = relationTable.name
    const projectAndMainTableName  = projectName+"_"+mainTableName
    await _addField(name,type,projectAndMainTableName)
    let res=await addData('system_field',{name , type , isRes , tableId})
    
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}

const deleteField = async function(ctx,next){
    const resField    = await getOneData('system_field' , {id:ctx.query.id})
    const resTable    = await getOneData('system_table' , {id :resField.tableId})
    const resProject  = await getOneData('system_project',{id:resTable.projectId})
    const projectName = resProject.apiKey
    db.query("alter table "+projectName+"_"+resTable.name+" drop "+resField.name)
    let sql ="delete  from system_field where id="+ctx.query.id;
    const res=await db.query(sql);
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
const _addField = async function(field,type,tableName){
    let num=0;
    if(type=="int"){
        num=11
    }else if(type="varchar"){
        num=128
    }
    const sql="alter table "+tableName+" add "+field+" "+type+"("+num+");"
    return db.query(sql)
}
router.get('/app/getFields',getFields);
router.get('/app/deleteField',deleteField);
router.get('/app/createField',createField);
router.get('/app/updateFields',updateFields);

module.exports = router