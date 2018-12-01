import React from 'react'
import BaseModal from '../../common/BaseModal'
import {graphql,compose} from 'react-apollo'
import systemmenuDelete from '../../graphql/systemmenuDelete'
import {Table,Switch,Select,Button,Input,Spin  } from 'antd'
import cFetch from '../../util/cFetch';
const Option=Select.Option

class UpdateFun extends BaseModal{
    state={
        tableData:[],
        selectedRowKeys:[],
        loadding:true,
        apis:[],
        curKey:""
    }
    modalProps={
        width:"1000px",
        onOk:async ()=>{
          this.props.close('next')
        
        }
      }
    componentWillMount = async()=>{
        this.loaderTable();
        const res = await cFetch('/api/app/query_project_funs',{
            params:{pid:this.props.gData[0].pid}
        })
        this.setState({
            apis:res.data
        })
    }
    loaderTable=async ()=>{
        this.setState({loadding:true})
        let response=await cFetch('/api/app/query_comArgsLinkFunction',{params:{
                        pid:this.props.gData[0].pid,
                        fid:this.props.gData[0].fid
                    }})
        this.setState({
            tableData:response.data,
            loadding:false
        })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    endEdit=(index)=>{
        let  temp=this.state
        temp.tableData[index].isEdit=false
        this.setState(temp)
    }
    deleteRow=async (index)=>{
        if(this.state.tableData[index].id){
            await cFetch('/api/app/delete_linkComArgs',{params:{
                id:this.state.tableData[index].id
            }});
        }
        let  temp=this.state
        temp.tableData.splice(index,1)
        this.setState(temp)
    }
    newRow = async () =>{
        await cFetch('/api/app/create_link_com',{params:{
            fpid:this.props.gData[0].id,
            aid:this.state.curKey
        }})
        this.loaderTable()
    }
    render(){

        const columns = [{
            title: '名称',
            dataIndex: '',
            render:item=>{
                const fileName = item.alias?item.alias:item.tablename+"_"+item.oper
                return fileName
            }
          },{
            title: '接口方式',
            dataIndex: 'type'
          }, 
          {
            title: '接口类型',
            dataIndex: 'oper',
          },{
            title: '别名',
            dataIndex: 'alias'
          },{
            title: '位置',
            dataIndex: '',
            render:item=>{
                let path = ""
                if(item.type!=='original'){
                    const tablename=this.props.gData[0].tablename
                    const fileName = item.alias?item.alias:tablename+"_"+item.oper
                    path = `\/${tablename}/${fileName}`
                }
                return path
            }
          }, 
          {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record,index) => {
              return <a onClick={() => this.deleteRow(index)}>  delete</a>
            },
          }
    ];
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        const OptionDom = this.state.apis.map((item,index)=><Option key={index} value={item.id}>{item.api}</Option> )
        return <div >
            <Select  style={{width:"400px"}} onChange={(value,option)=>{this.setState({ curKey:value })}}>
                        {OptionDom}
            </Select>
            <Button type="primary" onClick={this.newRow}>add</Button>
            <Spin spinning={this.state.loadding}>
                <Table pagination={false} rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns} rowKey="id"/>
            </Spin>
        </div>
    }
}
export default UpdateFun