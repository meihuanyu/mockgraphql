import db from '../config/database'

module.exports =async function(params,tableName,oper,{ctx}){
    var jwt = require('jsonwebtoken');
    
    const token = ctx.header.authorization
    try {
        var decoded = jwt.verify(token, '123qwe');
    } catch(err) {
        throw new Error('登陆超时');
    }
    params.userid=decoded.id
    return params
    
}    
