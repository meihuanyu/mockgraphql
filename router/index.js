import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import {
  GraphQLSchema,
  GraphQLObjectType
} from 'graphql';
// 引入 type 
import {getTables,createField,createTable,getFields,updateFields,deleteFields,querySchme} from '../controllers/structure'
import {login} from '../controllers/login'
import {permissions} from '../controllers/user'
import redis from '../config/redis'
import db from '../config/database'
import graphqlQuery from '../graphql/graphqlQuery';
const router = require('koa-router')()
async function isLogin(ctx,next){
  const usertoken=ctx.header.authorization
  const user =await db.query('select roleid from system_user where token="'+usertoken+'"')
  if(!user[0] || !user[0].roleid){
      ctx.status=401
  }
  await next()
}

router.use('/app',isLogin)
router.get('/app/getTables',getTables);
router.get('/app/createTable',createTable);
router.get('/app/createField',createField);
router.get('/app/getFields',getFields);
router.get('/app/updateFields',updateFields);
router.get('/app/deleteFields',deleteFields);
router.get('/login',login);


router.get('/aa',async (ctx)=>{
  redis.del('textx'); 
  redis.del('system');  
  ctx.body={
    success:true
  }
});

// router.use('/graphql',permissions)
router.use('/graphql',isLogin)


router.post('/graphql/:apikey', async (ctx, next) => {
  let schemaData="" 
  schemaData=await redis.get(ctx.captures[0])
  if(!schemaData){
    schemaData=await querySchme(ctx.captures[0])
    schemaData=JSON.stringify(schemaData)
    redis.set(ctx.captures[0],schemaData)
  }
  let gQuery=new graphqlQuery()
  const _schema=await gQuery.startSchema(JSON.parse(schemaData))
  await graphqlKoa({schema: _schema})(ctx, next) // 使用schema
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