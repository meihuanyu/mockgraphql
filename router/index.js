
import redis from '../config/redis'  
import {functionOper} from '../v2/index'
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

router.get('/tt',function(ctx){
  redis.del(ctx.query.apiKey); 
  ctx.body={
    success:true
  }

})
router.get('/v2/:apiKey/:function',functionOper)
// router.use('/app',isLogin)
router.use('',require('../controllers/template_analysis').routes())
router.use('',require('../controllers/menu').routes())
router.use('',require('../controllers/table').routes())
router.use('',require('../controllers/field').routes())
router.use('',require('../controllers/structure').routes())
router.use('',require('../controllers/function').routes())
router.use('',require('../controllers/arg').routes())


module.exports = router