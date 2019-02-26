import {addData, deleteData,getOneData} from '../controllers/sql'
import shortid from 'shortid'
module.exports =async function(params,tableName,_oper,root){
    const {displayname,name,component,oper,pid} = params
    const menuId = shortid.generate()
    const resMenu = await addData('system_systemmenu',{id:menuId,displayname,name,component,oper})
    
    const resMenuGrant = await getOneData('d_menugrant',{rid:1,mid:pid})
    //权限表 添加一条system刚创建的menu
    const grantId = shortid.generate()
    addData('d_menugrant',{id:grantId,mid:menuId,rid:1,pid:resMenuGrant.id})
    return resMenu
}