import React ,{Component} from 'react';
import TopMenu from '../../common/topMenu'
import getMenu from '../../graphql/getMenu'
import userList from '../../graphql/userList'

import {  graphql, compose } from 'react-apollo'
import {Table} from 'antd'

class User extends Component {

    state={
        tableData:[]
    }
    

    dataSource={
        currentRows:this.getRows,
        reload:async ()=>{

        }
    }
    render(){
          const columns = [{
            title: '用户',
            dataIndex: 'accountnumber',
            key: 'accountnumber',
          }, {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
          }, {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
          }];

        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return <div>
            <TopMenu menuData={this.props.topMenu} dataSource={this.dataSource} />
            
            <Table dataSource={this.props.userList} columns={columns} rowKey="id" />
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
    graphql(userList,{
        props({data}){
          const {loading,userList}=data
          return {
            userList:userList
          }
        }})
)(User)

