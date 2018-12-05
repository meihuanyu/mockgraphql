import db from '../config/database'
import {addData, deleteData} from '../controllers/sql'
import shortid from 'shortid'

module.exports =async function(params,tableName,root){
    let menus=JSON.parse(params.ids)
    if(menus[0] && menus[0].rid){
        await db.query(`delete from d_menugrant where rid=${menus[0].rid}`)
        let newKey = {}
        for(let i=0;i<menus.length;i++){
            const id = shortid.generate()
            newKey[menus[i].id]=id
            menus[i].id = id
        }
        menus = menus.map(item=>{
            item.pid = newKey[item.pid]?newKey[item.pid]:"top"
            return item
        })
        const res=await addData('d_menugrant',menus)
        return res
    }else{
        return {}
    }
}    
