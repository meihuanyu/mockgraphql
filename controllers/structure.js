import db from '../config/database'
import {addData,getOneData, getData , updateData} from '../util/sql'
var jwt = require('jsonwebtoken');
const router = require('koa-router')()

export const querySchme=async function(apikey){
    const resProject=await getOneData('system_project',{apikey})
    let fields={};
    let tFuns={};
    let tArgs={}
    let tables={}
    const projectName=apikey
    const tableData=await getData('graphql_table',{projectid:resProject.id})
    const tIds = tableData.map(item=>item.id)

    //查询对应的字段  转换成对象 id:[{},{}]
    const fieldsArr=await db.query("select f.*,t.tablename fieldrelationtablename from graphql_field f left join graphql_table t on f.graprelationid=t.id where "+orToSql(tIds,'f.relationtableid'))
    let  _fieldsObj = arrToObj(fieldsArr,'relationtableid')

    //查询对应的方法
    const funsArr = await db.query(`select funName,alias,oper,api.type isNew,fun.type comType,dcription, tableid from 
    d_api api LEFT JOIN d_api_link_pfun lpf
    on api.id=lpf.aid
    LEFT JOIN
    d_fun_link_project flp
    on lpf.fpid=flp.id
    LEFT JOIN
    d_function fun
    on flp.fid=fun.id
    where `+orToSql(tIds,'tableid')) 
    for(let i=0; i<funsArr.length;i++){
        const {oper,alias,tableid,funName,comType,isNew} = funsArr[i]
        const index = tIds.indexOf(tableid)
        const tableName = tableData[index].tablename
        if(!tableName){ continue}
        const api_name=alias?alias:tableName+'_'+oper
        funsArr[i].tablename=tableName

        //此处 befor数据有问题
        //如果生成的apiname一样 需要用new类型接口作为主体 after befor 拼凑参数
        //如果有funName 说明被关联了 公共方法
        if(funName){
            tFuns[api_name] = tFuns[api_name]?tFuns[api_name]:{}
            if(comType === 'after'){
                if(tFuns[api_name].afterFunction){
                    tFuns[api_name].afterFunction.push({funName,oper})
                }else{
                    if(isNew === 'original'){ 
                        tFuns[api_name] = Object.assign(funsArr[i],{afterFunction:[{funName,oper}]})
                    }else{
                        tFuns[api_name].afterFunction = [{funName,oper}]
                    }
                }  
            }else if(comType === 'befor'){
                if(tFuns[api_name].beforFunction){
                    tFuns[api_name].beforFunction.push({funName,oper})
                }else{
                    if(isNew === 'original'){ 
                        tFuns[api_name] = Object.assign(funsArr[i],{beforFunction:[{funName,oper}]})
                    }else{
                        tFuns[api_name].beforFunction = [{funName,oper}]
                    }
                } 
            }else if(comType === 'new'){
                tFuns[api_name] = Object.assign(tFuns[api_name],funsArr[i])
            }
        }else{
            tFuns[api_name] = funsArr[i]
        }                           
    }
    //查询对应的参数 
    const argsArr = await db.query(`select  a.*,t.tablename relationtablename from graohql_arg a left join graphql_table t on a.relationid=t.id where (${orToSql(tIds,'a.tableid')})`)
    let _argsObj = arrToObj(argsArr.map(item=>{
        item.relationtablename=item.relationtablename?item.relationtablename:"";
        return item}),'tableid')

    for(let i=0;i<tableData.length;i++){
        const _name=tableData[i].tablename
        const _id=tableData[i].id
        /** 用apikey 过滤表名   */
        const tableName=_name

        //对应的字段
        fields[tableName]=_fieldsObj[_id]

        //对应的参数
        tArgs[tableName]=_argsObj[_id]

        //对应表格
        tables[tableName] = tableData[i]
    }
    return {tFuns,fields,projectName,tArgs,tables};
}
// 数组转对象数组 以arr的一个对象内的key 为最终返回的key
const arrToObj = function (arr,key){
    let _obj = {}
    for(let i=0;i<arr.length;i++){
        if(_obj[arr[i][key]]){
            _obj[arr[i][key]].push(arr[i])
        }else{
            _obj[arr[i][key]]=[arr[i]]
        }
    }
    return _obj
}



module.exports = router