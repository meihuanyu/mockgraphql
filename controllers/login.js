import db from '../config/database'

import md5 from 'md5'
export const  login=async function (ctx,next){
    
    const sql="select * from user where accountnumber='"+ctx.query.accountnumber+"' and password="+ctx.query.password
    const res=await db.query(sql)
    if(res.length==0){
        ctx.body={
            success:false,
            msg:"登陆失败"
        }
    }else{
        const token=md5(ctx.query.accountnumber+ctx.query.password)
        const updatesql="update user set token='"+token+"' where id="+res[0].id
        db.query(updatesql)
        ctx.body={
            success:true,
            msg:"成功",
            id:res[0].id,
            username:res[0].username,
            token:token
        }
    }
}