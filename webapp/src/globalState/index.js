import StateIndex from './stateIndex'
import gql from 'graphql-tag'
import client from '../ApolloClient'

let Mutation={},defaultState={}
const keys=Object.keys(StateIndex)

for(var i=0;i<keys.length;i++){
    let   key=keys[i]
    const gObj=new StateIndex[key]()
    const objKeys=Object.keys(gObj)
    for(var j=0;j<objKeys.length;j++){
        if(objKeys[j] === "state"){
            gObj[objKeys[j]].__typename=key
            defaultState[key]=gObj[objKeys[j]]
        }else{
            Mutation[key+"_"+objKeys[j]]=gObj[objKeys[j]]
        }
    }
}

//生成matation
export const setGlobal=function (objName,funName){
    const stateObj=new StateIndex[objName]()
    const keys=Object.keys(stateObj.state).join(" ")

    const setTemp=gql`mutation ${objName+"_"+funName}($params: params!) {
        ${objName+"_"+funName}(params: $params) @client {
            ${keys}
        }
    }`
    return setTemp
}
export const getGlobal=function(objName,keysTamp){
    const stateObj=new StateIndex[objName]()
    const keys=keysTamp?keysTamp:Object.keys(stateObj.state).join(" ")
    const getTemp=gql`query {   
                            ${objName} @client {
                                ${keysTamp}
                            }}`
    return  getTemp                    
}

export const runState=function (objName,funName,params){
    return client.mutate({mutation:setGlobal(objName,funName),variables:{params}})

}
export default {Mutation,defaultState}