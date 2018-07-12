import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import {
  GraphQLSchema,
  GraphQLObjectType
} from 'graphql';
// 引入 type 
import graphqlSchema from '../graphql/start'
import {getTables,createField,createTable,getFields,updateFields,deleteFields,querySchme} from '../controllers/structure'
import {login} from '../controllers/login'
import {permissions} from '../controllers/user'

const router = require('koa-router')()

router.get('/app/getTables',getTables);
router.get('/app/createTable',createTable);
router.get('/app/createField',createField);
router.get('/app/getFields',getFields);
router.get('/app/updateFields',updateFields);
router.get('/app/deleteFields',deleteFields);
router.get('/login',login);


router.use('/graphql',permissions)

router.post('/graphql', async (ctx, next) => {
  const schema= await graphqlSchema
  await graphqlKoa({schema: schema})(ctx, next) // 使用schema
})
.get('/graphql', async (ctx, next) => {
  const schema= await graphqlSchema
  await graphqlKoa({schema: schema})(ctx, next) // 使用schema
})
.get('/graphiql', async (ctx, next) => {
  await graphiqlKoa({endpointURL: '/graphql'})(ctx, next) // 重定向到graphiql路由
})
module.exports = router