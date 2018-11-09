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
        const args=this.toArgs(table,'isqueryindex')
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
        this.tables=Object.keys(resData);
        let   query={}
        let   mutation={}
        for(let i=0;i<this.tables.length;i++){
            const currKey=this.tables[i]

            //创建新的api
            const tFun=this.funs[currKey]
            
            for(let i=0;i<tFun.length;i++){
              const {oper,alias,type} = tFun[i]
              const api_name=alias?alias:currKey+'_'+oper
              if(type == 'original'){
                if(oper==='list'){
                  query[api_name] =  this.getQueryList(currKey)
  
                }else if(oper==='single'){
                  query[api_name] =  this.getSingleRow(currKey)
  
                }else if(oper==='create'){
                  mutation[api_name] =  this.createRow(currKey)   
  
                }else if(oper==='delete'){
                  mutation[api_name] =  this.deleteRow(currKey)   
  
                }else if(oper==='update'){
                  mutation[api_name] =  this.updateRow(currKey)   
                }
              }else if(type == 'new'){
                if(oper === 'list' || oper === 'single'){
                  query[api_name]=this.newApi(currKey,api_name,oper)
                }else{
                  mutation[api_name]=this.newApi(currKey,api_name,oper)
                }
              }
              
            }
            
        }

        query.testgg={
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
                type:new GraphQLInputObjectType({
                  name:"apxxx",
                  fields:()=>({
                    description: { type: GraphQLString }
                  })
                })
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
              fields:  query
            }),
            mutation:new GraphQLObjectType({
              name:"Mutaions",
              fields:mutation
            })
          })
    }
}

export default Grouphqlquery;