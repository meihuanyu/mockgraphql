
import md5 from 'md5'
import db from '../../config/database'
var jwt = require('jsonwebtoken');
module.exports =async function(params,tableName,name){
    const sql="select * from textx_user where username='"+params.username+"' and password="+params.password
    const res=await db.query(sql)
    if(res.length==0){
        return {
            success:false,
            msg:"登陆失败"
        }
    }else{
        var token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 5), 
            id:res[0].id,
            username:res[0].username,
            roleid:res[0].roleid
        }, '123qwe');
        return {
            success:true,
            msg:"成功",
            id:res[0].id,
            username:res[0].username,
            token:token,
            uuid:res[0].uuid
        }
    }
}