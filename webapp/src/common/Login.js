import React from 'react'
import { Form, Icon, Input, Button, Radio, message, Spin} from 'antd';
import cfetch from '../util/cFetch'
import {  graphql, compose } from 'react-apollo'
import  login from '../graphql/login'
const FormItem = Form.Item;

class Login extends React.Component{
    componentDidMount(){
        if(localStorage.token){
            // this.props.history.push('/web')
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let response= await this.props.login({variables:values})
                const res = response.data.login
                if(res.token){
                    localStorage.token=res.token
                    localStorage.username=res.username
                    localStorage.id=res.id
                    window.location.href="/web"
                }
            }
        });
    };
    render(){
        const { getFieldDecorator } = this.props.form;
        return <div className="login">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('accountnumber', {rules: [{ required: true}],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}  />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" />
                        )}
                    </FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                           login
                        </Button>
                    </FormItem>
                </Form>
            </div>
    }
}
const LoginForm = Form.create()(Login)
export default compose(
    graphql(login,{name:"login"})
)(LoginForm);
