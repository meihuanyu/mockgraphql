import Koa from 'koa';
import KoaStatic from 'koa-static'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
const GraphqlRouter = require('../router')

const app = new Koa()
const router = new Router();

const port = 4001


app.use(bodyParser());
app.use(KoaStatic(__dirname + '/public'));


router.use('', GraphqlRouter.routes())

app.use(router.routes())
   .use(router.allowedMethods());

app.listen(port);

console.log('GraphQL-demo server listen port: ' + port)
