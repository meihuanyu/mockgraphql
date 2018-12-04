import React from 'react';
import { Form, Icon, Input, Button, Checkbox,Select ,Radio ,Switch} from 'antd';
import cfetch from '../../util/cFetch'
import BaseModal from '../../common/BaseModal'

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NormalLoginForm extends BaseModal {
  state={
      tables:[],
      isShowObjectSelect:false,
      graphqlObj:[]
  }
  modalProps={
    onOk:async ()=>{
      console.log('xxx')
      this.props.form.validateFields(async (err, values) => {
        if (!err) {
          var res=await cfetch('/api/app/createField',values);
          this.props.close('next')
        }
      });
    
    }
  }
  componentDidMount(){
    const {rModal}=this.props
    rModal.setState({
      modalProps:this.modalParams
    })
  }
  
  hanldeOnchengeTable =(field)=>{
    let tables=this.state.tables;
    let _graphqlObj=[]
    for(let i=0;i<tables.length;i++){
      if(tables[i].id!=field){
        _graphqlObj.push(tables[i])
      }
    }
    this.setState({
      graphqlObj:_graphqlObj
    })
    return field
  }
  componentWillMount=async ()=>{
    let {data}=await cfetch('/api/app/getTables')
    this.setState({ 
        tables:[...data]
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
      let optionTable=this.state.tables.map((item)=><Option key={item.id} value={item.id}>{item.tablename}</Option>)
      let optionObj=this.state.graphqlObj.map((item)=><Option key={item.id} value={item.tablename}>{item.tablename}</Option>)
      return (
      <Form onSubmit={this.handleSubmit} className="login-form">
      <FormItem {...formItemLayout}   label="表名称">
            {getFieldDecorator('relationtableid', {
                rules: [{ required: true, message: 'Please input your 表名称!' }],
                getValueFromEvent:this.hanldeOnchengeTable
            })(
                <Select >
                    {optionTable}
                </Select>
            )}
        </FormItem>
        <FormItem {...formItemLayout} label="字段类型">
          {getFieldDecorator('fieldtype', {
            rules: [{ required: true, message: 'Please input your 字段类型!' }],
            initialValue:'varchar',
            getValueFromEvent:(field)=>{
              this.setState({
                isShowObjectSelect:field=="graphqlObj"
              })
              return field
            }
          })(
            <Select >
                    <Option key={1} value='varchar'>varchar</Option>
                    <Option key={2} value='int'>int</Option>                    
                    <Option key={2} value='obj'>对象</Option>
                    <Option key={3} value='graphqlObj'>关联对象</Option>
            </Select>
          )}
        </FormItem>
        {
           this.state.isShowObjectSelect?
          <div>
             <FormItem {...formItemLayout}   label="对象">
               {getFieldDecorator('graphqlobj', {
                   rules: [{ required: true, message: 'Please input your 对象!' }],
               })(
                   <Select >
                       {optionObj}
                   </Select>
               )}
            </FormItem>
            <FormItem {...formItemLayout} label="单选多选">
            {getFieldDecorator('issingleorlist', {
              rules: [{ required: true, message: 'Please input your 单选多选!' }],
              initialValue:'0'
            })(
              <Select >
                      <Option key={1} value='0'>单选</Option>
                      <Option key={2} value='1'>多选</Option>
              </Select>
            )}
           </FormItem>
          </div>
           :(
             <div>
               <FormItem {...formItemLayout} label="名称">
                {getFieldDecorator('fieldname', {
                  rules: [{ required: true, message: 'Please input your 名称!' }],
                })(
                  <Input/>
                )}
               </FormItem>
               <FormItem {...formItemLayout} label="是否为删除索引">
                  {getFieldDecorator('isdeleteindex', {
                      rules: [{ required: true, message: 'Please input your 是否为删除索引!' }],
                      initialValue:0
                  })(
                      <RadioGroup  >
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                      </RadioGroup>
                  )}
              </FormItem>
              <FormItem {...formItemLayout} label="是否可以被查询索引">
                    {getFieldDecorator('isqueryindex', {
                        rules: [{ required: true, message: 'Please input your 是否可以被查询索引!' }],
                        initialValue:1
                    })(
                        <RadioGroup >
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="是否作为修改索引">
                    {getFieldDecorator('isupdateindex', {
                        rules: [{ required: true, message: 'Please input your 是否作为修改索引!' }],
                        initialValue:0
                    })(
                        <RadioGroup >
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="是否可以修改">
                    {getFieldDecorator('isupdate', {
                        rules: [{ required: true, message: 'Please input your 是否可以修改!' }],
                        initialValue:1
                    })(
                        <RadioGroup >
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
             </div>
           )
          
        }
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;