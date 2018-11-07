import util from './util'
import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList
  } from 'graphql';
  
class Grouphqlquery extends util{
    newApi(table,name,oper){
        let _objectType= this.toObjectType(table,table+name)
        const args=this.toArgs(table,'isqueryindex')
        return  {
          type:oper==='list'?new GraphQLList(_objectType):_objectType,
          args:args,
          async resolve(root,params,option){
              return require(`../functions/${table}/${name}.js`)(params,table,name,root)
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
            if(tFun){
                if(tFun.news){
                  const news=tFun.news
                  for(let i=0;i<news.length;i++){
                    if(news[i].isquery==1){
                      mutation[currKey+"_"+news[i].name]=this.newApi(currKey,news[i].name,news[i].oper)
                    }else if(news[i].isquery==2){
                      query[currKey+"_"+news[i].name]=this.newApi(currKey,news[i].name,news[i].oper)
                    }
                    
                  }
                }
                if(tFun.types){
                  const oTypes=tFun.types.filter(item=>item.type==='original')
                  for(let i=0;i<oTypes.length;i++){
                      if(oTypes[i].oper==='list'){
                        query[currKey+oTypes[i].name] =  this.getQueryList(currKey)

                      }else if(oTypes[i].oper==='single'){
                        query[currKey+oTypes[i].name] =  this.getSingleRow(currKey)

                      }else if(oTypes[i].oper==='create'){
                        mutation[currKey+oTypes[i].name] =  this.createRow(currKey)   

                      }else if(oTypes[i].oper==='delete'){
                        mutation[currKey+oTypes[i].name] =  this.deleteRow(currKey)   

                      }else if(oTypes[i].oper==='update'){
                        mutation[currKey+oTypes[i].name] =  this.updateRow(currKey)   
                      }
                  }
                }
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