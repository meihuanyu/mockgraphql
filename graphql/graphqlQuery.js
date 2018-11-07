import util from './util'
import {
    GraphQLSchema,
    GraphQLObjectType,
  } from 'graphql';
  
class Grouphqlquery extends util{
    newApi(table,name){
        let _objectType= this.toObjectType(table,table+name)
        const args=this.toArgs(table,'isqueryindex')
        return  {
          type:_objectType,
          args:args,
          async resolve(root,params,option){
              return require(`../functions/${table}/${name}.js`)(params,table,name)
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
            if(tFun && tFun.news){
              const news=tFun.news
              for(let i=0;i<news.length;i++){
                if(news[i].isquery==1){
                  mutation[currKey+"_"+news[i].name]=this.newApi(currKey,news[i].name)
                }else if(news[i].isquery==2){
                  query[currKey+"_"+news[i].name]=this.newApi(currKey,news[i].name)
                }
                
              }
            }
            

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