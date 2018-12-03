import db from '../config/database'
import {addData, deleteData} from '../controllers/sql'
import shortid from 'shortid'

module.exports =async function(params,tableName,name,{ctx}){
    //创建菜单
    const topMenuId = shortid.generate()
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
    //授权菜单All权限(system)
    let menus = await db.query(`SELECT * FROM d_menugrant WHERE FIND_IN_SET(id,queryMenuTree(36)) and rid=1;`)
    //替换system项目的菜单
    menus[0].mid = topMenuId
    let newKey = {}
    for(let i=0;i<menus.length;i++){
        const id = shortid.generate()
        newKey[menus[i].id]=id
        menus[i].id = id
        menus[i].rid = parseInt(user.roleid)
    }
    menus = menus.map(item=>{
        item.pid = newKey[item.pid]?newKey[item.pid]:"top"
        return item
    })
    console.log(menus)
    await addData('d_menugrant',menus)
    return params
}    
