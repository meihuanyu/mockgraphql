
import md5 from 'md5'
import db from '../config/database'
module.exports =async function(params,tableName,name){
    var jwt = require('jsonwebtoken');
    // var token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 1), foo: 'bar' }, 'shhhhh');
    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDIzMzU1NzIsImZvbyI6ImJhciIsImlhdCI6MTU0MjMzNTUxMn0.6jyIKbjFL00G7cFTQstDUsxpOha_bDBC82M4hEno0dA'
    console.log(token)
    
    try {
        var decoded = jwt.verify(token, 'shhhhh');
        console.log(decoded)
    } catch(err) {
        console.log(err)
    }
    return params
}