import React, { Component } from 'react';
import { Layout, Icon ,Menu} from 'antd';
import {Link , Route} from 'react-router-dom'

import { graphql, compose } from 'react-apollo';
import getMenu from '../../graphql/getMenu'
import CreateRouter from '../../createRouter'
import gql from 'graphql-tag'

const { Content, Sider ,Header } = Layout;
const { SubMenu } = Menu;

class System extends Component{
    state={
        treeData:[]
    }
    renderTreeNodes = (data) => {
        const currentUrl=this.props.match.url;
        return data.map((item) => {
            if (item.children) {
                return (
                    <SubMenu  title={item.name} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </SubMenu>
                );
            }else{
                return  <Menu.Item  
                            key={item.id} 
                            >
                            <Link to={`${currentUrl}/${item.id}`}>{item.displayname}</Link>
                        </Menu.Item>
            }
            
        });
    }
    mailClick =() =>{
        this.props.currentNode.refetch().then(console.log)
    }
    render(){
        let {systemmenu_list,loading}=this.props.getMenu
        const currentPath=this.props.match.path;
        const systemDom=loading?(<div>loading</div>):(
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu 
                    mode="inline"
                    >
                        {this.renderTreeNodes(systemmenu_list)}
                    </Menu>
                </Sider>
                <Content>
                    <Layout>
                        <Content>
                            <CreateRouter currentUrl={currentPath} menuData={systemmenu_list} />
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        )
        return systemDom
    }
}
const currentNode=gql`
    query GetCurrentNode {
        currentNode @client {
            displayname
            id
         }
    }
`   
export default compose(
    graphql(getMenu,{
        name:"getMenu",
        options:(props)=>({
                variables:{pid:props.match.params.topMenuId}
        })
    }),
    graphql(currentNode, { name: 'currentNode' })
)(System)