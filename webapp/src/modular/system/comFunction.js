import React ,{Component} from 'react';
import TopMenu from '../../common/topMenu'
import getMenu from '../../graphql/getMenu'

import {  graphql, compose } from 'react-apollo'
import {Table,Spin} from 'antd'
import cFetch from '../../util/cFetch';

class ComFunction extends Component {

    state={
        tableData:[],
        selectedRowKeys:[],
        tableLoading:false
    }
    getRows=()=>{
      let tempArr=[]
      this.state.tableData.map(item=>{
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
    async componentDidMount(){
        this.setState({
            tableLoading:true
        })
        const resData = await cFetch('/api/app/query_comArgs',{
            projectId:this.props.currentMenu.pid
        })
        this.setState({
            tableData:resData.data,
            tableLoading:false
        })
    }
    render(){
          const columns = [{
            title: '方法名称',
            dataIndex: 'funName',
            key: 'funName',
          }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
          }, {
            title: '描述',
            dataIndex: 'dcription',
            key: 'dcription',
          }];

        const {  selectedRowKeys ,tableData} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return <div>
            <Spin spinning={this.props.loading}>
                <TopMenu  match={this.props.match} menuData={this.props.topMenu} dataSource={this.dataSource} />
            </Spin>
            <Spin spinning={this.state.tableLoading}>
                <Table rowSelection={rowSelection} dataSource={tableData} columns={columns} rowKey="id" />
            </Spin>
            
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
          topMenu:systemmenu_list,
          loading:loading
        }
      }
    })
)(ComFunction)

