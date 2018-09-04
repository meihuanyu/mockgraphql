import React from 'react';
import BaseModal from '../../common/BaseModal'
import {  graphql, compose } from 'react-apollo'
import { Tree } from 'antd';
import getMenu from '../../graphql/getMenu'
import gql from 'graphql-tag'
import cFetch from '../../util/cFetch';
const TreeNode = Tree.TreeNode;

const grant=gql`
mutation systemmenu_grant(
    $ids: String
    $roleid: String
  ) {
    systemmenu_grant(
        ids: $ids
        roleid: $roleid
    ) {
        id
    }
  }
`

class Grant extends BaseModal {
  modalProps={
    onOk:async ()=>{
        const {grant}=this.props
        const roleid=this.props.gData[0].id
        const ids=this.currentRows.map(item=>item.id)
        grant({
            variables:{ids:JSON.stringify(ids),roleid}
        })
    }
  }
  currentRows=[]
  componentWillMount=async ()=>{
    let {systemmenuList}=this.props
    const treeData=JSON.parse(JSON.stringify(systemmenuList))
    const roleid=this.props.gData[0].id
    const {data}=await cFetch('/api/app/query_grant',{params:{roleid}})
    this.setState({
      treeData:treeData,
      grantIds:data.map(item=>JSON.stringify(item.mid))
    })
  }
  onLoadData = async (treeNode) => {
    
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
          <TreeNode title={item.displayname} key={item.key?item.key:item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.displayname} key={item.key?item.key:item.id} dataRef={item} />;
    });
  }
  hindleOncheck=(keys,{checkedNodes})=>{
    this.currentRows=[]
    for(let i=0;i<checkedNodes.length;i++){
      this.currentRows.push(checkedNodes[i].props.dataRef)
    }
  }
  render() {
    
    console.log(this.state)
    return this.state?<Tree 
                defaultCheckedKeys={this.state.grantIds}
                checkStrictly={true}
                checkable
                multiple={true}
                loadData={this.onLoadData}
                onCheck={this.hindleOncheck}
                >
            {this.renderTreeNodes(this.state.treeData)}
            </Tree>:null
  }
}

export default compose(
    graphql(getMenu,{
        options:(props)=>({
            variables:{
                parentid:'0'
            }
        }),
        props({data}){
          let {loading,systemmenuList,fetchMore,refetch} =data
          return {
            loading,
            systemmenuList,
            refetch,
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
    }),
    graphql(grant,{name:"grant"})
)(Grant)