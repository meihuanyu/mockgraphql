
import md5 from 'md5'
import db from '../../config/database'
module.exports =async function(params,tableName,root){
    console.log(params)
    const xx= await params.file;
    console.log(xx)
    return {}
    
}