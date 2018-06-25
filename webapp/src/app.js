import React from 'react'
import { uploadFile } from './test'
import { graphql, compose } from 'react-apollo'

import { Layout, Icon } from 'antd';
import CommonHeader from './common/header'
import {asyncComponent} from './util/asyncComponent'
import {Route } from 'react-router-dom'
import {getMenu} from './graphql/index'


const { Header, Content, Sider } = Layout;
class App extends React.Component{
    render(){

        let {systemmenuList,loading}=this.props.getMenu
          if(!systemmenuList){
            systemmenuList=[]
          }
       
        return <div>
                    {loading?("loading"):(
                        <Layout>
                            <Header>
                                <CommonHeader menuData={systemmenuList} />
                            </Header>
                            <Content>
                                {systemmenuList.map((item)=> <Route key={item.id} path={"/"+item.name+"/:topMenuId"} component={asyncComponent(()=>import('/modular'+item.component))} />)}
                            </Content>                  
                        </Layout>
                    )}
            </div>
                    
    }
}
export default compose(
    graphql(getMenu,{
        name:"getMenu",
        options:(props)=>({
            variables:{
                parentid:'0'
            }
        })
    })
)(App);