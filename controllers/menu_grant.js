
import db from '../config/database'
const router = require('koa-router')()

export const query_grant= async function(ctx,query){
    const res= await db.query(`select * from d_menugrant where rid=${ctx.query.roleid}`)
    if(res){
        ctx.body={
            success:true,
            data:res
        }
    }
}
export const query_all_menu = async (ctx)=>{
    const loginRoleId = ctx.roleid
    const ckRoleId = ctx.query.roleid
    //查出当前登录人 拥有的所有菜单
    let _allMenu = await db.query(`select d.id,m.id mid,m.name,m.oper,d.pid,m.displayname,m.component from system_systemmenu m, d_menugrant d where d.rid=? and d.status=1 and d.mid = m.id`,[loginRoleId])
    //查出需要修改权限人所有菜单
    let ck_allMenu = await db.query(`select d.id,m.id mid,m.name,m.oper,d.pid,m.displayname,m.component from system_systemmenu m, d_menugrant d where d.rid=? and d.status=1 and d.mid = m.id`,[ckRoleId])
    
    ck_allMenu = addListTreeLevel(ck_allMenu)
    // 做一个 选中角色 层级+菜单id 对应 id
    let ckLvlToId = {}
    for(let i=0;i<ck_allMenu.length;i++){
        ckLvlToId[ck_allMenu[i].lvl] = ck_allMenu[i].id
    }
    _allMenu = addListTreeLevel(_allMenu)

    let allMenu = listToTree(_allMenu)
    
    // 当前登录人的所有菜单 如果与 选中角色有重合的菜单 则给定选中角色人id
    treeEach(_allMenu,item=>{
        item.role_grant_id = ckLvlToId[item.lvl]
        return item
    })

    ctx.body = {
        success:true, 
        data:allMenu
    }
}
const treeEach = (data, callback, field = 'children', parent, level = 0)=>{
    for(let i = 0; i < data.length; i++){
        let node = data[i];
        if(callback.call(node, node, parent, i, level, data) === false){
            return false;
        }
        if (node[field] && node[field].length) {
            if(treeEach(node[field], callback, field, node, level+1) === false){
                return false;
            }
        }
    }
}
//给有父子结构的list 添加层级
const addListTreeLevel = (list)=>{
    let idToPid = {}
    for(let i=0;i<list.length;i++){
        idToPid[list[i].id] = list[i].pid
    }
    for(let i=0;i<list.length;i++){
        list[i].lvl = pFindCount(idToPid,list[i].id) +'-'+ list[i].mid 
    }
    return list
}
// 查找一个对象的 深度
const pFindCount = (obj,id,count)=>{
    if(obj[id] !== null && obj[id] !== undefined){
        if(count){
            count++
        }else{
            count=2
        }
        return pFindCount(obj,obj[id],count)
    }else{
        return count?count:1
    }
    
}
const listToTree = (data, options) =>{
    options = options || {};
    var ID_KEY = options.idKey || 'id';
    var PARENT_KEY = options.parentKey || 'pid';
    var CHILDREN_KEY = options.childrenKey || 'children';

    var tree = [],
        childrenOf = {};
    var item, id, parentId;

    for (var i = 0, length = data.length; i < length; i++) {
        item = data[i];
        id = item[ID_KEY];
        parentId = item[PARENT_KEY] || 0;
        // every item may have children
        childrenOf[id] = childrenOf[id] || [];
        // init its children
        item[CHILDREN_KEY] = childrenOf[id];
        if (parentId != 'top') {
            // init its parent's children
            childrenOf[parentId] = childrenOf[parentId] || [];
            // push it into its parent's children
            childrenOf[parentId].push(item);
        } else {
            tree.push(item);
        }
    };

    return tree;
}

router.get('/app/query_all_menu',query_all_menu);
router.get('/app/query_grant',query_grant);
module.exports = router