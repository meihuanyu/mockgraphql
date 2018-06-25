import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import {
  GraphQLSchema,
  GraphQLObjectType
} from 'graphql';
// 引入 type 
import graphqlSchema from '../graphql/start'
import {getTables,createField,createTable,querySchme} from '../controllers/structure'

const router = require('koa-router')()

router.get('/app/getTables',getTables);
router.get('/app/createTable',createTable);
router.get('/app/createField',createField);


router.post('/graphql', async (ctx, next) => {
  const schema= await graphqlSchema
  await graphqlKoa({schema: schema})(ctx, next) // 使用schema
})
.get('/graphql', async (ctx, next) => {
  const schema= await graphqlSchema
  console.log(schema)
  await graphqlKoa({schema: schema})(ctx, next) // 使用schema
})
.get('/graphiql', async (ctx, next) => {
  await graphiqlKoa({endpointURL: '/graphql'})(ctx, next) // 重定向到graphiql路由
})
module.exports = router