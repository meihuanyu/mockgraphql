
import md5 from 'md5'
module.exports =async function(params,tableName,type){
    
    params.uuid=Number(Math.random().toString().substr(3,3) + Date.now()).toString(36)
    return params
}