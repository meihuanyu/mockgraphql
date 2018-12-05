import db from '../config/database'
import {addData, deleteData} from '../controllers/sql'
import shortid from 'shortid'
import { isContext } from 'vm';

module.exports =async function(params,tableName,name,{ctx}){
    //创建菜单
    const topMenuId = shortid.generate()
    const projectId = shortid.generate() 
    await addData('system_systemmenu',{
        id:topMenuId,
        displayname:params.name,
        name:params.apikey,
        component:'/system/index'
    })
    var jwt = require('jsonwebtoken');
    const token = ctx.header.authorization
    var user = jwt.verify(token, '123qwe');
    params.userid = user.id
    params.id = projectId
    //授权菜单All权限(system)
    let menus = await db.query(`SELECT * FROM d_menugrant WHERE FIND_IN_SET(id,queryMenuTree(36)) and rid=1;`)
    //替换system项目的菜单
    let newKey = {}
    
    

    for(let i=0;i<menus.length;i++){
        let id = shortid.generate()
        if(i === 0){
            id = projectId
        }
        newKey[menus[i].id]=id
        menus[i].id = id
        menus[i].rid = parseInt(user.roleid)
    }

    menus[0].mid = topMenuId

    menus = menus.map(item=>{
        item.pid = newKey[item.pid]?newKey[item.pid]:"top"
        return item
    })
    await addData('d_menugrant',menus)
    return params
}    
