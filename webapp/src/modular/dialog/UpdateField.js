import React from 'react'
import BaseModal from '../../common/BaseModal'
import {graphql,compose} from 'react-apollo'
import systemmenuDelete from '../../graphql/systemmenuDelete'
import {Table} from 'antd'
import cfetch from '../../util/cFetch'


class Field extends BaseModal{
    state={
        tableData:[],
        selectedRowKeys:[]
    }
    modalProps={
        onOk:async ()=>{
          
            
          this.props.close('next')
        
        }
      }
    componentWillMount(){
        this.loaderTable();
    }
    loaderTable=async ()=>{
        let response=await cfetch('/api/app/getFields',{params:{id:this.props.gData[0].id}})
        this.setState({
            tableData:response.data
        })
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    render(){
        const columns = [{
            title: '字段名称',
            dataIndex: 'fieldname'
          }, {
            title: '类型',
            dataIndex: 'fieldtype'
          },
          , {
            title: '是否可以修改',
            dataIndex: 'isupdate'
          }, {
            title: '是否为删除索引',
            dataIndex: 'isdeleteindex'
          }, {
            title: '是否为搜索索引',
            dataIndex: 'isqueryindex'
          }, {
            title: '单个或多个（对象属性）',
            dataIndex: 'issingleorlist'
          }, {
            title: '是否为修改索引',
            dataIndex: 'isupdateindex'
          }];
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        return <div style={{width:"800px",border:"1px solid red"}}>
            <Table rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns} />
        </div>
    }
}
export default Field