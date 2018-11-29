import db from '../config/database'
import {addData, deleteData} from '../controllers/sql'
module.exports =async function(params,tableName,root){
    const menus=JSON.parse(params.ids)
    if(menus[0] && menus[0].rid){
        await db.query(`delete from d_menugrant where rid=${menus[0].rid}`)
        const res=await addData('d_menugrant',menus)
        return res
    }else{
        return {}
    }
}    
