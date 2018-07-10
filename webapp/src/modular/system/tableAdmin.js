import React ,{Component} from 'react';
import TopMenu from '../../common/topMenu'
import getMenu from '../../graphql/getMenu'
import {  graphql, compose } from 'react-apollo'
import {Table} from 'antd'

class User extends Component {
    state={
        tableData:[],
        selectedRowKeys:[]
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
        let response=await fetch('/api/app/getTables')
        let {data} = await response.json();
        this.setState({
            tableData:data
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
            <TopMenu menuData={this.props.topMenu} dataSource={this.dataSource} />
            
            <Table rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns} rowKey="id"/>
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
    })
)(User)