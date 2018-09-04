import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import {
  GraphQLSchema,
  GraphQLObjectType
} from 'graphql';
// 引入 type 
import {getTables,createField,createTable,getFields,updateFields,deleteFields,querySchme,query_grant} from '../controllers/structure'
import {login} from '../controllers/login'
import {permissions} from '../controllers/user'
import redis from '../config/redis'
import db from '../config/database'
import {addData} from '../controllers/sql'
import graphqlQuery from '../graphql/graphqlQuery';
const router = require('koa-router')()
async function isLogin(ctx,next){
  const usertoken=ctx.header.authorization
  const user =await db.query('select * from system_user where token="'+usertoken+'"')
  if(!user[0] || !user[0].roleid){
      ctx.status=401
  }
  ctx.roleid=user[0]?user[0].roleid:""
  ctx.user=user
  await next()
}

router.use('/app',isLogin)
router.get('/app/getTables',getTables);
router.get('/app/createTable',createTable);
router.get('/app/createField',createField);
router.get('/app/getFields',getFields);
router.get('/app/updateFields',updateFields);
router.get('/app/deleteFields',deleteFields);
router.get('/app/query_grant',query_grant);

router.get('/login',login);


router.get('/tt',function(){
  
  addData('textx_info',{aihao:"tex1",pid:3})
  // db.query("insert into textx_info (aihao,pid) values(?,?),(?,?)",["哈哈哈",1,"pupu",2])

})
router.get('/aa',async (ctx)=>{
  const usertoken=ctx.header.authorization
  const user =await db.query('select id from system_user where token="'+usertoken+'"')
  if(!user[0].id){
      ctx.status=401
  }
  const project=await db.query('select * from system_project where userid='+user[0].id)
  const apis=project.map(item=>item.apikey)
  redis.del(apis); 
  ctx.body={
    success:true
  }
});

// router.use('/graphql',permissions)
router.use('/graphql',isLogin)


router.post('/graphql/:apikey', async (ctx, next,xx) => {
  let schemaData="" 
  schemaData=await redis.get(ctx.captures[0])
  if(!schemaData){
    schemaData=await querySchme(ctx.captures[0])
    schemaData=JSON.stringify(schemaData)
    redis.set(ctx.captures[0],schemaData)
  }
  let gQuery=new graphqlQuery()
  const _schema=await gQuery.startSchema(JSON.parse(schemaData))
  await graphqlKoa({schema: _schema,rootValue:{ctx:ctx}})(ctx, next) // 使用schema
})
.get('/graphql', async (ctx, next) => {
  // const schema= await graphqlSchema
  // await graphqlKoa({schema: schema})(ctx, next) // 使用schema
})
.get('/graphiql/:apikey', async (ctx, next) => {
  await graphiqlKoa({
    endpointURL: '/api/graphql/'+ctx.captures[0],
    passHeader: `'authorization': '${ctx.query.t}'`
  })(ctx, next) // 重定向到graphiql路由
})
module.exports = router