import React from 'react';
import { Form, Icon, Input, Button, Checkbox,Select ,Radio ,Switch} from 'antd';
import cfetch from '../../util/cFetch'
import BaseModal from '../../common/BaseModal'
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NormalLoginForm extends BaseModal {
  modalProps={
    onOk:async ()=>{
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          values.projectid = this.props.match.params.projectId
          var res=await cfetch('/api/app/createTable',{params:values});
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
        <FormItem {...formItemLayout} label="表名称">
          {getFieldDecorator('tablename', {
            rules: [{ required: true, message: 'Please input your 表名称!' }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="描述">
          {getFieldDecorator('descinfo', {
            rules: [{ required: true, message: 'Please input your 描述!' }],
          })(
            <Input/>
          )}
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm