import util from './util'

import {
  GraphQLInputObjectType,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
  } from 'graphql';
  
class Grouphqlquery extends util{
    newApi(table,name,oper,api){
        let _objectType= this.toObjectType(table,api)
        const args=this.toArgs(table,oper)
        const _this = this
        return  {
          type:oper==='list'?new GraphQLList(_objectType):_objectType,
          args:args,
          async resolve(root,params,option){
              if(name){
                params=await _this.beforRunFun(params,table,root,api)
                return require(`../commonFun/${name}.js`)(params,table,oper,root)
              }else{
                return ()=>{}
              }
              
          }
        }
    }
    async startSchema (data){
        console.log(data)
        this.paramsObj=data.fields;
        this.funs=data.tFuns;
        this.projectName=data.projectName
        this.args=data.tArgs
        const funNames = Object.keys(this.funs)
        for(let i=0;i<funNames.length;i++){
            const {oper,isNew,tablename,funName} = this.funs[funNames[i]]
            const api_name=funNames[i]
            if(isNew == 'original'){
              if(oper==='list'){
                this.query[api_name] =  this.getQueryList(tablename,api_name)

              }else if(oper==='single'){
                this.query[api_name] =  this.getSingleRow(tablename,api_name)

              }else if(oper==='create'){
                this.mutation[api_name] =  this.createRow(tablename,api_name)  

              }else if(oper==='delete'){
                this.mutation[api_name] =  this.deleteRow(tablename,api_name)  

              }else if(oper==='update'){
                this.mutation[api_name] =  this.updateRow(tablename,api_name)  
              }
            }else if(isNew == 'new'){
              if(oper === 'list' || oper === 'single'){
                this.query[api_name]=this.newApi(tablename,funName,oper,api_name)
              }else{
                this.mutation[api_name]=this.newApi(tablename,funName,oper,api_name)
              }
            }
        }
        this.mutation.testgg={
          type:new GraphQLObjectType({
            name:'testctype',
            fields:{
              aa:{
                type:GraphQLString
              },bb:{
                type:GraphQLString
              }
            }
          })  ,
          args:{
            ap:{
              name:'ap',
              type:new GraphQLList(new GraphQLInputObjectType({
                name:"apxxx",
                fields:{
                  description: { type: GraphQLString }
                }
              }))
            }
          },
          async resolve(root,params,option){
              console.log(params)
              return  {}
          }
      }


        return new GraphQLSchema({
            query: new GraphQLObjectType({
              name: 'Queries',
              fields:  this.query
            }),
            mutation:new GraphQLObjectType({
              name:"Mutaions",
              fields:this.mutation
            })
          })
    }
}

export default Grouphqlquery;