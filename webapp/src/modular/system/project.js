import React ,{Component} from 'react';
import TopMenu from '../../common/topMenu'
import getMenu from '../../graphql/getMenu'
import projectList from '../../graphql/projectList'

import {  graphql, compose } from 'react-apollo'
import {Table} from 'antd'

class User extends Component {

    state={
        tableData:[],
        selectedRowKeys:[]
    }
    getRows=()=>{
      let tempArr=[]
      this.props.userList.map(item=>{
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
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: 'apikey',
            dataIndex: 'apikey',
            key: 'apikey',
          }];

        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return <div>
            <TopMenu menuData={this.props.topMenu} dataSource={this.dataSource} />
            
            <Table rowSelection={rowSelection} dataSource={this.props.projectList} columns={columns} rowKey="id" />
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
    graphql(projectList,{
        options:(props)=>({
            variables:{
                userid:parseInt(localStorage.id)
            }
        }),
        props({data}){
          const {loading,projectList}=data
          return {
            projectList:projectList
          }
        }})
)(User)

