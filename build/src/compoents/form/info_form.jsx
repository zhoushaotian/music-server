import React from 'react';
import propTypes from 'prop-types';

import { Form, Input, Spin, Button } from 'antd';

const FormItem = Form.Item;

class InfoForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleChangeClick = this.handleChangeClick.bind(this);
    }
    handleChangeClick() {
        const {handleChangeBio, form} = this.props;
        const {validateFields} = form;
        validateFields((err, values) => {
            if(err) {
                return;
            }
            return handleChangeBio(values.bio);
        });
    }
    handleCancelClick() {
        const {handleCancle} = this.props;
        handleCancle();
    }
    render() {
        const {bio, form, loading} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Spin spinning={loading}>
                <Form layout="vertical">
                    <FormItem label="个人介绍">
                        {
                            getFieldDecorator('bio', {
                                rules: [
                                    {
                                        min: 1,
                                        message: '请填写个人介绍'
                                    }
                                ],
                                initialValue: bio
                            })(
                                <Input type="text"/>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.handleChangeClick}>确定</Button>
                        <Button type="primary" onClick={this.handleCancelClick}>取消</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
}
InfoForm.propTypes = {
    form: propTypes.object,
    bio: propTypes.string,
    loading: propTypes.bool,
    handleChangeBio: propTypes.func,
    handleCancle: propTypes.func
};

export default Form.create()(InfoForm);