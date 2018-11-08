import util from './util'
import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList
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
            if(tFun){
                if(tFun.news){
                  const news=tFun.news
                  for(let i=0;i<news.length;i++){
                    const { isnew,oper,alias,type } = news[i]
                    const api_name=alias?alias:currKey+"_"+news[i].oper
                    if(isnew==1){
                      mutation[api_name]=this.newApi(currKey,api_name,oper)
                    }else if(isnew==2){
                      query[api_name]=this.newApi(currKey,api_name,oper)
                    }
                    
                  }
                }
                if(tFun.types){
                  const oTypes=tFun.types.filter(item=>item.type==='original')
                  for(let i=0;i<oTypes.length;i++){
                      const api_name=oTypes[i].alias?oTypes[i].alias:currKey+'_'+oTypes[i].oper
                      if(oTypes[i].oper==='list'){
                        query[api_name] =  this.getQueryList(currKey)

                      }else if(oTypes[i].oper==='single'){
                        query[api_name] =  this.getSingleRow(currKey)

                      }else if(oTypes[i].oper==='create'){
                        mutation[api_name] =  this.createRow(currKey)   

                      }else if(oTypes[i].oper==='delete'){
                        mutation[api_name] =  this.deleteRow(currKey)   

                      }else if(oTypes[i].oper==='update'){
                        mutation[api_name] =  this.updateRow(currKey)   
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