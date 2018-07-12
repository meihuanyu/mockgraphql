import React ,{Component} from 'react';
import TopMenu from '../../common/topMenu'
import getMenu from '../../graphql/getMenu'
import userroleList from '../../graphql/userroleList'

import {  graphql, compose } from 'react-apollo'
import {Table} from 'antd'

class Role extends Component {
    state={
        tableData:[],
        selectedRowKeys:[]
    }
    getRows=()=>{
        let tempArr=[]
        this.props.userroleList.map(item=>{
            tempArr[item.id]=item
        })
        return this.state.selectedRowKeys.map(item=>tempArr[item])
    }
    dataSource={
        currentRows:this.getRows,
        reload:async ()=>{

        }
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    render(){
          const columns = [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
          }];

        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return <div>
            <TopMenu menuData={this.props.topMenu} dataSource={this.dataSource} />
            
            <Table rowSelection={rowSelection} dataSource={this.props.userroleList} columns={columns} rowKey="id" />
        </div>
    }
}
export default compose(
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
    }),
    graphql(userroleList,{
        props({data}){
          const {loading,userroleList}=data
          return {
            userroleList:userroleList
          }
        }})
)(Role)
