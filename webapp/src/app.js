import React from 'react'
import { uploadFile } from './test'
import {Query, graphql, compose ,withApollo} from 'react-apollo'
import { Layout, Icon ,Row,Col,Spin,Menu,Dropdown,Button} from 'antd';
import CommonHeader from './common/header'
import {asyncComponent} from './util/asyncComponent'
import {Route } from 'react-router-dom'
import {getMenu} from './graphql/index'
import { assertIdValue } from 'apollo-cache-inmemory';
import cfetch from './util/cFetch'
import ApolloClient from './ApolloClient'
const { Header, Content, Sider } = Layout;


class App extends React.Component{
    state={
        resLoading:false
    }
    graphqlApi=()=>{
        window.open("/api/graphiql/textx")
    }
    reslApi=async ()=>{
        this.setState({resLoading:true});
        var res=await cfetch("/api/aa");
        window.location.href=window.location.href
    }
    hanlderClose=()=>{
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href="/login"
    }
    render(show){
        const menu = (
            <Menu>
              <Menu.Item>
                <a rel="noopener noreferrer" onClick={this.hanlderClose} href="#">退出</a>
              </Menu.Item>
              <Menu.Item>
                <a rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
              </Menu.Item>
              <Menu.Item>
                <a rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
              </Menu.Item>
            </Menu>
          );
          
        return <div>
                <Query
                    query={getMenu}
                    variables={{
                        parentid:'0'
                    }}
                >
                    {({loading,data:{systemmenu_list}})=>{
                            console.log(systemmenu_list)
                            return loading?("loading"):(
                                <Layout>
                                    <Header>
                                        <div className="gutter-example">
                                            <Row gutter={16}>
                                            
                                            <Col span={19}>
                                                <CommonHeader menuData={systemmenu_list} />
                                            </Col>
                                            <Col span={1}>  
                                                <div onClick={this.reslApi} style={{color:"#fff",fontSize:"15px",cursor:"pointer"}}>
                                                    <Spin spinning={this.state.resLoading}>
                                                        <Icon title="重启API" type="windows" />
                                                    </Spin>
                                                </div>
                                            </Col>
                                            <Col span={1}>  
                                                <div onClick={this.graphqlApi} style={{color:"#fff",fontSize:"15px",cursor:"pointer"}}><Icon title="API文档" type="api" /></div>
                                            </Col>
                                            <Col span={3}>                                                
                                                <Dropdown overlay={menu} placement="bottomLeft">
                                                    <Button ghost >用户：{localStorage.username}</Button>
                                                </Dropdown>
                                            </Col>
                                            </Row>
                                        </div>
                                    </Header>
                                    <Content>
                                        {systemmenu_list.map((item)=> <Route key={item.id} path={"/web/"+item.name+"/:topMenuId"} component={asyncComponent(()=>import('/modular'+item.component))} />)}
                                    </Content>                  
                                </Layout>
                            )
                    }}
                </Query>
            </div>
                    
    }
}
export default App;