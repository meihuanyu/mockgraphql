import React from 'react';
import { Form, Icon, Input, Button, Checkbox,Select ,Radio ,Switch} from 'antd';
import cfetch from '../../util/cFetch'
import BaseModal from '../../common/BaseModal'
import {  graphql, compose } from 'react-apollo'
import userCreate from '../../graphql/userCreate'
import userUpdate from '../../graphql/userUpdate'
import userroleList from '../../graphql/userroleList'
import {onlyReadToUpdate} from '../../util/appliction'

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NormalLoginForm extends BaseModal {
  state={
      roles:[]
  }
  modalProps={
    onOk:async ()=>{
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
            console.log(values)
          if(values.id){
            await this.props.userUpdate({variables:values})
          }else{
            await this.props.userCreate({variables:values})
          }
          this.props.close('next')
        }
      });
    
    }
  }
  componentWillMount=async ()=>{
    const {data:{userroleList}}=await this.props.userroleList.refetch()
    this.setState({
        roles:userroleList
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
    console.log(this.props)
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem {...formItemLayout} label="用户名称">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your 用户名称!' }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="账号">
          {getFieldDecorator('accountnumber', {
            rules: [{ required: true, message: 'Please input your 账号!' }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="密码">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your 密码!' }]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="角色">
          {getFieldDecorator('roleid', {
            rules: [{ required: true, message: 'Please input your 角色!' }],            
            initialValue:this.props.type==='edit'?this.props.gData[0].roleid:null
          })(
            <Select >
                    {this.state.roles.map(item=>{
                        return  <Option key={item.id} value={item.id}>{item.name}</Option>
                    })}
            </Select>
          )}
        </FormItem>
        <FormItem style={{display:'none'}} >
                      {getFieldDecorator('id')(
                        <Input/>
                      )}
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({
    mapPropsToFields(props) {
        const fields=props.gData?props.gData[0]:{}
        let _temp={}
        for(let field in fields){
              _temp[field]=Form.createFormField({
                  value: fields[field]
              })
        }
        return props.type==='edit'?_temp:{}
      }
})(NormalLoginForm);

export default compose(
    graphql(userUpdate,{name:"userUpdate"}),
    graphql(userCreate,{name:"userCreate"}),
    graphql(userroleList,{name:"userroleList"})
)(WrappedNormalLoginForm);