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
    newApi(table,name,oper){
        let _objectType= this.toObjectType(table,table+oper)
        const args=this.toArgs(table,oper)
        return  {
          type:oper==='list'?new GraphQLList(_objectType):_objectType,
          args:args,
          async resolve(root,params,option){
              return require(`../functions/${table}/${name}.js`)(params,table,oper,root)
          }
        }
    }
    async startSchema (data){
        const resData=data.fields;
        this.paramsObj=resData;
        this.funs=data.tFuns;
        this.projectName=data.projectName
        this.args=data.tArgs
        this.tables=Object.keys(resData);
        for(let i=0;i<this.tables.length;i++){
            const currKey=this.tables[i]

            //创建新的api
            const tFun=this.funs[currKey]
            
            for(let i=0;i<tFun.length;i++){
              const {oper,alias,type} = tFun[i]
              
              const api_name=alias?alias:currKey+'_'+oper
              if(type == 'original'){
                if(oper==='list'){
                  this.query[api_name] =  this.getQueryList(currKey)
  
                }else if(oper==='single'){
                  this.query[api_name] =  this.getSingleRow(currKey)
  
                }else if(oper==='create'){
                  this.mutation[api_name] =  this.createRow(currKey)   
  
                }else if(oper==='delete'){
                  this.mutation[api_name] =  this.deleteRow(currKey)   
  
                }else if(oper==='update'){
                  this.mutation[api_name] =  this.updateRow(currKey)   
                }
              }else if(type == 'new'){
                if(oper === 'list' || oper === 'single'){
                  this.query[api_name]=this.newApi(currKey,api_name,oper)
                }else{
                  this.mutation[api_name]=this.newApi(currKey,api_name,oper)
                }
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