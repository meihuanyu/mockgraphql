import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import {
  GraphQLSchema,
  GraphQLObjectType
} from 'graphql';
// 引入 type 
import {getTables,createField,createTable,getFields,updateFields,deleteFields,querySchme,query_grant} from '../controllers/structure'
import { create_funs , delete_funs , update_funs , query_funs } from '../controllers/funs'
import { create_args , delete_args , update_args , query_args ,import_args} from '../controllers/args'
import {login} from '../controllers/login'
import {permissions} from '../controllers/user'
import redis from '../config/redis'
import db from '../config/database'
import {addData} from '../controllers/sql'
import graphqlQuery from '../graphql/graphqlQuery';
import { apolloUploadKoa } from 'apollo-upload-server'
var jwt = require('jsonwebtoken');
const router = require('koa-router')()
async function isLogin(ctx,next){
  const token=ctx.header.authorization
  try {
    var decoded = jwt.verify(token, '123qwe');
  } catch(err) {
      ctx.status=401
      return false
  }
  ctx.roleid=decoded.roleid
  ctx.user=decoded
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

router.get('/app/query_funs',query_funs);
router.get('/app/delete_funs',delete_funs);
router.get('/app/update_funs',update_funs);
router.get('/app/create_funs',create_funs);

router.get('/app/query_args',query_args);
router.get('/app/delete_args',delete_args);
router.get('/app/update_args',update_args);
router.get('/app/create_args',create_args);
router.get('/app/import_args',import_args);

router.get('/login',login);


router.get('/tt',function(){
  
  redis.del('system'); 
  redis.del('textx'); 

})
// router.use('/graphql',permissions)


router.use('/graphql',isLogin)
// 上传中间件
.use(apolloUploadKoa({ maxFileSize: 10000000, maxFiles: 10 }))

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