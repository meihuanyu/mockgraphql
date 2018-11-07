import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
  } from 'graphql';
  
import db from '../config/database'
import {addData} from '../controllers/sql'
import { GraphQLUpload } from 'apollo-upload-server'
class Grouphqlquery{
    constructor (params){
        this.paramsObj={};
        this.tables=[];
        this.funs={}
        this.projectName=""
        
        // return this.startSchema()
    }
    //params.type:single list delete create update
    beforRunFun(params,tableName,type){
        const obj= this.funs[tableName]
        
        if(obj[type] && obj[type].type==="befor"){
            return  require(`../functions/${tableName}/${obj[type].name}.js`)(params,tableName,type)
        }else{
            return params
        }
        
    }
    afterRunFun(params,tableName,res,type){
        const obj= this.funs[tableName]
        if(obj[type] && obj[type].type==="after" ){
            const _res=require(`../functions/${tableName}/${obj[type].name}.js`)(params,tableName,type,res)
            return _res
        }else{
            let delete_keys=[]
            for(let key in this.paramsObj[tableName]){
                if(!this.paramsObj[tableName][key].istype){
                    delete_keys.push(key)
                }
            }
            if(Array.isArray(res)){
                for(let i=0;i<res.length;i++){
                    for(let i=0;i<delete_keys.length;i++){
                        delete res[i][delete_keys[i]]
                    }
                }
            }           
            return res
        }
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
                params=await _this.beforRunFun(params,tableName,root)
                const tableName_project=_this.projectName+"_"+tableName
                const setDatas=_this.toWhereSql1(tableName,'isupdate',params);
                const _where=_this.toWhereSql1(tableName,'isupdateindex',params);
                
                const sql ="UPDATE "+tableName_project+" SET "+setDatas.fields.join()+" WHERE "+_where.fields.join();
                let res=await db.query(sql,[...setDatas.values,..._where.values]);
                
                return  _this.afterRunFun(params,tableName,res[0],root);
            }
        }
    }
    deleteRowOper(tableName,Type,args){
        const _this=this;
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                params=await _this.beforRunFun(params,tableName,root)
                const sql=_this.toSql('delete',params,tableName)
                let res=await db.query(sql);
                
                return _this.afterRunFun(params,tableName,res[0],root);
            }
        }
    }
    createRowOper(tableName,Type,args){
        const _this=this;
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                params=await  _this.beforRunFun(params,tableName,root)
                const res=await addData(_this.projectName+"_"+tableName,params)
                return _this.afterRunFun(params,tableName,{id:res.insertId},root);
            }
        }
    }
    queryTableOper(tableName,Type,args){
        let _this=this;
        return {
            type:new GraphQLList(Type),
            args:args,
            async resolve(root,params,option){
                params=await  _this.beforRunFun(params,tableName,root)
                const sql=_this.toSql('query',params,tableName)
                const res=db.query(sql)                
                return  _this.afterRunFun(params,tableName,res,root);
            }
        }
    }
    querySingleOper(tableName,Type,args){
        let _this=this;
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                params=await _this.beforRunFun(params,tableName,root)
                return _this.afterRunFun(params,tableName,res[0],root);
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
                //查询tablename
                const projectName_RelationTable=this.projectName+"_"+table[i].fieldrelationtablename
                const _RelationTableName=table[i].fieldrelationtablename;
                
                let _type=this.toObjectType(_RelationTableName,type+_RelationTableName);
                _type=_issingleorlist?new GraphQLList(_type):_type;
                fields[_fieldname]={
                    type:_type,
                    resolve:async function(thisItem){
                        if(_issingleorlist){
                            const middleTale=_this.projectName+"_"+name+"_"+_RelationTableName
                            const queryMiddleSql="select "+(_RelationTableName+"id")+" from "+middleTale+" where "+(name+"id")+"="+thisItem.id
                            let resIds=await db.query(queryMiddleSql);
                            const ids=resIds.map(function(item){return item[_RelationTableName+"id"] })
                            //如果没有查到id 返回空

                            if(!ids.length){
                                return []
                            }
                            const resSql="select * from "+projectName_RelationTable+" where "+_this.orToSql(ids)
                            return  await db.query(resSql);
                        }else{
                            const RelationId=thisItem[_RelationTableName+"id"]
                            const resSql="select * from "+projectName_RelationTable+" where id="+RelationId;
                            const res=await db.query(resSql);
                            return  res[0];
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
            if(!Indexes || obj[i][Indexes] || obj[i][Indexes+'index']){
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
                                type:table=="system"?new GraphQLList(GraphQLString):GraphQLString
                            }
                        break;
                    case "int":
                        args[_fieldname]={
                                name:_fieldname,
                                type:GraphQLInt
                            }
                        break;
                    case "graphqlObj":
                        args[_fieldname]={
                                name:_fieldname,
                                type:GraphQLInt
                            }
                        break;
                    case "upload":
                        args[_fieldname]={
                                name:_fieldname,
                                type:GraphQLUpload
                            }
                        break;
                }
            }
        }
        return args
    }

    toSql(type,params,tableName){
        let sql=""
        const tableName_project=tableName
        tableName=`${this.projectName}_${tableName}`
        if(type=="query"){
            let _where=this.toWhereSql(tableName_project,'isqueryindex',params)
            sql= "select * from "+tableName+(_where?" where "+_where:"");
        }else if(type=='delete'){
            const _where=this.toWhereSql(tableName_project,'isdeleteindex',params);
            sql ="delete  from "+tableName+" where "+_where;
        }
        return sql
    }
    
    //通用 转换 where sql
    //table 表名称
    //Indexes 这里和toarg不一样  不传不会去生成
    //params 可选参数  与key对应 生成where
    //待废弃
    toWhereSql(table,Indexes,params={},joinkey){
        const obj=this.paramsObj[table]
        //默认带上id
        let  _where=[]
        for(var i=0;i<obj.length;i++){
            let _fieldname=obj[i].fieldname
            //穿过来的值  1 不能使对象（graphqlobj）  2 有索引值    3 对应的key有传参
            if(obj[i][Indexes] && (!params || params[_fieldname]!=undefined)){
                let value=params[_fieldname]
                if(obj[i].fieldtype=="varchar"){
                    value="'"+value+"'";
                    _where.push(_fieldname+"="+value)
                }else if(obj[i].fieldtype=="graphqlobj"){
                    _where.push(obj[i].fieldrelationtablename+"="+value)
                }else{
                    _where.push(_fieldname+"="+value)
                }
            }
        }
        return _where.join(joinkey?joinkey:' and ')
    }
    toWhereSql1(table,Indexes,params={}){
        const obj=this.paramsObj[table]
        //默认带上id
        let  values=[]
        let  fields=[]
        for(var i=0;i<obj.length;i++){
            //穿过来的值  1 不能使对象（graphqlobj）  2 有索引值    3 对应的key有传参
            if(obj[i][Indexes]){
                let _fieldname=obj[i].fieldname
                values.push(params[_fieldname])
                fields.push(`${_fieldname}=?`)   
            }
        }
        return {values,fields}
    }
    
    orToSql(arr,key="id"){
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
}


export default Grouphqlquery;