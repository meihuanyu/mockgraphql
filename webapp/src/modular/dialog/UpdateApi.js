import React from 'react'
import BaseModal from '../../common/BaseModal'
import {graphql,compose} from 'react-apollo'
import systemmenuDelete from '../../graphql/systemmenuDelete'
import {Table,Switch,Select,Button,Input,Spin  } from 'antd'
import cfetch from '../../util/cFetch'
const Option=Select.Option

class Field extends BaseModal{
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
        let response=await cfetch('/api/app/getFields',{id:this.props.gData[0].id})
        let tables=await cfetch('/api/app/getTables')
        this.setState({
            tableData:response.data,
            tables:tables.data,
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
    selectType=(text, col, i)=>{
        return <Select disabled={!col.isEdit} defaultValue={text} style={{width:"100px"}} onChange={(value,option)=>this.changeState(value,i,'fieldtype')}>
                        <Option key={1} value='varchar'>varchar</Option>
                        <Option key={2} value='int'>int</Option>                    
                        <Option key={3} value='obj'>对象</Option>
                        <Option key={4} value='graphqlObj'>关联对象</Option>
                </Select>
    }
    isYesOrNo=(text, col,index, name)=>{
        return <Switch disabled={!col.isEdit} defaultChecked={text==1} onChange={(check)=>this.changeState(check?1:0,index,name)}/>
    }
    guanlian=(text, col,index, name)=>{
        if(col.isEdit){
            if(col.fieldtype==="graphqlObj"){
                return <Select  defaultValue={text} style={{width:"100px"}} onChange={(value,option)=>this.changeState(value,index,'fieldrelationtablename')}> 
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
    isEditing=(record)=>{
        return record.isEdit
    }
    textInput=(text, col, index,name)=>{
        if(col.addEdit){
            return <Input defaultValue={text} onChange={(e)=>this.changeState(e.target.value,index,name)}/>
        }
        return text
    }
    objSingleOrList=(text, col, i)=>{
        if(col.fieldtype==="graphqlObj"){
            return <Switch disabled={!col.isEdit} defaultChecked={text==1} onChange={(checked)=>this.changeState(checked?1:0,i,"issingleorlist")}/>
        }
        return ""
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
            let response=await cfetch('/api/app/updateFields',this.state.tableData[index])
            this.endEdit(index)
        }else{
            let paramsObj=this.state.tableData[index]
            paramsObj.tablename=this.props.gData[0].tablename
            var res=await cfetch('/api/app/createField',paramsObj);
            let  temp=this.state
            temp.tableData[index].isEdit=false
            temp.tableData[index].addEdit=false
            temp.tableData[index].id=res.data.insertId
            this.setState(temp)
        }
    }
    deleteRow=async (index)=>{
        if(this.state.tableData[index].id){
            var res=await cfetch('/api/app/deleteFields',{
                id:this.state.tableData[index].id,
                fieldtype:this.state.tableData[index].fieldtype,
                fieldname:this.state.tableData[index].fieldname,
                fieldrelationtablename:this.state.tableData[index].fieldrelationtablename,
                table:this.props.gData[0].tablename
            });
        }
        let  temp=this.state
        temp.tableData.splice(index,1)
        this.setState(temp)
    }
    newRow=()=>{
        const _row={
            fieldname:"",
            fieldtype:"",
            isEdit:true,
            fieldtype:"",
            isdeleteindex:0,
            isqueryindex:1,
            issingleorlist:0,
            isupdate:1,
            isupdateindex:0,
            addEdit:true,
            relationtableid:this.props.gData[0].id
        }
        let  temp=this.state
        temp.tableData.push(_row)
        this.setState(temp)
    }
    render(){
        const columns = [{
            title: '字段名称',
            dataIndex: 'fieldname',
            render:(text, col, i)=>this.textInput(text, col, i,'fieldname')
          }, 
          {
            title: '类型',
            dataIndex: 'fieldtype',
            render:this.selectType
          },
          , {
            title: '是否修改',
            dataIndex: 'isupdate',
            render:(text, col, i)=>this.isYesOrNo(text,col,i,"isupdate")
          }, {
            title: '删除索引',
            dataIndex: 'isdeleteindex',
            render:this.isYesOrNo
          }, {
            title: '搜索索引',
            dataIndex: 'isqueryindex',
            render:this.isYesOrNo
          }, {
            title: '单个或多个',
            dataIndex: 'issingleorlist',
            render:this.objSingleOrList
          }, {
            title: '修改索引',
            dataIndex: 'isupdateindex',
            render:this.isYesOrNo
          }, {
            title: '关联对象',
            dataIndex: 'fieldrelationtablename',
            render:this.guanlian
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
                <Table rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns} rowKey="id"/>
            </Spin>
        </div>
    }
}
export default Field