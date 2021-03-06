import db from '../config/database'
import {addData,getOneData, getData} from '../controllers/sql'
var jwt = require('jsonwebtoken');

export const getTables = async function(ctx,next){
    const sql='select id,tablename,descinfo from graphql_table where  projectid=?';
    let res=await db.query(sql,[ctx.query.pid]);
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}

export const getFields = async function(ctx,next){
    const sql='select f.*,t.tablename fieldrelationtablename from graphql_field f left join graphql_table t on f.graprelationid=t.id  where relationtableid='+ctx.query.id;
    const res=await db.query(sql);
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
export const updateFields = async function(ctx,next){
    const {fieldtype,istype } = ctx.query
    let sql =`UPDATE graphql_field SET fieldtype=? ,istype=?  WHERE id=${ctx.query.id}`;
    const res=await db.query(sql,[fieldtype,istype]);
    
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
export const deleteFields = async function(ctx,next){
    const resField=await db.query("select f.*,t.tablename,t.projectid from graphql_field f ,graphql_table t where f.graprelationid=t.id and f.id="+ctx.query.id)

    const resTable=await db.query("select * from graphql_table where id="+resField[0].relationtableid)

    const resProject               = await getOneData('system_project',{id:resTable[0].projectid})
    const projectName              = resProject.apikey

    const field = resField[0]
    const table = resTable[0]

    if(field.fieldtype=='graphqlObj'){
        //查对象 和 对象数组
        const middleTable=field.tablename
        if(field.issingleorlist){
            const _middleTableName = table.tablename + "_" + field.tablename
            const resRealtionTable = await getOneData('graphql_table',{tablename:_middleTableName,type:1})
            const middleTableName  = projectName+"_"+resRealtionTable.tablename
            const middleId         = resRealtionTable.id
            //删除table
            db.query("DROP TABLE "+middleTableName)
            console.log('删除中间表...'+middleTableName)

            //删除关联表fields
            console.log("delete from graphql_field where relationtableid="+middleId)
            db.query("delete from graphql_field where relationtableid="+middleId)
            console.log("删除field表字段")

            //删除table
            db.query("delete from graphql_table where id="+middleId)
            console.log('删除table表字段'+middleId)
        }else{
            await db.query("alter table "+table.tablename+" drop "+middleTable+"id")
            console.log('删除原表字段id'+middleTable)
        }
        
    }
    db.query("alter table "+projectName+"_"+table.tablename+" drop "+field.fieldname)
    console.log('删除原表字段'+field.fieldname)

    let sql ="delete  from graphql_field where id="+ctx.query.id;
    const res=await db.query(sql);
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
export const createField=async function(ctx,next){    
    const {fieldname,fieldtype,relationtableid,issingleorlist,graprelationid,istype}=ctx.query;
    let res=""
    const relationTable =  await getOneData('graphql_table',{
        id:relationtableid
    }) 
    const projectid                = relationTable.projectid
    const resProject               = await getOneData('system_project',{id:projectid})
    const projectName              = resProject.apikey
    const mainTableName            = relationTable.tablename
    const projectAndMainTableName  = projectName+"_"+mainTableName
    //存入字段表
    //如果是对象 存入字段表 目标表增加关系id字段类型
    //如果不是对象 存入字段表 新增表的结构
    if(fieldtype=='graphqlObj'){
        const grapTable =  await getOneData('graphql_table',{
            id:graprelationid
        }) 
        const viceTableName  = grapTable.tablename
        if(issingleorlist == "1"){
            //多对多关系 
            const middleTable    = projectName+"_"+mainTableName+"_"+viceTableName;
            //创建中转表
            const  createTableSql="CREATE TABLE IF NOT EXISTS `"+(middleTable)+"`("+
                "`id` INT UNSIGNED AUTO_INCREMENT,`"+(mainTableName+"id")+"` int(11) NOT NULL,`"+(viceTableName+"id")+"` int(11) NOT NULL,PRIMARY KEY ( `id` )"+
                ")ENGINE=InnoDB DEFAULT CHARSET=utf8;"
            await db.query(createTableSql);
            console.log('create创建中转表')
            //把中间表放入 mock系统内
            //添加到 graphql table
            const desc=mainTableName+"到"+viceTableName+"中转表";
            const resTable=await addData('graphql_table',{
                tablename:mainTableName+"_"+viceTableName,
                descinfo:desc,
                type:1
            })
            const tableid=resTable.insertId;
            console.log('insert中专表到graphql_table')
            //添加到 graphql field
            await addData('graphql_field',[
                {fieldname:"id",                   fieldtype:"int",relationtableid:tableid},
                {fieldname:mainTableName+"id",        fieldtype:"int",relationtableid:tableid},
                {fieldname:viceTableName+"id",fieldtype:"int",relationtableid:tableid}
            ])

            console.log('INSERT 到 graphql_field')
        }else{
            //单个
            const addsql = "alter table "+projectAndMainTableName+" add "+(viceTableName+"id ")+"int(11);"
            console.log(addsql)
            await db.query(addsql)
        }
        //原表新增一个字段
        const addFieldSql="alter table "+projectAndMainTableName+" add "+ fieldname+" int(11);"
        console.log(addFieldSql)
        await db.query(addFieldSql);  
        //graphql_field表添加一个记录
        res=await addData('graphql_field',{fieldname,fieldtype,relationtableid,graprelationid,issingleorlist,istype})
    }else{
        await _addField(fieldname,fieldtype,projectAndMainTableName)
        res=await addData('graphql_field',{fieldname,fieldtype,relationtableid,istype,issingleorlist})
    }
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
export const createTable=async function(ctx,next){
    const { tablename,descinfo,projectid} = ctx.query;
    const resProjects = await db.query(`select apikey from system_project where id=?`,[projectid]) 
    const apiKey = resProjects[0].apikey
    const insertRes = await addData('graphql_table',{
        tablename,
        descinfo,
        projectid
    })
    const res =await _createTable(apiKey+"_"+tablename,insertRes.insertId)
    if(res){
        ctx.body={
            success:true
        }
    }
}
export const querySchme=async function(apikey){
    const resProject=await getOneData('system_project',{apikey})
    let fields={};
    let tFuns={};
    let tArgs={}
    let tables={}
    const projectName=apikey
    const tableData=await getData('graphql_table',{projectid:resProject.id})
    const tIds = tableData.map(item=>item.id)

    //查询对应的字段  转换成对象 id:[{},{}]
    const fieldsArr=await db.query("select f.*,t.tablename fieldrelationtablename from graphql_field f left join graphql_table t on f.graprelationid=t.id where "+orToSql(tIds,'f.relationtableid'))
    let  _fieldsObj = arrToObj(fieldsArr,'relationtableid')

    //查询对应的方法
    const funsArr = await db.query(`select funName,alias,oper,api.type isNew,fun.type comType,dcription, tableid from 
    d_api api LEFT JOIN d_api_link_pfun lpf
    on api.id=lpf.aid
    LEFT JOIN
    d_fun_link_project flp
    on lpf.fpid=flp.id
    LEFT JOIN
    d_function fun
    on flp.fid=fun.id
    where `+orToSql(tIds,'tableid')) 
    for(let i=0; i<funsArr.length;i++){
        const {oper,alias,tableid,funName,comType,isNew} = funsArr[i]
        const index = tIds.indexOf(tableid)
        const tableName = tableData[index].tablename
        if(!tableName){ continue}
        const api_name=alias?alias:tableName+'_'+oper
        funsArr[i].tablename=tableName

        //此处 befor数据有问题
        //如果生成的apiname一样 需要用new类型接口作为主体 after befor 拼凑参数
        //如果有funName 说明被关联了 公共方法
        if(funName){
            tFuns[api_name] = tFuns[api_name]?tFuns[api_name]:{}
            if(comType === 'after'){
                if(tFuns[api_name].afterFunction){
                    tFuns[api_name].afterFunction.push({funName,oper})
                }else{
                    if(isNew === 'original'){ 
                        tFuns[api_name] = Object.assign(funsArr[i],{afterFunction:[{funName,oper}]})
                    }else{
                        tFuns[api_name].afterFunction = [{funName,oper}]
                    }
                }  
            }else if(comType === 'befor'){
                if(tFuns[api_name].beforFunction){
                    tFuns[api_name].beforFunction.push({funName,oper})
                }else{
                    if(isNew === 'original'){ 
                        tFuns[api_name] = Object.assign(funsArr[i],{beforFunction:[{funName,oper}]})
                    }else{
                        tFuns[api_name].beforFunction = [{funName,oper}]
                    }
                } 
            }else if(comType === 'new'){
                tFuns[api_name] = Object.assign(tFuns[api_name],funsArr[i])
            }
        }else{
            tFuns[api_name] = funsArr[i]
        }                           
    }
    //查询对应的参数 
    const argsArr = await db.query(`select  a.*,t.tablename relationtablename from graohql_arg a left join graphql_table t on a.relationid=t.id where (${orToSql(tIds,'a.tableid')})`)
    let _argsObj = arrToObj(argsArr.map(item=>{
        item.relationtablename=item.relationtablename?item.relationtablename:"";
        return item}),'tableid')

    for(let i=0;i<tableData.length;i++){
        const _name=tableData[i].tablename
        const _id=tableData[i].id
        /** 用apikey 过滤表名   */
        const tableName=_name

        //对应的字段
        fields[tableName]=_fieldsObj[_id]

        //对应的参数
        tArgs[tableName]=_argsObj[_id]

        //对应表格
        tables[tableName] = tableData[i]
    }
    return {tFuns,fields,projectName,tArgs,tables};
}
// 数组转对象数组 以arr的一个对象内的key 为最终返回的key
const arrToObj = function (arr,key){
    let _obj = {}
    for(let i=0;i<arr.length;i++){
        if(_obj[arr[i][key]]){
            _obj[arr[i][key]].push(arr[i])
        }else{
            _obj[arr[i][key]]=[arr[i]]
        }
    }
    return _obj
}
const _createTable=async function(tablename,tableid){
    const  sql="CREATE TABLE IF NOT EXISTS `"+tablename+"`("+
        "`id` INT UNSIGNED AUTO_INCREMENT,`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,PRIMARY KEY ( `id` )"+
        ")ENGINE=InnoDB DEFAULT CHARSET=utf8;"
    db.query(sql);  
    //默认id状态
    const res = await addData('graphql_field',{
        fieldname:"id",
        fieldtype:"int",
        relationtableid:tableid,
        istype:1
    })
    return res
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
const orToSql=function (arr,key="id"){
    var _where=""
    for(var i=0;i<arr.length;i++){
        if(i==arr.length-1){
            _where+=key+"="+arr[i]
        }else{
            _where+=key+"="+arr[i]+" or "
        }
    }
    return _where
}