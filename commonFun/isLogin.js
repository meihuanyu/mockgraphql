
import md5 from 'md5'
import db from '../config/database'

module.exports =async function(params,table,oper,{ctx}){
    const jwt = require('jsonwebtoken');
    const token = ctx.header.authorization
    try {
        var decoded = jwt.verify(token, '123qwe');
    } catch(err) {
        throw new Error('登陆超时');
    }
    ctx.roleid=decoded.roleid
    ctx.user=decoded
    return params
}