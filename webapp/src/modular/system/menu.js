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
  
  dataSource={
    ff:function(){
        console.log('ffff')
    }
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
          <TreeNode title={item.displayname} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.displayname} key={item.id} dataRef={item} />;
    });
  }
  
  hindleOncheck=(keys,{checkedNodes})=>{
    for(let i=0;i<checkedNodes.length;i++){
      this.currentRows.push(checkedNodes[i].props.dataRef)
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
    }),
    graphql(getMenu,{
      options:(props)=>({
          variables:{
              parentid:'3'
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