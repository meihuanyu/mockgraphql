import React from 'react';
import { Form, Icon, Input, Button, Checkbox,Select ,Radio ,Switch} from 'antd';
import {  graphql, compose } from 'react-apollo'
import BaseModal from '../../common/BaseModal'
import project_create from '../../graphql/project_create'

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NormalLoginForm extends BaseModal {
  modalProps={
    onOk:async ()=>{
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          await this.props.project_create({variables:values})
          this.props.close('next')
        }
      });
    
    }
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
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem {...formItemLayout} label="项目名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your 项目名称!' }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="apikey">
          {getFieldDecorator('apikey', {
            rules: [{ required: true, message: 'Please input your apikey!' }],
          })(
            <Input/>
          )}
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default compose(
    graphql(project_create,{name:"project_create"})
)(WrappedNormalLoginForm);