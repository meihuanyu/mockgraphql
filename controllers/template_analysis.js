import { updateData ,addData,getOneData} from '../util/sql'
import shortid from 'shortid'
import { formartJson, 
         comparisonTemplate,
         createField,
         deleteField,
         updateField} from '../util/template'
const router = require('koa-router')()
const _ProjectId = 'W9dujIO3zg'

const modify_template=async (ctx)=>{
    const project = await getOneData('system_project',{id:_ProjectId})
    const isTemplate = await getOneData('system_template',{projectId:_ProjectId})
    let res = {}
    let newData = {}
    let oldData = {}        
    newData = formartJson(ctx.query.template)
    if(!isTemplate){
        res = await addData('system_template',{
            id:shortid.generate(),
            projectId:_ProjectId,
            template:ctx.query.template,
            type:ctx.query.type
        })
        oldData = {}
    }else{
        res = await updateData('system_template',{
            template:ctx.query.template
        },{projectId:_ProjectId,})
        oldData = formartJson(isTemplate.template)
    }
    const {addObj,updateObj,deleteObj} = comparisonTemplate(newData,oldData)
    for(let key in updateObj){
        await  updateField(key,project,updateObj[key],oldData)
    }
    for(let key in addObj){
        await  createField(key,project,addObj[key])
    }
    for(let key in deleteObj){
        await  deleteField(key,project,deleteObj[key])
    }
    ctx.body = {
        data:res,
        msg:"ok"
    }
}

const query_template=async (ctx)=>{
    const res = await getOneData('system_template',{
        projectId:_ProjectId,
        type:ctx.query.type
    })
    ctx.body = {
        data:res,
        msg:"ok"
    }
}




router.get('/app/template/modify',modify_template);
router.get('/app/template/query',query_template);

module.exports = router