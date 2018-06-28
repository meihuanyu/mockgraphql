import BaseModal from '../../common/BaseModal'
import React from 'react'
import { Form, Icon, Input, Button, Checkbox,Select ,Radio ,Switch} from 'antd';
import cfetch from '../../util/cFetch'
import {  graphql, compose } from 'react-apollo'
import systemmenuCreate from '../../graphql/systemmenuCreate'

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class CreateMenu extends BaseModal{
    modalProps={
      onOk:()=>{
        const {systemmenuCreate} = this.props
        console.log(this.props)
        // this.props.form.validateFields(async (err, values) => {
        //   if (!err) {
        //     await systemmenuCreate({
        //       variables:{
        //         ...values
        //       }
        //     })
        //   }
        // });
      }
    }
    render(){
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
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem {...formItemLayout} label="名称">
                      {getFieldDecorator('displayname', {
                        rules: [{ required: true, message: 'Please input your 名称!' }],
                      })(
                        <Input/>
                      )}
              </FormItem>
              <FormItem {...formItemLayout} label="英文字段">
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please input your 英文字段!' }],
                      })(
                        <Input/>
                      )}
              </FormItem>
              <FormItem {...formItemLayout} label="组件位置">
                      {getFieldDecorator('component', {
                        rules: [{ required: true, message: 'Please input your 组件位置!' }],
                      })(
                        <Input/>
                      )}
              </FormItem>
              <FormItem {...formItemLayout} label="操作流程">
                      {getFieldDecorator('oper', {
                        rules: [{ required: true, message: 'Please input your 操作流程!' }],
                      })(
                        <Input/>
                      )}
              </FormItem>
            </Form>
          );
    }
}
export default compose(
  graphql(systemmenuCreate,{name:'systemmenuCreate'})
)(Form.create()(CreateMenu));

 
 
 
 