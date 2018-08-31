import util from './util'
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
  
class Grouphqlquery extends util{
    async queryFun(resData){

    }
    newApi(table,name){
        let _objectType= this.toObjectType(table,table+name)
        const args=this.toArgs(table,'isqueryindex')
        return  {
          type:_objectType,
          args:args,
          async resolve(root,params,option){
              return require(`../functions/${name}.js`)(params,table,name)
          }
        }
    }
    async startSchema (data){
      console.log(data)
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
            // if(tFun && tFun.news){
            //   const news=tFun.news
            //   for(let i=0;i<news.length;i++){
            //     query[currKey+news[i]]=this.newApi(currKey,news[i])
            //   }
            // }
            

            query[currKey+"List"] =  this.getQueryList(currKey)
            query[currKey] =  this.getSingleRow(currKey)
            
            mutation[currKey+'Create'] =  this.createRow(currKey)   
            mutation[currKey+'Delete'] =  this.deleteRow(currKey)   
            mutation[currKey+'Update'] =  this.updateRow(currKey)   
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