import React from 'react';
import BaseModal from '../../common/BaseModal'
import {  graphql, compose } from 'react-apollo'
import { Tree,message } from 'antd';
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
        if(this.isError){
          message.error('菜单父节点未生成,请先添加此父节点')
          return false
        }
        await grant({
            variables:{ids:JSON.stringify(this.currentRows),roleid}
        })
        message.success('ok')
        this.props.close('next')

    }
  }
  isError = false
  currentRows=[]
  idFindParent = {}
  componentWillMount=async ()=>{
    const roleid=this.props.gData[0].id
    const treeData= (await cFetch('/api/app/query_all_menu?roleid='+roleid)).data
    const {data}=await cFetch('/api/app/query_grant',{roleid})
    let  defaultIds = []
    this.currentRows = []

    for(let i =0;i<data.length;i++){
      const {mid,id,pid,status} = data[i]
      const rid = this.props.gData[0].id

      if(status){
        defaultIds.push(mid)
      }
      
      this.currentRows.push({id,mid,pid,rid,status})
    }
    this.treeEach(treeData,item=>{
      const lvlIndex = item.lvl.split('-')[0]
      this.idFindParent[lvlIndex+'-'+item.id] = item.role_grant_id
    })
    this.setState({
      treeData:treeData,
      grantIds:defaultIds
    })
  }
  treeEach = (data, callback, field = 'children', parent, level = 0)=>{
    for(let i = 0; i < data.length; i++){
        let node = data[i];
        if(callback.call(node, node, parent, i, level, data) === false){
            return false;
        }
        if (node[field] && node[field].length) {
            if(this.treeEach(node[field], callback, field, node, level+1) === false){
                return false;
            }
        }
    }
}
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.displayname} key={item.mid} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.displayname} key={item.mid} dataRef={item} />;
    });
  }
  hindleOncheck=(keys,xx)=>{
    this.isError = false ;
    const checkedNodes = xx.checkedNodes    
    const ids = this.currentRows.map(item=>item.mid)
    if(xx.checked){
      for(let i=0;i<checkedNodes.length;i++){
          if(ids.indexOf(checkedNodes[i].key)===-1){
            //新增一个
            const obj = checkedNodes[i].props.dataRef
            const pLvlIndex = obj.lvl.split('-')[0]-1
            const pLvl = pLvlIndex+'-'+obj.pid
            if(!this.idFindParent[pLvl]){
              // 菜单父节点未生成,请先添加此父节点
              this.isError = true
            }
            this.currentRows.push({
              mid:obj.mid,
              pid:this.idFindParent[pLvl],
              rid:this.props.gData[0].id,
              status:1}
            )
            
          }else{
            this.currentRows[ids.indexOf(checkedNodes[i].key)].status = 1
          }
      }
    }else{
      for(let i=0;i<ids.length;i++){
          const index = keys.checked.indexOf(ids[i].toString())
          if(index === -1){
            // 如果库里不存在 就删掉
            if(this.currentRows[i].id){
              this.currentRows[i].status = 0
            }else{
              this.currentRows.splice(i,1)
            }
            
          }
      }
    }
  }
  render() {
    return this.state?<Tree 
                defaultCheckedKeys={this.state.grantIds}
                checkStrictly={true}
                checkable
                multiple={true}
                onCheck={this.hindleOncheck}
                >
            {this.renderTreeNodes(this.state.treeData)}
            </Tree>:null
  }
}

export default compose(
    graphql(grant,{name:"grant"})
)(Grant)