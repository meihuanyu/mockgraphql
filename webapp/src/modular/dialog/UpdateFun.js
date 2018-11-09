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
        loadding:true
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
        let response=await cfetch('/api/app/query_funs',{params:{id:this.props.gData[0].id}})
        this.setState({
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
                        <Option key={2} value='list'>list</Option>                    
                        <Option key={3} value='single'>single</Option>
                        <Option key={4} value='create'>create</Option>
                        <Option key={5} value='delete'>delete</Option>
                        <Option key={6} value='update'>update</Option>
                </Select>
    }
    selectFs=(text, col, i,name)=>{
        return <Select disabled={!col.isEdit} defaultValue={text} style={{width:"100px"}} onChange={(value,option)=>this.changeState(value,i,name)}>
                        <Option key={0} value='original'>original</Option>
                        <Option key={1} value='after'>after</Option>
                        <Option key={2} value='befor'>befor</Option>                    
                        <Option key={3} value='new'>new</Option>
                </Select>
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
        console.log(this.state.tableData)
        if(this.state.tableData[index].id){
            let _params=this.state.tableData[index]
            let response=await cfetch('/api/app/update_funs',{params:_params})
            this.endEdit(index)
        }else{
            let paramsObj=this.state.tableData[index]
            paramsObj.tableid=this.props.gData[0].id
            var res=await cfetch('/api/app/create_funs',{params:paramsObj});
            let  temp=this.state
            temp.tableData[index].isEdit=false
            temp.tableData[index].id=res.data.insertId
            this.setState(temp)
        }
    }
    deleteRow=async (index)=>{
        if(this.state.tableData[index].id){
            await cfetch('/api/app/delete_funs',{params:{
                id:this.state.tableData[index].id
            }});
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
    render(){
        console.log(this.props)
        const columns = [{
            title: '名称',
            dataIndex: '',
            render:item=>{
                const tablename=this.props.gData[0].tablename
                const fileName = item.alias?item.alias:tablename+"_"+item.oper
                return fileName
            }
          },{
            title: '接口方式',
            dataIndex: 'type',
            render:(text, col, i)=>this.selectFs(text, col, i,'type')
          }, 
          {
            title: '接口类型',
            dataIndex: 'oper',
            render:(text, col, i)=>this.selectType(text, col, i,'oper')
          },{
            title: '别名',
            dataIndex: 'alias',
            render:(text, col, i)=>this.textInput(text, col, i,'alias')
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
            <Button type="primary" onClick={this.newRow}>add</Button>
            <Spin spinning={this.state.loadding}>
                <Table pagination={false} rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns} rowKey="id"/>
            </Spin>
        </div>
    }
}
export default UpdateFun