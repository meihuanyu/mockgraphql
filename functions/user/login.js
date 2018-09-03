
import md5 from 'md5'
import db from '../../config/database'
module.exports =async function(params,tableName,name){
    const sql="select * from textx_user where username='"+params.username+"' and password="+params.password
    const res=await db.query(sql)
    if(res.length==0){
        return {
            success:false,
            msg:"登陆失败"
        }
    }else{
        const token=md5(params.username+params.password)
        const updatesql="update textx_user set token='"+token+"' where id="+res[0].id
        db.query(updatesql)
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