
import md5 from 'md5'
import db from '../../config/database'
module.exports =async function(params,tableName,name,root){
    const roleid=root.ctx.roleid
    const menu=await db.query("select * from d_menugrant where rid=?",[roleid])
    const ids=menu.map(item=>item.mid)
    const parentid=params.parentid
    let _where=[" id=0 "];
    let values=[];
    for(let i=0;i<ids.length;i++){
        _where.push(` id=? `)
        values.push(ids[i])
    }
    
    let sql=`select * from system_systemmenu where parentid=${parentid} and (${_where.join('or')})`;
    if(roleid==1){
        sql=`select * from system_systemmenu where parentid=${parentid}`
    }
    const res=await db.query(sql,values)
    return res
}