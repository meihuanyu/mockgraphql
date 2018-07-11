import React from 'react'
import { uploadFile } from './test'
import {Query, graphql, compose ,withApollo} from 'react-apollo'
import { Layout, Icon } from 'antd';
import CommonHeader from './common/header'
import {asyncComponent} from './util/asyncComponent'
import {Route } from 'react-router-dom'
import {getMenu} from './graphql/index'
import { assertIdValue } from 'apollo-cache-inmemory';


const { Header, Content, Sider } = Layout;


class App extends React.Component{
    render(show){
        return <div>
                <Query
                    query={getMenu}
                    variables={{
                        parentid:'0'
                    }}
                >
                    {({loading,data:{systemmenuList}})=>{
                            return loading?("loading"):(
                                <Layout>
                                    <Header>
                                        <CommonHeader menuData={systemmenuList} />
                                    </Header>
                                    <Content>
                                        {systemmenuList.map((item)=> <Route key={item.id} path={"/web/"+item.name+"/:topMenuId"} component={asyncComponent(()=>import('/modular'+item.component))} />)}
                                    </Content>                  
                                </Layout>
                            )
                    }}
                </Query>
            </div>
                    
    }
}
export default App;