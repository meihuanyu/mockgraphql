import db from '../config/database'
var jwt = require('jsonwebtoken');
export const  login=async function (ctx,next){
    
    const sql="select * from system_user where accountnumber='"+ctx.query.accountnumber+"' and password="+ctx.query.password
    const res=await db.query(sql)
    if(res.length==0){
        ctx.body={
            success:false,
            msg:"登陆失败"
        }
    }else{
        var token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 180), 
            id:res[0].id,
            username:res[0].username,
            roleid:res[0].roleid
        }, '123qwe');
        ctx.body={
            success:true,
            msg:"成功",
            id:res[0].id,
            username:res[0].username,
            token:token
        }
    }
}