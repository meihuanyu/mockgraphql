import db from '../config/database'
module.exports =async function(params,tableName,name,root){
    const roleid=root.ctx.roleid
    let res = []
    const pid=params.pid
    let sql;
    if(roleid==1){
        if(pid==0){
            sql=`select * from system_systemmenu where id=1`
        }else{
            sql=`select * from system_systemmenu where pid=${pid}`
        }
        res = await db.query(sql)   
    }else{
        res = await db.query("select menu.*,d.pid from d_menugrant d,system_systemmenu menu  where d.mid=menu.id and d.pid=? and d.rid=?",[pid,roleid])
    }
    
    return res
}