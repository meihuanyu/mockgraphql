import React from 'react'
import {Route } from 'react-router-dom'
import AsyncMenu from './util/AsyncMenu'
const createRouter=({menuData ,currentUrl})=>{
    menuData = menuData.map((item)=> {
        return <Route key={item.id} path={`${currentUrl}/${item.id}`} render={props => {
                       return <AsyncMenu component={item.component} currentMenu={item} {...props.match.params} history={props.history} match={props.match}/>

        }} />
    })
    return menuData
}
export default createRouter

