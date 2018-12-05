import React from 'react'
import BaseModal from '../../common/BaseModal'
import {graphql,compose} from 'react-apollo'
import systemmenuDelete from '../../graphql/systemmenuDelete'
import {Table,Switch,Select,Button,Input,Spin  } from 'antd'
import cfetch from '../../util/cFetch'
const Option=Select.Option

class UpdateFun extends BaseModal{
    state={
        tableData:[],
        selectedRowKeys:[],
        loadding:true,
        importArgsLoadding:false
    }
    modalProps={
        width:"1000px",
        onOk:async ()=>{
          this.props.close('next')
        
        }
      }
    componentWillMount(){
        this.loaderTable();
    }
    loaderTable=async ()=>{
        this.setState({loadding:true})
        let response=await cfetch('/api/app/query_args',{id:this.props.gData[0].id})
        let tables=await cfetch('/api/app/getTables')
        this.setState({
            tables:tables.data,
            tableData:response.data,
            loadding:false
        })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    changeState=async (text, index,name)=>{
        let  temp=this.state
        temp.tableData[index][name]=text
        this.setState(temp)
    }
    selectType=(text, col, i,name)=>{
        return <Select disabled={!col.isEdit} defaultValue={text} style={{width:"100px"}} onChange={(value,option)=>this.changeState(value,i,name)}>
                        <Option key={2} value='varchar'>varchar</Option>                    
                        <Option key={3} value='int'>int</Option>
                        <Option key={4} value='graphqlObj'>graphqlObj</Option>
                        <Option key={5} value='upload'>upload</Option>
                </Select>
    }
    selectTable=(text, col, i,name)=>{
        if(col.isEdit){
            if(col.type==="graphqlObj"){
                return <Select  defaultValue={text} style={{width:"100px"}} onChange={(value,option)=>this.changeState(value,i,name)}> 
                            {
                                this.state.tables.map((item,index)=>{
                                    return <Option key={item.id} value={item.tablename}>{item.tablename}</Option>
                                })
                            }
                        </Select>
            }else{
                return text
            }
            
        }else{
            return text
        }
    }
    isYesOrNo=(text, col,index, name)=>{
        return <Switch disabled={!col.isEdit} defaultChecked={text==1} onChange={(check)=>this.changeState(check?1:0,index,name)}/>
    }
    isEditing=(record)=>{
        return record.isEdit
    }
    textInput=(text, col, index,name)=>{
        if(col.isEdit){  
            return <Input defaultValue={text} onChange={(e)=>this.changeState(e.target.value,index,name)}/>
        }
        return text
    }
    beginEdit=(index)=>{
        let  temp=this.state
        temp.tableData[index].isEdit=true
        this.setState(temp)
    }
    endEdit=(index)=>{
        let  temp=this.state
        temp.tableData[index].isEdit=false
        this.setState(temp)
    }
    save=async (index)=>{
        if(this.state.tableData[index].id){
            let _params=this.state.tableData[index]
            let response=await cfetch('/api/app/update_args',_params)
            this.endEdit(index)
        }else{
            let paramsObj=this.state.tableData[index]
            paramsObj.tableid=this.props.gData[0].id
            var res=await cfetch('/api/app/create_args',paramsObj);
            let  temp=this.state
            temp.tableData[index].isEdit=false
            temp.tableData[index].id=res.data.insertId
            this.setState(temp)
        }
    }
    deleteRow=async (index)=>{
        if(this.state.tableData[index].id){
            await cfetch('/api/app/delete_args',{
                id:this.state.tableData[index].id
            });
        }
        let  temp=this.state
        temp.tableData.splice(index,1)
        this.setState(temp)
    }
    newRow=()=>{
        const _row={
            type:"",
            oper:"",
            alias:"",
            isEdit:true
        }
        let  temp=this.state
        temp.tableData.push(_row)
        this.setState(temp)
    }
    importArgs=async ()=>{
        this.setState({importArgsLoadding:true})
        await cfetch('/api/app/import_args',{id:this.props.gData[0].id})
        this.setState({importArgsLoadding:false})
    }
    render(){
        const columns = [{
            title: '字段',
            dataIndex: 'name',
            render:(text, col, i)=>this.textInput(text,col,i,"name")
          },{
            title: '创建',
            dataIndex: 'iscreate',
            render:(text, col, i)=>this.isYesOrNo(text,col,i,"iscreate")
          }, 
          {
            title: '删除',
            dataIndex: 'isdelete',
            render:(text, col, i)=>this.isYesOrNo(text, col, i,'isdelete')
          },{
            title: '修改',
            dataIndex: 'isupdate',
            render:(text, col, i)=>this.isYesOrNo(text, col, i,'isupdate')
          },{
            title: '单个',
            dataIndex: 'issingle',
            render:(text, col, i)=>this.isYesOrNo(text, col, i,'issingle')
          },{
            title: '列表',
            dataIndex: 'islist',
            render:(text, col, i)=>this.isYesOrNo(text, col, i,'islist')
          }, 
          {
            title: '索引',
            dataIndex: 'isindex',
            render:(text, col, i)=>this.isYesOrNo(text, col, i,'isindex')
          }, 
          {
            title: '类型',
            dataIndex: 'type',
            render:(text, col, i)=>this.selectType(text, col, i,'type')
          }, 
          {
            title: '关联表',
            dataIndex: 'relationid',
            render:(text, col, i)=>this.selectTable(text, col, i,'relationid')
          },
          {
            title: 'operation',
            dataIndex: 'operation',
            width:100,
            render: (text, record,index) => {
              const editable = this.isEditing(record);
              return (
                <div>
                  {editable ? (
                    <span>
                        <a href="javascript:;" onClick={() => this.save(index)}>Save</a>
                        <a href="javascript:;" onClick={() => this.endEdit(index)}> Cancel </a>  
                    </span>
                  ) : (
                    <span>
                        <a onClick={() => this.beginEdit(index)}>Edit</a>
                        <a onClick={() => this.deleteRow(index)}>  delete</a>
                    </span>
                  )}
                </div>
              );
            },
          }
    ];
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        return <div >
            <Spin spinning={this.state.importArgsLoadding}>
                <Button type="primary" onClick={this.newRow}>add</Button>
                <Button type="danger" onClick={this.importArgs}>导入默认参数</Button>
            </Spin>
            <Spin spinning={this.state.loadding}>
                <Table pagination={false} rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns} rowKey="id"/>
            </Spin>
        </div>
    }
}
export default UpdateFun