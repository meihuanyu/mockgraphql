import React from 'react'
import { Tree } from 'antd';
import {  graphql, compose } from 'react-apollo'
import getMenu from 'graphql/getMenu'
import {withApollo} from 'react-apollo'
import gql from 'graphql-tag'
const TreeNode = Tree.TreeNode;

const updateGame = gql`
mutation updateGame($index: String!, $value: String!) {
  updateGame(index: $index, value: $value) @client {
    teamAScore
    teamBScore
    teamAName
    teamBName
  }
}
`

class Demo extends React.Component {
  state = {
    treeData: [
    ],
  }
  componentWillMount=()=>{
    let {systemmenuList}=this.props
    const treeData=JSON.parse(JSON.stringify(systemmenuList))
    this.setState({
      treeData:treeData
    })
  }
  onLoadData = async (treeNode) => {
    this.props.updateGame({
      variables: {
        index: 'teamAName',
        value: 'xx'
      }
    })
    const resData=await this.props.loadMore(treeNode.props.dataRef.id)
    return new Promise((resolve) => {
        treeNode.props.dataRef.children = JSON.parse(JSON.stringify(resData.data.systemmenuList));
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve()
    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.displayname} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.displayname} key={item.id} dataRef={item} />;
    });
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
  clickggg = ()=>{    
    let {client:{cache}} =this.props
    const query=gql`
    query GetCurrentGame {
      currentGame @client {
        teamAScore
        teamBScore
        teamAName
      }
    }
  `
    const previous = cache.readQuery({ query })
    console.log(previous)
  }
  render() {
    const { onSelect } =this.props
    return (
      <div>
        <Tree 
      multiple={true}
      loadData={this.onLoadData}
      onSelect={onSelect}
      >
        {this.renderTreeNodes(this.state.treeData)}
      </Tree>

        <button onClick={this.clickggg} value="gggg">ggg</button> 
      </div>
    );
  }
}
export default compose(
  withApollo,
  graphql(getMenu,{
        options:(props)=>({
            variables:{
                parentid:'0'
            }
        }),
        props({data}){
          let {loading,systemmenuList,fetchMore} =data
          return {
            loading,
            systemmenuList,
            loadMore(id){
              return fetchMore({
                variables: {
                  parentid: id,
                },
                updateQuery(previousResult, { fetchMoreResult }){
                  return fetchMoreResult.systemmenuList
                }
              })
            }
          }
        }
    })
)(Demo)