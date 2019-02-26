import db from '../config/database'
import {addData, updateData,getData} from '../controllers/sql'
import shortid from 'shortid'

module.exports =async function(params,tableName,root){
    let menus=JSON.parse(params.ids)
    let grantData = await getData('d_menugrant',{rid:params.roleid})
    let grantDataObj = {}
    for(let i=0;i<grantData.length;i++){
        grantDataObj[grantData[i].id] = grantData[i]
    }
    let addGrantData = []
    let updateGrantData = [] 
    //比对新增 修改的按钮权限
    for(let i=0;i<menus.length;i++){
        if(menus[i].id){
            //修改
            if(grantDataObj[menus[i].id].status === menus[i].status){
                //无需修改
            }else{
                //update
                updateGrantData.push(menus[i])
            }
        }else{
            // 新增
            menus[i].id = shortid.generate()
            addGrantData.push(menus[i])
        }
    }
    if(addGrantData.length){
        await addData('d_menugrant',addGrantData)
    }
    if(updateGrantData.length){
        for(let i=0;i<updateGrantData.length;i++){
            await updateData('d_menugrant',updateGrantData[i])
        }
    }
    return {sucess:true}
}    
 