import React from 'react'
import { uploadFile } from './test'
import {Query, graphql, compose ,withApollo} from 'react-apollo'
import { Layout, Icon ,Row,Col,Spin  } from 'antd';
import CommonHeader from './common/header'
import {asyncComponent} from './util/asyncComponent'
import {Route } from 'react-router-dom'
import {getMenu} from './graphql/index'
import { assertIdValue } from 'apollo-cache-inmemory';
import cfetch from './util/cFetch'
const { Header, Content, Sider } = Layout;


class App extends React.Component{
    state={
        resLoading:false
    }
    graphqlApi=()=>{
        window.open("/api/graphiql?type=graphiql&t="+localStorage.token)
    }
    reslApi=async ()=>{
        this.setState({resLoading:true});
        var res=await cfetch("/api/aa");
        this.setState({resLoading:false});
    }
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
                                        <div className="gutter-example">
                                            <Row gutter={16}>
                                            
                                            <Col span={19}>
                                                <CommonHeader menuData={systemmenuList} />
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

                                                <div style={{color:"#fff"}}>用户：{localStorage.username}</div>
                                            </Col>
                                            </Row>
                                        </div>
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