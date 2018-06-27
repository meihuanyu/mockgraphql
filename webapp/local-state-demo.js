import React from 'react'
import { uploadFile } from './test'
import {Query, graphql, compose ,withApollo} from 'react-apollo'
import { Layout, Icon } from 'antd';
import CommonHeader from './common/header'
import {asyncComponent} from './util/asyncComponent'
import {Route } from 'react-router-dom'
import {getMenu} from './graphql/index'

import gql from 'graphql-tag'

const { Header, Content, Sider } = Layout;

const updateGame = gql`
mutation updateGame($index: String!, $value: String!) {
  updateGame(index: $index, value: $value) @client {
    teamAName
  }
}
`
const getCurrentGame=gql`
query {
  currentGame @client {
    teamAName
  }
}
`

class App extends React.Component{
    state={
        xx:null
    }
    bb=()=>{
        console.log('bbbb')
    }
    aa=()=>{
        // this.props.updateGame({
        //     variables: {
        //         index: 'index',
        //         value: 'xxxxx'
        //     }
        // })
        let {client:{cache}} =this.props
        const query=gql`
        query GetCurrentGame {
            currentGame @client {
                teamAName
            }
        }
        `
        const previous = cache.readQuery({ query })
        
        console.log(previous)
    }
    clickggg = ()=>{    
        let {client:{cache}} =this.props
        const query=gql`
        query GetCurrentGame {
            currentGame @client {
                teamAName
            }
        }
        `
        const previous = cache.readQuery({ query })
        const data = {
          currentGame: {
            ...previous.currentGame,
            ['teamAName']: 'xxxx'
          }
        }

        cache.writeQuery({ query, data })
    }
    onSelect=(selectedKeys,e)=>{
        const {selectedNodes}=e
        let selectedNodesArr=[]
        selectedNodes.forEach(((value)=>{
          selectedNodesArr.push(value.props.dataRef)
        }))
        let {client:{cache}} =this.props
        const data = {
          currentNode: selectedNodesArr
        }
    
        cache.writeQuery(data)
      }
    render(){
        return <div>
                <Query
                    query={getMenu}
                >
                    {({loading,data:{systemmenuList}})=>{
                            console.log(loading)
                            return loading?("loading"):(
                                <Layout>
                                    <button onClick={this.clickggg} value="gggg">ggg</button> 
                                    <button onClick={this.aa} value="xxx">aa</button> 
                                    <button>{this.props.currentGame.teamAName}</button>
                                    <Header>
                                        <CommonHeader menuData={systemmenuList} />
                                    </Header>
                                    <Content>
                                        {systemmenuList.map((item)=> <Route key={item.id} path={"/"+item.name+"/:topMenuId"} component={asyncComponent(()=>import('/modular'+item.component))} />)}
                                    </Content>                  
                                </Layout>
                            )
                    }}
                </Query>
            </div>
                    
    }
}
export default compose(
    withApollo,
    graphql(getMenu,{
        name:"getMenu",
        options:(props)=>({
            variables:{
                parentid:'0'
            }
        })
    }),
    graphql(updateGame, {name: 'updateGame'}),
    graphql(getCurrentGame, {
        props: ({ data: { currentGame, loading } }) => ({
          currentGame,
          loading
        })
      })
)(App);