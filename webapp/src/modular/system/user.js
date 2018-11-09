import React ,{Component} from 'react';
import TopMenu from '../../common/topMenu'
import getMenu from '../../graphql/getMenu'
import user_list from '../../graphql/user_list'

import {  graphql, compose } from 'react-apollo'
import {Table} from 'antd'

class User extends Component {

    state={
        tableData:[],
        selectedRowKeys:[]
    }
    getRows=()=>{
      let tempArr=[]
      this.props.user_list.map(item=>{
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
            title: '账号',
            dataIndex: 'accountnumber',
            key: 'accountnumber',
          }, {
            title: '用户',
            dataIndex: 'username',
            key: 'username',
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
            
            <Table rowSelection={rowSelection} dataSource={this.props.user_list} columns={columns} rowKey="id" />
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
        const {loading,systemmenu_list}=data
        return {
          topMenu:systemmenu_list
        }
      }
    }),
    graphql(user_list,{
        props({data}){
          const {loading,user_list}=data
          return {
            user_list:user_list
          }
        }})
)(User)

