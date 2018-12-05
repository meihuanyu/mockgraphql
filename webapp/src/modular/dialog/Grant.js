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
        
        grant({
            variables:{ids:JSON.stringify(this.currentRows),roleid}
        })
    }
  }
  currentRows=[]
  componentWillMount=async ()=>{
    let {systemmenu_list}=this.props
    const treeData=JSON.parse(JSON.stringify(systemmenu_list))
    const roleid=this.props.gData[0].id
    const {data}=await cFetch('/api/app/query_grant',{roleid})
    const defaultIds = data.map(item=>JSON.stringify(item.mid))
    this.currentRows = data.map(item=>({id:item.id,mid:item.mid,pid:item.pid,rid:this.props.gData[0].id}))
    this.setState({
      treeData:treeData,
      grantIds:defaultIds
    })
  }
  onLoadData = async (treeNode) => {
    
    const resData=await this.props.loadMore(treeNode.props.dataRef.id)
    return new Promise((resolve) => {
        treeNode.props.dataRef.children = JSON.parse(JSON.stringify(resData.data.systemmenu_list));
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
          <TreeNode title={item.displayname} key={item.key?item.key:item.mid} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.displayname} key={item.key?item.key:item.mid} dataRef={item} />;
    });
  }
  hindleOncheck=(keys,xx)=>{
    const checkedNodes = xx.checkedNodes    
    const ids = this.currentRows.map(item=>item.mid)
    if(xx.checked){
      for(let i=0;i<checkedNodes.length;i++){
          if(ids.indexOf(checkedNodes[i].key)===-1){
            //新增一个
            const obj = checkedNodes[i].props.dataRef
            this.currentRows.push({id:obj.id,mid:obj.mid,pid:obj.pid,rid:this.props.gData[0].id})
          }
      }
    }else{
      for(let i=0;i<ids.length;i++){
          if(keys.checked.indexOf(ids[i].toString())===-1){
            this.currentRows.splice(i,1)
          }
      }
    }
    console.log(this.currentRows)
  }
  render() {
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
                pid:'top'
            }
        }),
        props({data}){
          let {loading,systemmenu_list,fetchMore,refetch} =data
          return {
            loading,
            systemmenu_list,
            refetch,
            loadMore(id){
              return fetchMore({
                variables: {
                  pid: id,
                },
                updateQuery(previousResult, { fetchMoreResult }){
                  return fetchMoreResult.systemmenu_list
                }
              })
            }
          }
        }
    }),
    graphql(grant,{name:"grant"})
)(Grant)