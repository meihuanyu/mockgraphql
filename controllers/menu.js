import { updateData ,addData,getData} from '../util/sql'
const router = require('koa-router')()

const getMenu = async (ctx) => {
    const res = await getData('system_menu' , {
        pid:ctx.query.pid
    })
    ctx.body = {
        data:res,
        msg:"ok"
    }
}

router.get('/app/getMenu',getMenu);

module.exports = router