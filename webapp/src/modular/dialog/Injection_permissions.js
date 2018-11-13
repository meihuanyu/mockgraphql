import React from 'react'
import BaseModal from '../../common/BaseModal'
import {graphql,compose} from 'react-apollo'
import getPermissions from '../../graphql/getPermissions'
import permissionsCreate from '../../graphql/permissionsCreate'
import permissionsUpdate from '../../graphql/permissionsUpdate'
import {Table,Switch} from 'antd'
import cfetch from '../../util/cFetch'


class Inject extends BaseModal{
    state={
        tableData:[],
        selectedRowKeys:[]
    }
    modalProps={
        onOk:async ()=>{
          
        }
      }
      onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
     }
     componentWillMount=async ()=>{
         const {getPermissions,permissionsCreate,gData} =this.props
         const {data:{permissions_list}}=await getPermissions.refetch()
         if(true){
            const data=JSON.parse(JSON.stringify(permissions_list))
            this.setState({ 
                tableData:data
            })
         }else{
            let response=await fetch('/api/app/getTables')
            let {data} = await response.json();
            for(let i=0;i<data.length;i++){
                await permissionsCreate({
                    variables:{
                        roleid:gData[0].id,
                        tableid:data[i].id,
                        itable:data[i].tablename,
                        table_update:1,
                        table_add:1,
                        table_query:1,
                        table_delete:0
                    }
                })
            }
         }
        
        
         
          
    }
    changeState=async (text, index,name)=>{
        let  temp=this.state
        temp.tableData[index][name]=text
        this.setState({
            loading:false
        })
        const res=await this.props.permissionsUpdate({
            variables:temp.tableData[index]
        })
        temp.loading=true;
        this.setState(temp)
    }
    isYesOrNo=(text, col,index, name)=>{
        return <Switch  defaultChecked={text==1} onChange={(check)=>this.changeState(check?1:0,index,name)}/>
    }

    render(){
        const { selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        const columns = [{
            title: '表',
            dataIndex: 'itable',
            key: 'itable'
          }, {
            title: '修改',
            dataIndex: 'table_update',
            render:(text, col, i)=>this.isYesOrNo(text, col, i,'table_update')
          }, {
            title: '增加',
            dataIndex: 'table_add',
            render:(text, col, i)=>this.isYesOrNo(text, col, i,'table_add')
          }, {
            title: '查询',
            dataIndex: 'table_query',
            render:(text, col, i)=>this.isYesOrNo(text, col, i,'table_query')
          }, {
            title: '删除',
            dataIndex: 'table_delete',
            render:(text, col, i)=>this.isYesOrNo(text, col, i,'table_delete')
          }];

        return <div>
            <Table rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns} rowKey="id"/>
        </div>
      }
}
export default compose(
    graphql(getPermissions,{
        options:(props)=>{
            return {
                variables:{
                    roleid:props.gData[0].id
                }
            }
        },
        name:"getPermissions"
    }),
    graphql(permissionsCreate,{name:"permissionsCreate"}),
    graphql(permissionsUpdate,{name:"permissionsUpdate"})
)(Inject)