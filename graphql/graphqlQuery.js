import util from './util'
import {
    GraphQLSchema,
    GraphQLObjectType
  } from 'graphql';
  
class Grouphqlquery extends util{
    async queryFun(resData){

    }
    async startSchema (data){
        console.log(data)
        const resData=data.fields;
        this.paramsObj=resData;
        this.funs=data.tFuns;
        this.tables=Object.keys(resData);
        let   query={}
        let   mutation={}
        for(let i=0;i<this.tables.length;i++){
            const currKey=this.tables[i]
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