import React ,{Component} from 'react';
import TopMenu from '../../common/topMenu'
import getMenu from '../../graphql/getMenu'
import project_list from '../../graphql/project_list'

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
            
            <Table rowSelection={rowSelection} dataSource={this.props.project_list} columns={columns} rowKey="id" />
        </div>
    }
}
export default compose(
    graphql(getMenu,{
      options:(props)=>({
          variables:{
              pid:props.currentMenu.id
          }
      }),
      props({data}){
        const {loading,systemmenu_list}=data
        return {
          topMenu:systemmenu_list
        }
      }
    }),
    graphql(project_list,{
        props({data}){
          const {loading,project_list}=data
          return {
            project_list:project_list
          }
        }})
)(User)

