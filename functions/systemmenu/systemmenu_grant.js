
import md5 from 'md5'
import db from '../../config/database'
import {addData} from '../../controllers/sql'
module.exports =async function(params,tableName,root){
    const data=[]
    const ids=JSON.parse(params.ids)
    for(let i=0;i<ids.length;i++){
        data.push({mid:ids[i],rid:parseInt(params.roleid)})
    }
    const res=await addData('d_menugrant',data)
    return res
}    
