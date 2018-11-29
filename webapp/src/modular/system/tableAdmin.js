import React ,{Component} from 'react';
import TopMenu from '../../common/topMenu'
import getMenu from '../../graphql/getMenu'
import {  graphql, compose } from 'react-apollo'
import {Table,Spin } from 'antd'
import cFetch from '../../util/cFetch';

class User extends Component {
    state={
        tableData:[],
        selectedRowKeys:[],
        tableLoging:true
    }

    
    getRows=()=>{
        let tempArr=[]
        this.state.tableData.map(item=>{
            tempArr[item.id]=item
        })
        return this.state.selectedRowKeys.map(item=>tempArr[item])
    }
    componentDidMount(){
        this.loaderTable();
    }
    loaderTable=async ()=>{
        this.setState({tableLoging:true})
        let {data}=await cFetch('/api/app/getTables')
        this.setState({
            tableData:data,
            tableLoging:false
        })
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    dataSource={
        currentRows:this.getRows,
        reload:async ()=>{

        }
    }
    render(){
          const columns = [{
            title: '表名称',
            dataIndex: 'tablename'
          }, {
            title: '描述',
            dataIndex: 'descinfo'
          }];
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          hideDefaultSelections: true,
          onChange: this.onSelectChange,
        };
        return <div>
            <Spin spinning={this.props.menuLoading}>
                <TopMenu menuData={this.props.topMenu} dataSource={this.dataSource} />
            </Spin>
            <Spin spinning={this.state.tableLoging}>
                <Table rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns} rowKey="id"/>
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
          menuLoading:loading
        }
      }
    })
)(User)