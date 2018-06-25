import React from 'react'
import {asyncComponent} from './util/asyncComponent'
import {Route } from 'react-router-dom'

const createRouter=({menuData ,currentUrl})=>{
    menuData = menuData.map((item)=> {
        console.log('加载'+item.component)
        return <Route key={item.id} path={`${currentUrl}/${item.id}`} component={asyncComponent(()=>import('/modular'+item.component))} />
    })
    return menuData
}


export default createRouter

