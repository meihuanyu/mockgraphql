import { updateData ,addData,getData , getOneData} from '../util/sql'
import db from '../config/database'

const router = require('koa-router')()

const getTables = async (ctx) => {
    const res = await getData('system_table' )
    ctx.body = {
        data:res,
        msg:"ok"
    }
}
const createTable=async function(ctx,next){
    const { name , descinfo , projectId} = ctx.query;
    const resProjects = await getOneData('system_project' , {id:projectId})
    const apiKey = resProjects.apiKey
    const insertRes = await addData('system_table',{
        name,
        descinfo,
        projectId
    })
    const res =await _createTable(apiKey+"_"+name,insertRes.insertId)
    if(res){
        ctx.body={
            success:true
        }
    }
}
const _createTable=async function(tablename,tableid){
    const  sql="CREATE TABLE IF NOT EXISTS `"+tablename+"`("+
        "`id` INT UNSIGNED AUTO_INCREMENT,`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,PRIMARY KEY ( `id` )"+
        ")ENGINE=InnoDB DEFAULT CHARSET=utf8;"
    db.query(sql);  
    //默认id状态
    const res = await addData('system_field',{
        name:"id",
        type:"int",
        tableId:tableid,
        isRes:0
    })
    return res
}
router.get('/app/getTables',getTables);
router.get('/app/createTable',createTable);

module.exports = router