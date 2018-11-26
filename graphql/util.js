import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLInputObjectType
  } from 'graphql';
  
import db from '../config/database'
import {addData , updateData} from '../controllers/sql'
import { GraphQLUpload } from 'apollo-upload-server'
class Grouphqlquery{
    constructor (params){
        this.paramsObj={};
        this.funs={}
        this.args={}
        this.tComFuns={}
        this.projectName=""
        this.query={}
        this.mutation={}
        // return this.startSchema()
    }
    clearRequire(_path){
        var path = require('path');
        var pwd = path.resolve();
        pwd += _path;
        delete require.cache[pwd]; 
    }
    //params.type:single list delete create update
    async beforRunFun(params,tableName,type,api){
        const obj= this.funs
        // const comObj = this.tComFuns
        // if(comObj[api] && comObj[api].type=='befor'){
        //     //刷新 require的缓存
        //     this.clearRequire("\\commonFun\\" +comObj[api].funName+ ".js")
        //     params =  await require(`../commonFun/${comObj[api].funName}.js`)(params,tableName,type)
        // }
        const real_funs =  obj[api].beforFunction
        if(real_funs){
            for(let i=0;i<real_funs.length;i++){
                const funName = real_funs[i].funName
                // this.clearRequire("\\commonFun\\" +funName+ ".js")
                params =  await require(`../commonFun/${funName}.js`)(params,tableName,type)
            }
        }
        return params
    }
    async afterRunFun(params,tableName,res,type,api){
        const obj= this.funs
        // const comObj = this.tComFuns
        // if(comObj[api] && comObj[api].type=='after'){
        //     res =  await require(`../commonFun/${api}.js`)(params,tableName,type,res)
        // }
        if(obj[api] && obj[api].type==="after" ){
            res=await require(`../functions/${tableName}/${api}.js`)(params,tableName,type,res)

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
    createRow(table,api){
        let _objectType= this.toObjectType(table,table+'create')
        const args=this.toArgs(table,'create')
        let _query= this.createRowOper(table,_objectType,args,api)
        return _query;
    }
    deleteRow(table,api){
        let _objectType= this.toObjectType(table,table+'delete')
        const args=this.toArgs(table,'delete')
        let _query= this.deleteRowOper(table,_objectType,args,api)
        return _query;
    }
    updateRow(table,api){
        const _objectType= this.toObjectType(table,table+'update')
        const args=this.toArgs(table,'update')
        const _query= this.updateRowOper(table,_objectType,args,api)
        return _query;
    }
    getQueryList(table,api){
        let _objectType= this.toObjectType(table,table+'list')
        const args=this.toArgs(table,'list')
        let _query= this.queryTableOper(table,_objectType,args,api)
        return _query;
    }
    getSingleRow(table,api){
        let _objectType= this.toObjectType(table,table)
        const args=this.toArgs(table,'single')
        let _query= this.querySingleOper(table,_objectType,args,api)
        return _query
    }

    
    
    updateRowOper(tableName,Type,args,api){
        const _this=this
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                params=await _this.beforRunFun(params,tableName,root,api)
                const tableName_project=_this.projectName+"_"+tableName
                const ids = _this.args[tableName].filter(item=>item.isindex)
                const whereIndexSql = ids.map(item=>` ${item.name}=${params[item.name]} `)
                let res=await updateData(tableName_project,params,whereIndexSql.join('and'))                
                return  _this.afterRunFun(params,tableName,res[0],root);
            }
        }
    }
    deleteRowOper(tableName,Type,args,api){
        const _this=this;
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                params=await _this.beforRunFun(params,tableName,root,api)
                const sql=_this.toSql('delete',params,tableName)
                let res=await db.query(sql);
                
                return _this.afterRunFun(params,tableName,res[0],root,api);
            }
        }
    }
    createRowOper(tableName,Type,args,api){
        const _this=this;
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                params=await  _this.beforRunFun(params,tableName,root,api)
                
                let resTable = {}
                const argNames=_this.args[tableName].map(item=>item.name)
                const gObjs= _this.paramsObj[tableName].filter(item=>{return item.fieldtype==='graphqlObj' && argNames.indexOf(item.fieldname)!==-1})
                
                //判断表前缀
                const realTableName=_this.projectName

                for(let i=0; i<gObjs.length;i++){
                    const cuurtName=gObjs[i].fieldrelationtablename
                    //过滤出 create的方法
                    const fun  = _this.funs[cuurtName].filter(item=>item.oper==='create')
                    
                    //目前不能指定 默认oper是唯一的 
                    if(fun.length){
                        //list有关联中间表
                        if(gObjs[i].issingleorlist){
                            resTable=await addData(realTableName+"_"+tableName,params)

                            const {alias , type , oper} = fun[0]
                            const funName=alias?alias:cuurtName+'_'+oper

                            const resCur=await _this.mutation[funName].resolve(root,params[gObjs[i].fieldname])

                            const transferTableName=realTableName+'_'+tableName+'_'+cuurtName
                            db.query(`insert into ${transferTableName} (${tableName+'id'},${cuurtName+'id'})  values (?,?)`,[resTable.insertId,resCur.id])
                        }else{
                            const {alias , type , oper} = fun[0]
                            const funName=alias?alias:cuurtName+'_'+oper
                            const resCur=await _this.mutation[funName].resolve(root,params[gObjs[i].fieldname])
                            params[cuurtName+'id'] = resCur.id
                            resTable=await addData(realTableName+"_"+tableName,params)
                        }
                        
                    }
                }
                if(!gObjs.length){
                    resTable=await addData(realTableName+"_"+tableName,params)
                }

                return _this.afterRunFun(params,tableName,{id:resTable.insertId},root,api);
            }
        }
    }
    queryTableOper(tableName,Type,args,api){
        let _this=this;
        return {
            type:new GraphQLList(Type),
            args:args,
            async resolve(root,params,option){
                params=await  _this.beforRunFun(params,tableName,root,api)
                const sql=_this.toSql('query',params,tableName)
                const res=db.query(sql)                
                return  _this.afterRunFun(params,tableName,res,root,api);
            }
        }
    }
    querySingleOper(tableName,Type,args,api){
        let _this=this;
        return {
            type:Type,
            args:args,
            async resolve(root,params,option){
                params=await _this.beforRunFun(params,tableName,root,api)
                return _this.afterRunFun(params,tableName,res[0],root,api);
            }
        }
    }
    /**
     * 中间表关联删除
     *
     * @param {*} _issingleorlist
     * @param {*} _RelationTableName
     * @param {*} name
     * @returns
     * @memberof Grouphqlquery
     */
    deleteLinkResolve(_issingleorlist,_RelationTableName,name){
        const _this=this;
        let create_args={}
        create_args[_RelationTableName+'id']={
            name:_RelationTableName+'id',
            type:GraphQLInt
        }
        return {
            type:new GraphQLObjectType({
                name:_RelationTableName+'_'+name,
                fields:{
                  id:{
                    type:GraphQLInt
                  }
                }
              })  ,
              args:create_args,
              async resolve(root,params,option){
                  //返回
                  let resObj={}
                  //过滤出 create的方法
                  const fun  = _this.funs[_RelationTableName].filter(item=>item.oper==='delete')

                  if(fun[0]){
                        const {alias , type , oper} = fun[0]
                        const funName=alias?alias:_RelationTableName+'_'+oper  
                        resObj=await _this.mutation[funName].resolve(root,params[_RelationTableName],option)
                  }else{
                      console.log('没有对应的方法'+_RelationTableName+"_delete")
                      return {}
                  }
                  if(_issingleorlist){
                        const middleTale=_this.projectName+"_"+name+"_"+_RelationTableName
                        const delSql=`delete from ${middleTale} where ${_RelationTableName+'id'}=?`
                        db.query(delSql)
                    }else{
                      
                  }
                  return resObj
              }
        }
    }
    createLinkResolve(_issingleorlist,_RelationTableName,name){
        const _this=this;
        let create_args={}
        create_args[name+'id']={
            name:name+'id',
            type:GraphQLInt                    
        }
        create_args[_RelationTableName]={
            name:name,
            type:new GraphQLInputObjectType({
                name:name+'_'+_RelationTableName,
                fields:_this.toArgs(_RelationTableName,'create',name)
            })
        }
                
        return {
            type:new GraphQLObjectType({
                name:_RelationTableName+'id',
                fields:{
                  id:{
                    type:GraphQLInt
                  }
                }
              })  ,
              args:create_args,
              async resolve(root,params,option){
                  //返回
                  let resObj={}
                  //过滤出 create的方法
                  const fun  = _this.funs[_RelationTableName].filter(item=>item.oper==='create')

                  if(fun[0]){
                        const {alias , type , oper} = fun[0]
                        const funName=alias?alias:_RelationTableName+'_'+oper  
                        resObj=await _this.mutation[funName].resolve(root,params[_RelationTableName],option)
                  }else{
                      console.log('没有对应的方法'+_RelationTableName+"_create")
                      return {}
                  }
                  if(_issingleorlist){
                        const middleTale=_this.projectName+"_"+name+"_"+_RelationTableName
                        const createMiddleSql= `insert into ${middleTale} (${name+'id'},${_RelationTableName+'id'}) values (${params[name+'id']},${resObj.id})`
                        console.log(createMiddleSql)
                        return await db.query(createMiddleSql);
                  }else{
                    const realTable=_this.projectName+"_"+name
                    const updateSql= `update ${realTable} set ${_RelationTableName+'id'}=${resObj.id} where id=${params[name+'id']}`
                    console.log(updateSql)
                    return await db.query(updateSql);
                  }
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
                //是否是多表
                const _issingleorlist=table[i].issingleorlist
                //项目名_关联表名
                const projectName_RelationTable=this.projectName+"_"+table[i].fieldrelationtablename
                //关联表名
                const _RelationTableName=table[i].fieldrelationtablename.split(this.projectName+"_")[1];
                //根据关联表名 去找对应的type
                let _type=this.toObjectType(_RelationTableName,type+_RelationTableName);
                //根据多表判断 是list还是 deatil
                _type=_issingleorlist?new GraphQLList(_type):_type;


                /**
                 * 在此生成关联表的craete 和 delete
                 */
                
                this.mutation[`add_${_RelationTableName}_link_${name}`]=this.createLinkResolve(_issingleorlist,_RelationTableName,name)
                this.mutation[`del_${_RelationTableName}_link_${name}`]=this.deleteLinkResolve(_issingleorlist,_RelationTableName,name)

                 /**
                 * 在此生成关联表的craete 和 delete   end
                 */

                fields[_fieldname]={
                    type:_type,
                    resolve:async function(thisItem){
                        //中转表查询
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
    /**
     *通用 生成arg
     *
     * @param {String} table    表名称
     * @param {String} Indexes  参数类型过滤
     * @param {String} tempName 如果是graphql 递归下去的名称
     * @returns {}
     * @memberof Grouphqlquery
     */
    toArgs(table,Indexes,tempName){
        const obj=this.args[table]
        if(!obj) return {}
        
        //默认带上id
        let  args={}
        let _this=this
        for(var i=0;i<obj.length;i++){
            let _name=obj[i].name
            if(obj[i]['is'+Indexes]){
                switch(obj[i].type){
                    case "id":
                        args[_name]={
                                name:_name,
                                type:new GraphQLNonNull(GraphQLID)
                            }
                        break;
                    case "varchar":
                        args[_name]={
                                name:_name,
                                type:table=="system"?new GraphQLList(GraphQLString):GraphQLString
                            }
                        break;
                    case "int":
                        args[_name]={
                                name:_name,
                                type:GraphQLInt
                            }
                        break;
                    case "graphqlObj":
                        const typeName=tempName?tempName+'_'+_name:_name
                        args[_name]={
                                name:obj[i].relationtablename,
                                type:new GraphQLInputObjectType({
                                    name:typeName,
                                    fields:_this.toArgs(obj[i].relationtablename,Indexes,typeName)
                                })
                            }
                        break;
                    case "upload":
                        args[_name]={
                                name:_name,
                                type:GraphQLUpload
                            }
                        break;
                }
            }
        }
        return args
    }
    getRelationTable(table,name){
        let fields={}
        for(let i=0;i<this.paramsObj[table].length;i++){
            
            fields[this.paramsObj[table][i].fieldname]=this.paramsObj[table][i]
        }
        return fields[name]
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