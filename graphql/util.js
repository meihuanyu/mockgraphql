import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    isOutputType,
    GraphQLInt,
    GraphQLInputObjectType
  } from 'graphql';
  
import db from '../config/database'

class Grouphqlquery{
    constructor (params){
        this.paramsObj={};
        this.tables=[];
        
        // return this.startSchema()
    }
    createRow(table){
        let _objectType= this.toObjectType(table,table+'create')
        const args=this.toArgs(table)
        let _query= this.createRowOper(table,_objectType,args)
        return _query;
    }
    deleteRow(table){
        let _objectType= this.toObjectType(table,table+'delete')
        const args=this.toArgs(table,'isdeleteindex')
        let _query= this.deleteRowOper(table,_objectType,args)
        return _query;
    }
    updateRow(table){
        const _objectType= this.toObjectType(table,table+'update')
        const args=this.toArgs(table,'isupdate')
        const _query= this.updateRowOper(table,_objectType,args)
        return _query;
    }
    getQueryList(table){
        let _objectType= this.toObjectType(table,table+'list')
        const args=this.toArgs(table,'isqueryindex')
        let _query= this.queryTableOper(table,_objectType,args)
        return _query;
    }
    getSingleRow(table){
        let _objectType= this.toObjectType(table,table)
        const args=this.toArgs(table,'isqueryindex')
        let _query= this.querySingleOper(table,_objectType,args)
        return _query
    }

    
    
    updateRowOper(tableName,Type,args){
        const _this=this
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                const sql=_this.toSql('update',params,tableName)
                console.log(sql)
                let xx=await db.query(sql);
                return  xx[0];
            }
        }
    }
    deleteRowOper(tableName,Type,args){
        const _this=this;
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                const sql=_this.toSql('delete',params,tableName)
                let xx=await db.query(sql);
                return  xx[0];
            }
        }
    }
    createRowOper(tableName,Type,args){
        const _this=this;
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                const table=_this.paramsObj[tableName];
                let fields=[]
                let values=[]
                for(let i=0;i<table.length;i++){
                    let _fieldname=table[i].fieldname
                    if(_fieldname=='id'){
                        continue
                    }
                    fields.push(_fieldname)
                    if(table[i].fieldtype=='int'){
                        values.push(params[_fieldname])
                    }else{
                        values.push('"'+params[_fieldname]+'"')
                    }
                }
                let sql ="INSERT INTO "+tableName+" ("+fields.toString()+") VALUES ("+values.toString()+")";
                const res=await db.query(sql);
                return {id:res.insertId}
            }
        }
    }
    queryTableOper(tableName,Type,args){
        let _this=this;
        return {
            type:new GraphQLList(Type),
            args:args,
            resolve(root,params,option){
                const sql=_this.toSql('query',params,tableName)
                return  db.query(sql);
            }
        }
    }
    querySingleOper(tableName,Type,args){
        let _this=this;
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                const sql=_this.toSql('query',params,tableName)
                const res=await db.query(sql)
                return  res[0];
            }
        }
    }
    /*
    * name 在 graphqlObj里是上一层的表名称
    */ 
    toGrahqlField(table,type,name){
        let fields={}
        for(let i=0;i<table.length;i++){
            if(table[i].fieldtype=='graphqlObj'){
                //如果需要引用别的类型
                const _this=this;
                const _fieldname=table[i].fieldname
                const _issingleorlist=table[i].issingleorlist
                let _type=this.toObjectType(_fieldname,type+_fieldname)
                _type=_issingleorlist?new GraphQLList(_type):_type
                fields[_fieldname]={
                    type:_type,
                    resolve:async function(thisItem){
                        const sql="select * from "+_fieldname+" where "+(name+"id")+"="+thisItem.id
                        let xx=await db.query(sql);
                        if(_issingleorlist){
                            return  xx;
                        }else{
                            return  xx[0];
                        }
                    }
                };
            }else{
                switch(table[i].fieldtype){
                    case "varchar":
                        fields[table[i].fieldname]={
                            type:GraphQLString
                        }
                        break;
                    case "int":
                        fields[table[i].fieldname]={
                            type:GraphQLInt
                        }
                        break;
                }
            }
        }
        return fields;
    }
    toObjectType(table,type){
        let _fields=this.toGrahqlField(this.paramsObj[table],type,table);
        return new GraphQLObjectType({
            name:type,
            fields:_fields
        })  
    }
    toGraphqlParams(fields){
        const keys=Object.keys(fields);
        for(let i=0;i<keys.length;i++){
            fields[keys[i]].name=keys[i]
        }
        return args
    }
    //通用 转换arg
    //table 表名称
    //Indexes 验证Indexes索引 是否需要生产args参数 ps：如果参数为空 默认生成所有
    toArgs(table,Indexes){
        const obj=this.paramsObj[table]
        //默认带上id
        let  args={}
        for(var i=0;i<obj.length;i++){
            let _fieldname=obj[i].fieldname
            if(!obj[i].graphqlObj && (!Indexes || obj[i][Indexes] || obj[i][Indexes+'index'])){
                switch(obj[i].fieldtype){
                    case "id":
                        args[_fieldname]={
                                name:_fieldname,
                                type:new GraphQLNonNull(GraphQLID)
                            }
                        break;
                    case "varchar":
                        args[_fieldname]={
                                name:_fieldname,
                                type:GraphQLString
                            }
                        break;
                    case "int":
                        args[_fieldname]={
                                name:_fieldname,
                                type:GraphQLInt
                            }
                        break;
                }
            }
        }
        return args
    }

    toSql(type,params,tableName){
        let sql=""
        if(type=="query"){
            let _where=this.toWhereSql(tableName,'isqueryindex',params)
            sql= "select * from "+tableName+(_where?" where "+_where:"");
        }else if(type=='update'){
            const setDatas=this.toWhereSql(tableName,'isupdate',params,',');
            const _where=this.toWhereSql(tableName,'isupdateindex',params);
            sql ="UPDATE "+tableName+" SET "+setDatas+" WHERE "+_where;
        }else if(type=='delete'){
            const _where=this.toWhereSql(tableName,'isdeleteindex',params);
            sql ="delete  from "+tableName+" where "+_where;
        }
        return sql
    }
    toUpdateSql(params){
        const keys=Object.keys(params);
        let setDatas=[]
        for(let i=0;i<keys.length;i++){
            setDatas.push(keys[i]+"='"+params[keys[i]]+"'")
        }
        return setDatas.join(",");
    }
    //通用 转换 where sql
    //table 表名称
    //Indexes 这里和toarg不一样  不传不会去生成
    //params 可选参数  与key对应 生成where

    toWhereSql(table,Indexes,params={},joinkey){
        const obj=this.paramsObj[table]
        //默认带上id
        let  _where=[]
        for(var i=0;i<obj.length;i++){
            let _fieldname=obj[i].fieldname
            //穿过来的值  1 不能使对象（graphqlobj）  2 有索引值    3 对应的key有传参
            if(!obj[i].graphqlObj && obj[i][Indexes] && (!params || params[_fieldname]!=undefined)){
                let value=params[_fieldname]
                if(obj[i].fieldtype=="varchar"){
                    value="'"+value+"'";
                    _where.push(_fieldname+"="+value)
                }else{
                    _where.push(_fieldname+"="+value)
                }
            }
        }
        return _where.join(joinkey?joinkey:' and ')
    }
}


export default Grouphqlquery;