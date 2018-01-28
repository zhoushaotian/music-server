import React from 'react';
import propTypes from 'prop-types';

import { Form, Input, Spin, Button} from 'antd';

import AvatarUpload from '../avatar_upload';
const FormItem = Form.Item;
class signUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    render() {
        const { loading, form} = this.props;
        const {getFieldDecorator, getFieldValue} = form;
        return (
            <Spin spinning={loading} tip="注册中">
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
                    <FormItem label="重复密码">
                        {
                            getFieldDecorator('repasswd', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请再次输入密码'
                                    },
                                    {
                                        validator: (rule, repasswd, cb) => {
                                            repasswd === getFieldValue('passwd') ? cb() : cb('两次输入密码不一致');
                                        }
                                    }
                                ]
                            })(
                                <Input type="password" />
                            )
                        }
                    </FormItem>
                    <FormItem label="昵称">
                        {
                            getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写昵称'
                                    }
                                ]
                            })(
                                <Input type="text" />
                            )
                        }
                    </FormItem>
                    <FormItem label="头像">
                        {
                            getFieldDecorator('avatar')(
                                <AvatarUpload
                                    action='/api/upload/avatar'
                                    name='avatar'
                                />
                            )
                        }
                    </FormItem>
                    <FormItem wrapperCol={{span: 20}}>
                        <Button type="primary" onClick={this.handleSubmit}>注册</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
    handleSubmit() {
        const { handleSignUp, form } = this.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            console.log(values);
            if (err) {
                return;
            }
            handleSignUp(values);
        });
    }
}

signUpForm.propTypes = {
    loading: propTypes.bool,
    form: propTypes.object,
    handleSignUp: propTypes.func
};

export default Form.create()(signUpForm);