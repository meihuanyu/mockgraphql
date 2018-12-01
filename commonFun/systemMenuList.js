import db from '../config/database'
module.exports =async function(params,tableName,name,root){
    const roleid=root.ctx.roleid
    const pid=params.pid
    let sql;
    const res = await db.query(`select menu.displayname,menu.name,menu.component,menu.oper,d.pid,d.id 
    from d_menugrant d,system_systemmenu menu  where d.mid=menu.id and d.pid=? and d.rid=?`,[pid,roleid])
    
    
    return res
}