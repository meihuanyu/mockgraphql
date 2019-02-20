import db from '../config/database'
import {addData, deleteData} from '../controllers/sql'
import shortid from 'shortid'

module.exports =async function(params,tableName,root){
    let menus=JSON.parse(params.ids)
    if(menus[0] && menus[0].rid){
        console.log(menus)
        
    }else{
        return {}
    }
}    
