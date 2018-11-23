import db from '../config/database'
import {addData} from '../controllers/sql'
var jwt = require('jsonwebtoken');

export const getTables = async function(ctx,next){
    const token=ctx.header.authorization
    var decoded 
    try {
        decoded = jwt.verify(token, '123qwe');
    } catch(err) {
          ctx.status=401
          return false
    }
    const project=await db.query('select * from system_project where userid='+decoded.id)
    if(!project[0]){
        ctx.body={
            success:true,
            data:[]
        }
        return false
    }
    const sql='select id,tablename,descinfo from graphql_table where  projectid='+project[0].id;
    let res=await db.query(sql);
    for(let i=0;i<res.length;i++){
        res[i].tablename=res[i].tablename.split(res[i].tablename.split("_")[0]+"_")[1]
    }
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
export const query_grant= async function(ctx,query){
    const res= await db.query(`select * from d_menugrant where rid=${ctx.query.roleid}`)
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
    const req=ctx.query
    let sql ="UPDATE graphql_field SET fieldname='"+req.fieldname+"' , fieldtype='"+req.fieldtype+"' , issingleorlist="+req.issingleorlist+" , relationtableid="+req.relationtableid+" , isdeleteindex="+req.isdeleteindex+" , isqueryindex="+req.isqueryindex+" , isupdateindex="+req.isupdateindex+" , istype="+req.istype+" , isupdate="+req.isupdate+" WHERE id="+ctx.query.id;
    const res=await db.query(sql);
    
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
export const deleteFields = async function(ctx,next){
    const resField=await db.query("select * from graphql_field where id="+ctx.query.id)
    const resTable=await db.query("select * from graphql_table where id="+resField[0].relationtableid)
    const field=resField[0]
    const table=resTable[0]
    if(field.fieldtype=='graphqlObj'){
        //查对象 和 对象数组
        const middleTable=field.fieldrelationtablename;
        if(field.issingleorlist){
            const middleTableName=table.tablename+"_"+middleTable;
            const resTable=await db.query("select * from graphql_table where tablename='"+middleTableName+"'");
            
            const middleId=field.id;
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
    db.query("alter table "+table.tablename+" drop "+field.fieldname)
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
    const opts = ctx.query;
    let sql="";
    let res=""
    const resTable=await db.query("select * from graphql_table where id="+opts.relationtableid)
    const resProject=await db.query("select * from system_project where id="+resTable[0].projectid)

    const projectName=resProject[0].apikey
    const ProjectName_tableName=projectName+"_"+opts['tablename'];

    const {fieldname,fieldtype,relationtableid,isdeleteindex,isupdateindex,isupdate,isqueryindex,issingleorlist,fieldrelationtablename,istype}=opts;
    //存入字段表
    //如果是对象 存入字段表 目标表增加关系id字段类型
    //如果不是对象 存入字段表 新增表的结构
    if(opts.fieldtype=='graphqlObj'){
        const _tableName=opts['tablename'];
        if(opts.issingleorlist=="1"){
            //多对多关系 
            const _realtionTableName=opts['fieldrelationtablename'];
            const middleTable=ProjectName_tableName+"_"+_realtionTableName;
            //创建中转表
            const  createTableSql="CREATE TABLE IF NOT EXISTS `"+(middleTable)+"`("+
                "`id` INT UNSIGNED AUTO_INCREMENT,`"+(_tableName+"id")+"` int(11) NOT NULL,`"+(_realtionTableName+"id")+"` int(11) NOT NULL,PRIMARY KEY ( `id` )"+
                ")ENGINE=InnoDB DEFAULT CHARSET=utf8;"
            await db.query(createTableSql);
            console.log('create创建中转表')
            //把中间表放入 mock系统内
            //添加到 graphql table
            const desc=_tableName+"到"+_realtionTableName+"中转表";
            const insertlTableSql="insert into graphql_table(tablename,descinfo,type) values('"+middleTable+"','"+desc+"',"+1+")"
            const resTable=await db.query(insertlTableSql);
            const tableid=resTable.insertId;
            console.log('insert中专表到graphql_table')
            //添加到 graphql field
            await addData('graphql_field',[
                {fieldname:"id",                   fieldtype:"int",relationtableid:tableid,isdeleteindex:1,isqueryindex:1,isupdateindex:1,isupdate:1},
                {fieldname:_tableName+"id",        fieldtype:"int",relationtableid:tableid,isdeleteindex:1,isqueryindex:1,isupdateindex:1,isupdate:1},
                {fieldname:_realtionTableName+"id",fieldtype:"int",relationtableid:tableid,isdeleteindex:1,isqueryindex:1,isupdateindex:1,isupdate:1}
            ])

            console.log('INSERT 到 graphql_field')
        }else{
            //单个
            const addsql="alter table "+ProjectName_tableName+" add "+(opts.fieldrelationtablename+"id ")+"int(11);"
            await db.query(addsql)
        }

        //原表新增一个字段
        const addFieldSql="alter table "+ProjectName_tableName+" add "+ opts.fieldname+" int(11);"
        await db.query(addFieldSql);  
        console.log("原表新增字段")
        //graphql_field表添加一个记录
        res=await addData('graphql_field',{fieldname,fieldtype,relationtableid,issingleorlist,fieldrelationtablename,istype})
    }else{
        await _addField(opts.fieldname,opts.fieldtype,opts.relationtableid)
        res=await addData('graphql_field',{fieldname,fieldtype,relationtableid,isdeleteindex,isupdateindex,isqueryindex,isupdate,istype})
    }
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
export const createTable=async function(ctx,next){
    const opts = ctx.query;
    const project=await db.query('select * from system_project where id='+opts.projectid)
    const qianzui=project[0].apikey;
    const sql="insert into graphql_table (tablename,descinfo,projectid) values('"+(qianzui+"_"+opts.tablename)+"','"+opts.descinfo+"',"+opts.projectid+")"
    const insertres=await db.query(sql);
    const res =await _createTable(qianzui+"_"+opts.tablename,insertres.insertId)
    if(res){
        ctx.body={
            success:true
        }
    }
}
export const querySchme=async function(apikey){
    const queryProjectSql="select * from system_project where apikey='"+apikey+"'"
    const resProject=await db.query(queryProjectSql)
    let fields={};
    let tFuns={};
    let tArgs={}
    let tablesql="";
    let tables={}
    let tComFuns={}
    const projectName=apikey
    if(apikey=='system'){
        tablesql="select * from graphql_table";
    }else{
        tablesql="select * from graphql_table where projectid="+resProject[0].id;
    }
    const tableData=await db.query(tablesql);
    const tIds = tableData.map(item=>item.id)

    //查询对应的字段  转换成对象 id:[{},{}]
    const fieldsArr=await db.query("select f.*,t.tablename fieldrelationtablename from graphql_field f left join graphql_table t on f.graprelationid=t.id where "+orToSql(tIds,'f.relationtableid'))
    let  _fieldsObj = arrToObj(fieldsArr,'relationtableid')

    //查询对应的方法
    const funsArr = await db.query(`SELECT funName,alias,oper,sf.type isNew,scf.type,dcription, tableid FROM  
    (system_function sf left join system_common_link_fun clf  on clf.fid=sf.id )
    left join
    system_common_function scf
    on
    scf.id=clf.cfid
    where `+orToSql(tIds,'tableid')) 
    console.log(funsArr)
    for(let i=0; i<funsArr.length;i++){
        const {oper,alias,tableid} = funsArr[i]
        const index = tIds.indexOf(tableid)
        const tableName = tableData[index].tablename.split(projectName+"_")[1]
        if(!tableName){ continue}
        const api_name=alias?alias:tableName+'_'+oper
        funsArr[i].tablename=tableName
        //此处 befor数据有问题
        if(!tFuns[api_name]){
            tFuns[api_name] = funsArr[i]
        }else{
            if(!tFuns[api_name].afterFunction){
                tFuns[api_name].afterFunction=[]
            }
            if(!tFuns[api_name].beforFunction){
                tFuns[api_name].beforFunction=[]
            }
            const { funName , type} = funsArr[i]
            if(type==='new'){
                tFuns[api_name].newFunction=funName
            }else if(type==='after'){
                tFuns[api_name].afterFunction.push(funName)
            }else if(type==='befor'){
                tFuns[api_name].beforFunction.push(funName)
            }
        }               
        
    }
    //查询对应公共方法
    const fIds = funsArr.map(item=>item.id)
    // const commonFunArr = await db.query(`SELECT mf.id,mf.dcription,mf.funName,mf.type,cf.oper,cf.alias,cf.tableid FROM  system_common_function mf,system_common_link_fun clf,system_function cf  where clf.id=mf.id and clf.fid=cf.id and (${orToSql(fIds,'cf.id')})`)
    // for(let i=0; i < commonFunArr.length;i++){
    //     const {oper,alias,tableid} = commonFunArr[i]
    //     const index = tIds.indexOf(tableid)
    //     const tableName = tableData[index].tablename.split(projectName+"_")[1]
    //     if(!tableName){ continue}
    //     const api_name=alias?alias:tableName+'_'+oper
    //     commonFunArr[i].tablename=tableName
    //     tComFuns[api_name] = commonFunArr[i]
    // }
    //查询对应的参数 
    const argsArr = await db.query(`select  a.*,t.tablename relationtablename from system_arg a left join graphql_table t on a.relationid=t.id where (${orToSql(tIds,'a.tableid')})`)
    let _argsObj = arrToObj(argsArr.map(item=>{
        item.relationtablename=item.relationtablename?item.relationtablename.split(projectName+"_")[1]:"";
        return item}),'tableid')

    for(let i=0;i<tableData.length;i++){
        const _name=tableData[i].tablename
        const _id=tableData[i].id
        /** 用apikey 过滤表名   */
        const tableName=_name.split(projectName+"_")[1]

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
        "`id` INT UNSIGNED AUTO_INCREMENT,`createdAt` DATE,`updatedAt` DATE,PRIMARY KEY ( `id` )"+
        ")ENGINE=InnoDB DEFAULT CHARSET=utf8;"
    let res=await db.query(sql);  
    //默认id状态
    const insertsql="INSERT INTO graphql_field  (fieldname,fieldtype,relationtableid,isdeleteindex,isqueryindex,isupdateindex,isupdate)"+ 
    "values ('id','int',"+tableid+",1,1,1,1)"
    res=await db.query(insertsql);
    return res
}
const _addField = async function(field,type,tableid){
    const tableres=await db.query("select tablename from graphql_table where id="+tableid)
    const tableName=tableres[0].tablename
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