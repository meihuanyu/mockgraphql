import db from '../config/database'
import {addData} from '../controllers/sql'
export const getTables = async function(ctx,next){
    const usertoken=ctx.header.authorization
    const user =await db.query('select id from system_user where token="'+usertoken+'"')
    if(!user[0].id){
        ctx.status=401
    }
    const project=await db.query('select * from system_project where userid='+user[0].id)
    if(!project[0]){
        ctx.body={
            success:true,
            data:[]
        }
        return false
    }
    const sql='select id,tablename,descinfo from graphql_table where projectid='+project[0].id;
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
    const sql='select * from graphql_field where relationtableid='+ctx.query.id;
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
    const sql="insert into graphql_table (tablename,descinfo,projectid) values('"+(ctx.captures[0]+"_"+opts.tablename)+"','"+opts.descinfo+"',"+opts.projectid+")"
    const insertres=await db.query(sql);
    const res =await _createTable(opts.tablename,insertres.insertId)
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
    let tablesql="";
    const projectName=apikey
    if(apikey=='system'){
        tablesql="select * from graphql_table";
    }else{
        tablesql="select * from graphql_table where projectid="+resProject[0].id;
    }
    
    const tables=await db.query(tablesql);
    for(let i=0;i<tables.length;i++){
        const tableName=tables[i].tablename.split(projectName+"_")[1]
        fields[tableName]=await db.query("select * from graphql_field where relationtableid="+tables[i].id)
        let fData=await db.query(`select name,type,isnew,oper from system_function where tableid=${tables[i].id}`)
        let befor=""
        let after=""
        let news=[]
        if(fData){
            let temp={}
            for(let i=0;i<fData.length;i++){
               if(fData[i].isnew){
                    news.push({name:fData[i].name,isquery:fData[i].isnew})
               }else{
                    temp[fData[i].oper]={type:fData[i].type,name:fData[i].name}
               }
            } 
            //class:{ list :{type:"xxx",name:"ggg"}}       
            tFuns[tableName]={...temp,news}
        }
    }
    return {tFuns,fields,projectName};
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

const toWhereSql=function(obj){
    let tempArr=[]
    const keys=Object.keys(obj)
    for(let i=0; i<keys.length;i++){
        if(keys[i]!='id' && keys[i]){
            if(obj[keys[i]]*1==obj[keys[i]] || obj[keys[i]]=="null"){
                tempArr.push(keys[i]+"="+obj[keys[i]])
            }else{
                tempArr.push(keys[i]+"='"+obj[keys[i]]+"'")
            }
        }
    }

    return tempArr.join(' , ')
}