import db from '../config/database'
export const getTables = async function(ctx,next){
    const usertoken=ctx.header.authorization
    const user =await db.query('select id from system_user where token="'+usertoken+'"')
    if(!user[0].id){
        ctx.status=401
    }
    const project=await db.query('select * from system_project where userid='+user[0].id)
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
//wait for test
export const deleteFields = async function(ctx,next){
    const resField=await db.query("select * from graphql_field where id="+ctx.query.id)
    const resTable=await db.query("select * from graphql_table where id="+resField[0].relationtableid)
    const field=resField[0]
    const table=resTable[0]
    if(field.fieldtype=='graphqlObj'){
        //查对象 和 对象数组
        if(field.issingleorlist){
            const middleTable=field.fieldrelationtablename;
            const middleTableName=table.tablename+"_"+middleTable;
            const resTable=await db.query("select * from graphql_table where tablename='"+middleTableName+"'");
            
            const middleId=resTable[0].id;
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
            await db.query("alter table "+table.tablename+" drop "+resField.fieldname+"id")
            console.log('删除原表字段id'+resField.fieldname)
        }
        
    }
    db.query("alter table "+table.tablename+" drop "+resField.fieldname)
    console.log('删除原表字段'+resField.fieldname)

    let sql ="delete  from graphql_field where id="+ctx.query.id;
    const res=await db.query(sql);
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
// no check
export const createField=async function(ctx,next){
    const opts = ctx.query;
    let sql="";
    //存入字段表
    //如果是对象 存入字段表 目标表增加关系id字段类型
    //如果不是对象 存入字段表 新增表的结构
    if(opts.fieldtype=='graphqlObj'){
        const _tableName=opts['tablename'];
        if(opts.issingleorlist=="1"){
            //多对多关系 
            const _realtionTableName=opts['fieldrelationtablename'];
            const middleTable=_tableName+"_"+_realtionTableName;
            //创建中转表
            const  createTableSql="CREATE TABLE IF NOT EXISTS `"+(middleTable)+"`("+
                "`id` INT UNSIGNED AUTO_INCREMENT,`"+(_tableName+"id")+"` int(11) NOT NULL,`"+(_realtionTableName+"id")+"` int(11) NOT NULL,PRIMARY KEY ( `id` )"+
                ")ENGINE=InnoDB DEFAULT CHARSET=utf8;"
            await db.query(createTableSql);
            //把中间表放入 mock系统内
            //添加到 graphql table
            const desc=_tableName+"到"+_realtionTableName+"中转表";
            const insertlTableSql="insert into graphql_table(tablename,descinfo,type) values('"+middleTable+"','"+desc+"',"+1+")"
            const resTable=await db.query(insertlTableSql);
            const tableid=resTable.insertId;

            //添加到 graphql field
            const insertFieldSql="INSERT INTO graphql_field  (fieldname,fieldtype,relationtableid,isdeleteindex,isqueryindex,isupdateindex,isupdate)"+ 
                        "values ('id','int',"+tableid+",1,1,1,1),"+
                        "('"+(_tableName+"id")+"','int',"+tableid+",1,1,1,1),"+
                        "('"+(_realtionTableName+"id")+"','int',"+tableid+",1,1,1,1)"
            await db.query(insertFieldSql);
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
        await _addField(opts.fieldname,opts.fieldtype,opts.relationtableid)
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
        let fData=await db.query(`select name,type from system_function where tableid=${tables[i].id}`)
        let befor=""
        let after=""
        let news=[]
        if(fData){
            for(let i=0;i<fData.length;i++){
                if(fData[i].type=="befor"){
                    befor=fData[i].name
                }else if(fData[i].type=="after"){
                    after=fData[i].name
                }else if(fData[i].type=="new"){
                    news.push(fData[i].name)
                }
            }        
            tFuns[tableName]={befor:befor,after:after,news:news}
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