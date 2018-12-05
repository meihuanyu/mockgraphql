import BaseModal from '../../common/BaseModal'
import React from 'react'
import { Spin,Table} from 'antd';
import cFetch from '../../util/cFetch';

class importFunction extends BaseModal{
    state = {
        tableData:[],
        selectedRowKeys:[],
        tableLoading:false

    }
    modalProps={
      onOk:async ()=>{
        this.setState({tableLoading:true})
        await cFetch('/api/app/importFunction',{
            ids:JSON.stringify(this.state.selectedRowKeys),
            projectId:this.props.match.params.projectId
        })
        this.props.close('next')
      }
    }
    componentDidMount =async()=>{
        super.componentDidMount()
        this.setState({tableLoading:true})
        const res = await cFetch('/api/app/query_comArgs',{
            projectId:'all'
        })
        this.setState({
            tableData:res.data,
            tableLoading:false
        })
    }
    onSelectChange =(selectedRowKeys)=> {
        this.setState({ selectedRowKeys });
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
            onChange: this.onSelectChange
        };
        return <div>
            <Spin spinning={this.state.tableLoading}>
                <Table rowSelection={rowSelection} dataSource={tableData} columns={columns} rowKey="id" />
            </Spin>
            
        </div>
    }
}
export default importFunction;

 
 
 
 