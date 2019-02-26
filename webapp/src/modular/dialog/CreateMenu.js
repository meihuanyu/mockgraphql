import BaseModal from '../../common/BaseModal'
import React from 'react'
import { Form, Input} from 'antd';
import {  graphql, compose } from 'react-apollo'
import systemmenu_create from '../../graphql/systemmenu_create'
import systemmenu_update from '../../graphql/systemmenu_update'


const FormItem = Form.Item;
class CreateMenu extends BaseModal{
    modalProps={
      onOk:()=>{
        const {systemmenu_create,dataSource,gData,systemmenu_update} = this.props
        
        this.props.form.validateFields(async (err, values) => {
          if (!err) {
            if(this.props.type==='edit'){
                values.pid=gData[0].mid
                values.id=gData[0].id
                await systemmenu_update({
                    variables:{
                      ...values
                    }
                })
            }else{
                values.pid=gData.length?gData[0].mid:'top';
                await systemmenu_create({
                    variables:{
                      ...values
                    }
                })
            }
            
          }
        });
      }
    }
    mapPropsToFields=(props)=>{
        console.log(props)
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
                        rules: [{ message: 'Please input your 组件位置!' }],
                      })(
                        <Input/>
                      )}
              </FormItem>
              <FormItem {...formItemLayout} label="操作流程">
                      {getFieldDecorator('oper', {
                        rules: [{ message: 'Please input your 操作流程!' }],
                      })(
                        <Input/>
                      )}
              </FormItem>
              <FormItem style={{display:'none'}} >
                      {getFieldDecorator('pid')(
                        <Input/>
                      )}
              </FormItem>
            </Form>
          );
    }
}
export default compose(
  graphql(systemmenu_create,{name:'systemmenu_create'}),
  graphql(systemmenu_update,{name:'systemmenu_update'})

  
)(Form.create({
    mapPropsToFields(props) {
      const fields=props.gData[0]
      let _temp={}
      for(let field in fields){
            _temp[field]=Form.createFormField({
                value: fields[field],
            })
      }
      return props.type==='edit'?_temp:{}
    },
  })(CreateMenu));

 
 
 
 