import React from 'react';
import propTypes from 'prop-types';

import { Modal, Form, Input, Spin } from 'antd';
const FormItem = Form.Item;
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
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
    render() {
        const { showLogin, handleCancel, form, logining} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={showLogin}
                title="登录"
                okText="登录"
                onOk={this.handleSubmit}
                onCancel={handleCancel}
                maskClosable={false}

            >
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
                    </Form>
                </Spin>
            </Modal>
        );
    }
}
Login.propTypes = {
    form: propTypes.object,
    showLogin: propTypes.bool,
    handleCancel: propTypes.func,
    handleLogin: propTypes.func,
    logining: propTypes.bool
};

export default Form.create()(Login);