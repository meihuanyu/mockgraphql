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
import {addData , updateData ,getData,deleteData,getOneData} from '../controllers/sql'
import {dbOper} from '../util/dbOper'
import { GraphQLUpload } from 'apollo-upload-server'
class Grouphqlquery{
    constructor (params){
        this.fields={};
        this.tFuns={}
        this.tArgs={}
        this.tComFuns={}
        this.projectName=""
        this.query={}
        this.mutation={}
        // return this.startSchema()
    }
    
    createRow(tableName,api){
        const operType = 'create'
        let _objectType= this.toObjectType(tableName,tableName+operType)
        const args=this.toArgs(tableName,operType)
        const _this=this;
        return {
            type:_objectType,
            args:args,
            async resolve(root,params){
                return dbOper(operType,params,tableName,api,root,_this.projectName,_this)
            }
        }
    }
    deleteRow(tableName,api){
        const operType = 'delete'
        let _objectType = this.toObjectType(tableName,tableName+operType)
        const args      = this.toArgs(tableName,operType)
        const _this     = this;
        return {
            type:_objectType,
            args:args,
            async resolve(root,params){
                return dbOper(operType,params,tableName,api,root,_this.projectName,_this)
            }
        }
    }
    updateRow(tableName,api){
        const operType = 'update'
        const _objectType= this.toObjectType(tableName,tableName+operType)
        const args=this.toArgs(tableName,operType)
        const _this=this
        return {
            type:_objectType,
            args:args,
            async resolve(root,params){
                return dbOper(operType,params,tableName,api,root,_this.projectName,_this)
            }
        }
    }
    getQueryList(tableName,api){
        const operType = 'list'
        let _objectType= this.toObjectType(tableName,tableName+operType)
        const args=this.toArgs(tableName,operType)
        let _this=this;
        return {
            type:new GraphQLList(_objectType),
            args:args,
            async resolve(root,params){
                return dbOper(operType,params,tableName,api,root,_this.projectName,_this)
            }
        };
    }
    getSingleRow(tableName,api){
        const operType = 'single'
        let _objectType= this.toObjectType(tableName,tableName)
        const args=this.toArgs(tableName,operType)
        let _this=this;
        return {
            type:_objectType,
            args:args,
            async resolve(root,params){
                return dbOper(operType,params,tableName,api,root,_this.projectName,_this)
            }
        }
    }

    

    /**
     *中间表关联删除
     *
     * @param {*} _issingleorlist
     * @param {*} viceTable
     * @param {*} tableName
     * @param {*} fieldname
     * @returns
     * @memberof Grouphqlquery
     */
    deleteLinkResolve(_issingleorlist,viceTable,tableName,fieldname){
        const _this=this;
        let create_args={}
        create_args[viceTable+'id']={
            name:viceTable+'id',
            type:GraphQLInt
        }
        create_args[tableName+'id']={
            name:tableName+'id',
            type:GraphQLInt                    
        }
        return {
            type:new GraphQLObjectType({
                name:viceTable+'_'+tableName,
                fields:{
                  id:{
                    type:GraphQLInt
                  }
                }
              })  ,
              args:create_args,
              async resolve(root,params,option){
                const projectName=_this.projectName
                const graphqlObjTableName = projectName+'_'+viceTable
                const transferTableName = projectName+'_'+tableName+'_'+viceTable
                let lastRes = {} 
                if(_issingleorlist){
                    /** 删除关联表数据 */
                    let deleteGrapObj = {}
                    deleteGrapObj[viceTable+'id'] = params[viceTable+'id']
                    deleteGrapObj[tableName+'id'] = params[tableName+'id']
                    deleteData(transferTableName,deleteGrapObj)
                    /** 删除viceTable表数据 */
                    lastRes = await deleteData(graphqlObjTableName,{
                        id:params[viceTable+'id']
                    })
                }else{
                    /** 删除viceTable表数据 */
                    lastRes = await deleteData(graphqlObjTableName,{
                        id:params[viceTable+'id']
                    })
                    
                }
                return lastRes
              }
        }
    }
    createLinkResolve(_issingleorlist,viceTable,tableName,fieldname){
        const _this=this;
        let create_args={}
        create_args[tableName+'id']={
            name:tableName+'id',
            type:GraphQLInt                    
        }
        const _type = new GraphQLInputObjectType({
            name:tableName+'_'+viceTable,
            fields:_this.toArgs(viceTable,'create',tableName)
        })
        create_args[fieldname]={
            name:tableName,
            type:_issingleorlist?new GraphQLList(_type):_type
        }
                
        return {
            type:new GraphQLObjectType({
                name:viceTable+'id',
                fields:{
                  id:{
                    type:GraphQLInt
                  }
                }
              })  ,
              args:create_args,
              async resolve(root,params,option){
                  //判断是graphqlObj是否为List
                  const projectName=_this.projectName
                  let lastRes = {} 
                  if(params[fieldname]){
                       const graphqlObjTableName = projectName+'_'+viceTable
                       /** list */
                      if(_issingleorlist){
                        let transferParams = []
                        const transferTableName = projectName+'_'+tableName+'_'+viceTable
                        
                        /** 创建grapqlObj 数据 */
                        const grapObjRes = await addData(graphqlObjTableName,params[fieldname])
                        /** 返回的insertId 去叠加取id */
                        for(let i=0;i<grapObjRes.affectedRows;i++){
                            let tempT = {}
                            tempT[viceTable+'id'] = grapObjRes.insertId+i
                            tempT[tableName+'id'] = params[tableName+'id']
                            transferParams.push(tempT)
                        }
                        /** insert 中间表关联数据 */
                        lastRes = await addData(transferTableName,transferParams)
                      }else{
                        /** single */
                        const resGrapObj = await addData(graphqlObjTableName,params[fieldname])
                        lastRes = await db.query(`update ${projectName+"_"+tableName} set ${viceTable+"_id"}=${resGrapObj.insertId} where id=${params[tableName+'id']}`)
                      }
                        
                    }
                    return lastRes
                  
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
                const _RelationTableName=table[i].fieldrelationtablename
                //根据关联表名 去找对应的type
                let _type=this.toObjectType(_RelationTableName,type+_RelationTableName);
                //根据多表判断 是list还是 deatil
                _type=_issingleorlist?new GraphQLList(_type):_type;

                

                /**
                 * 在此生成关联表的craete 和 delete
                 */
                
                this.mutation[`add_${_RelationTableName}_link_${name}`]=this.createLinkResolve(_issingleorlist,_RelationTableName,name,_fieldname)
                this.mutation[`del_${_RelationTableName}_link_${name}`]=this.deleteLinkResolve(_issingleorlist,_RelationTableName,name,_fieldname)

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
        let _fields=this.toGrahqlField(this.fields[table],type,table);
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
        const obj=this.tArgs[table]
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

                        const targetField = _this.fields[table].filter(item=>item.fieldname===obj[i].name)

                        const issingleorlist = targetField[0].issingleorlist
                        const type = new GraphQLInputObjectType({
                            name:typeName,
                            fields:_this.toArgs(obj[i].relationtablename,Indexes,typeName)
                        })
                        
                        args[_name]={
                                name:obj[i].relationtablename,
                                type:issingleorlist?new GraphQLList(type):type
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
        for(let i=0;i<this.fields[table].length;i++){
            
            fields[this.fields[table][i].fieldname]=this.fields[table][i]
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
        const obj=this.fields[table]
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
        const obj=this.fields[table]
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