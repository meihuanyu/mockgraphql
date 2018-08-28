import db from '../config/database'
export const getTables = async function(ctx,next){
    const usertoken=ctx.header.authorization
    const user =await db.query('select id from user where token="'+usertoken+'"')
    if(!user[0].id){
        ctx.status=401
    }
    const project=await db.query('select * from project where userid='+user[0].id)
    const sql='select id,tablename,descinfo from graphql_table where projectid='+project[0].id;
    const res=await db.query(sql);
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
    let sql ="UPDATE graphql_field SET fieldname='"+req.fieldname+"' , fieldtype='"+req.fieldtype+"' , issingleorlist="+req.issingleorlist+" , relationtableid="+req.relationtableid+" , isdeleteindex="+req.isdeleteindex+" , isqueryindex="+req.isqueryindex+" , isupdateindex="+req.isupdateindex+" , isupdate="+req.isupdate+" WHERE id="+ctx.query.id;
    const res=await db.query(sql);
    
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}

export const deleteFields = async function(ctx,next){
    let sql ="delete  from graphql_field where id="+ctx.query.id;
    const res=await db.query(sql);
    if(ctx.query.fieldtype=='graphqlObj'){

    }else{
        await db.query("alter table "+ctx.query.table+" drop "+ctx.query.fieldname)
        console.log('删除字段成功'+ctx.query.fieldname)
    }


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
    //存入字段表
    //如果是对象 存入字段表 目标表增加关系id字段类型
    //如果不是对象 存入字段表 新增表的结构
    if(opts.fieldtype=='graphqlObj'){
        const _tableName=opts['tablename'];
        if(opts.issingleorlist=="1"){
            //多对多关系 创建中转表
            const _realtionTableName=opts['fieldrelationtablename'];
            const middleTable=_tableName+"_"+_realtionTableName;

            const  createTableSql="CREATE TABLE IF NOT EXISTS `"+(middleTable)+"`("+
                "`id` INT UNSIGNED AUTO_INCREMENT,`"+(_tableName+"id")+"` int(11) NOT NULL,`"+(_realtionTableName+"id")+"` int(11) NOT NULL,PRIMARY KEY ( `id` )"+
                ")ENGINE=InnoDB DEFAULT CHARSET=utf8;"
            await db.query(createTableSql);  
        }else{
            //单个
            const addsql="alter table "+_tableName+" add "+(opts.fieldrelationtablename+"id ")+"int(11);"
            await db.query(addsql)
        }

        //原表新增一个字段
        const addFieldSql="alter table "+_tableName+" add "+ opts.fieldname+" int(11);"
        await db.query(addFieldSql);  

        //graphql_field表添加一个记录
        sql='INSERT INTO graphql_field (fieldname,fieldtype,relationtableid,issingleorlist,fieldrelationtablename) values('+
        "'"+opts.fieldname+"','"+opts.fieldtype+"',"+opts.relationtableid+","+opts.issingleorlist+",'"+opts.fieldrelationtablename+"')";
    }else{
        const addres =await _addField(opts.fieldname,opts.fieldtype,opts.relationtableid)
        sql='INSERT INTO graphql_field (fieldname,fieldtype,relationtableid,isdeleteindex,isqueryindex,isupdateindex,isupdate) values('+
        "'"+opts.fieldname+"','"+opts.fieldtype+"',"+opts.relationtableid+","+opts.isdeleteindex+","+opts.isqueryindex+","+opts.isupdateindex+","+opts.isupdate+')';
    }
    const res=await db.query(sql);
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
export const createTable=async function(ctx,next){
    const opts = ctx.query;
    const sql="insert into graphql_table (tablename,descinfo) values('"+opts.tablename+"','"+opts.descinfo+"')"
    const insertres=await db.query(sql);
    const res =await _createTable(opts.tablename,insertres.insertId)
    if(res){
        ctx.body={
            success:true
        }
    }
}
export const querySchme=async function(apikey){
    const queryProjectSql="select * from project where apikey='"+apikey+"'"
    const resProject=await db.query(queryProjectSql)
    let res={};
    let tablesql=""
    if(apikey=='system'){
        tablesql="select * from graphql_table";
    }else{
        tablesql="select * from graphql_table where projectid="+resProject[0].id;
    }
    
    const tables=await db.query(tablesql);
    for(let i=0;i<tables.length;i++){
        res[tables[i].tablename]=await db.query("select * from graphql_field where relationtableid="+tables[i].id)
    }
    return res;
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