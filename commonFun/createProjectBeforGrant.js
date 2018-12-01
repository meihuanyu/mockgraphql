import db from '../config/database'
import {addData, deleteData} from '../controllers/sql'
import shortid from 'shortid'

module.exports =async function(params,tableName,name,{ctx}){
    //创建菜单
    const resMenu=await addData('system_systemmenu',{
        displayname:params.name,
        name:params.apikey,
        component:'/system/index'
    })
    var jwt = require('jsonwebtoken');
    const token = ctx.header.authorization
    var user = jwt.verify(token, '123qwe');
    params.userid = user.id
    params.id = resMenu.insertId
    //授权菜单All权限(system)
    const systemMenus = await db.query(`SELECT * FROM d_menugrant WHERE FIND_IN_SET(id,queryMenuTree(107)) and rid=1;`)
    //`select nextval("menuGrant")`
    let newKey = {}
    const menus = systemMenus.map(item=>{
        newKey[item.id] = shortid.generate()
        return item
    })
    menus = menus.map(item=>{
        item.id = newKey[item.id]
        item.pid = newKey[item.pid]
        item.rid = user.roleid
    })
    console.log(menus)
    // await addData('d_menugrant',menus)
    return params
}    
