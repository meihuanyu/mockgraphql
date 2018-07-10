import React ,{Component} from 'react';
import TopMenu from '../../common/topMenu'
import getMenu from '../../graphql/getMenu'
import {  graphql, compose } from 'react-apollo'
import {Table} from 'antd'

class User extends Component {

    state={
        tableData:[]
    }
    componentDidMount(){
        console.log('xxxx')
        this.loaderTable();
    }
    loaderTable=async ()=>{
        let response=await fetch('/api/app/getTables')
        let {data} = await response.json();
        this.setState({
            tableData:data
        })
    }
    

    dataSource={
        currentRows:this.getRows,
        reload:async ()=>{

        }
    }
    render(){
          const columns = [{
            title: '表名称',
            dataIndex: 'tablename',
            key: 'tablename',
          }, {
            title: '描述',
            dataIndex: 'descinfo',
            key: 'age',
          }];
        console.log(this.state.tableData)
        return <div>
            <TopMenu menuData={this.props.topMenu} dataSource={this.dataSource} />
            
            <Table dataSource={this.state.tableData} columns={columns} />
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

