
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

router.get('/test',(ctx)=>{

  ctx.body = {
    xx:'test'
  }
})

router.get('/tt',function(ctx){
  redis.del(ctx.query.apiKey); 
  ctx.body={
    success:true
  }

})
router.get('/v2/:api/:function',functionOper)
// router.use('/app',isLogin)
router.use('',require('../controllers/args').routes())
router.use('',require('../controllers/funs').routes())
router.use('',require('../controllers/comArgs').routes())
router.use('',require('../controllers/structure').routes())
router.use('',require('../controllers/menu_grant').routes())
router.use('',require('../controllers/template_analysis').routes())


module.exports = router