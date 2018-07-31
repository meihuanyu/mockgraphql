import React from 'react'
import { Tree } from 'antd';
import {  graphql, compose } from 'react-apollo'
import getMenu from '../../graphql/getMenu'
import TopMenu from '../../common/topMenu'
const TreeNode = Tree.TreeNode;



class Demo extends React.Component {
  state = {
    treeData: [
    ],
  }
  currentRows=[]
  bug_temp_caese_key=100
  getRows=()=>{
    return this.currentRows
  }
  componentWillMount=()=>{
    let {systemmenuList}=this.props
    const treeData=JSON.parse(JSON.stringify(systemmenuList))
    this.setState({
      treeData:treeData
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
  dataSource={
    currentRows:this.getRows,
    reload:async ()=>{
      this.bug_temp_caese_key++
      const {data:{systemmenuList}}=await this.props.refetch()
      const treeData=JSON.parse(JSON.stringify(systemmenuList))
      for(let i=0;i<treeData.length;i++){
        treeData[i].key=treeData[i].id+"x"+this.bug_temp_caese_key
      }
      this.setState({
        treeData:treeData
      })
    }
  }
  render() {
    return (
      <div>
        <TopMenu menuData={this.props.topMenu} dataSource={this.dataSource} />
        <Tree 
          checkStrictly={true}
          checkable
          multiple={true}
          loadData={this.onLoadData}
          onCheck={this.hindleOncheck}
          >
        {this.renderTreeNodes(this.state.treeData)}
      </Tree>

      </div>
    );
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
    graphql(getMenu,{
      options:(props)=>({
          variables:{
              parentid:props.currentMenu.id
          }
      }),
      props({data}){
        const {loading,systemmenuList}=data
        return {
          topMenu:systemmenuList
        }
      }
    })
)(Demo)