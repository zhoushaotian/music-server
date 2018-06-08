import React from 'react';
import propTypes from 'prop-types';

import { Form, Input, Spin, Button } from 'antd';

const FormItem = Form.Item;

class LoginForm extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const {form, logining} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Spin
                spinning={logining}
                tip="登录中...."
            >
                <Form layout="vertical">
                    <FormItem label="用户名"
                        required={true}
                    >
                        {
                            getFieldDecorator('userName', {
                                rules: [
                                    {
                                        required: true,
                                        min: 3,
                                        max: 15,
                                        message: '用户名格式错误'
                                    }
                                ]
                            })(
                                <Input type="text" />
                            )
                        }
                    </FormItem>
                    <FormItem label="密码">
                        {
                            getFieldDecorator('passwd', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写密码'
                                    }
                                ]
                            })(
                                <Input type="password" />
                            )
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.handleSubmit}>登录</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
    handleSubmit() {
        const { handleLogin, form } = this.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            handleLogin(values);
        });
    }
}

LoginForm.propTypes = {
    logining: propTypes.bool,
    form: propTypes.object,
    handleLogin: propTypes.func
};

export default Form.create()(LoginForm);