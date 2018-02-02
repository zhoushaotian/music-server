import React from 'react';
import propTypes from 'prop-types';

import { Form, Input, Spin } from 'antd';

import ImgUpload from '../avatar_upload';
const FormItem = Form.Item;

class SongListForm extends React.Component {
    constructor() {
        super();
        
    }
    render() {
        const {form, loading} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Spin spinning={loading}>
                <Form layout="vertical">
                    <FormItem label="歌单名"
                        required={true}
                    >
                        {
                            getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        min: 1,
                                        max: 15,
                                        message: '歌单名长度为1到15个字符'
                                    }
                                ]
                            })(
                                <Input type="text" />
                            )
                        }
                    </FormItem>
                    <FormItem label="歌单介绍"
                        required={true}
                    >
                        {
                            getFieldDecorator('listBio', {
                                rules: [
                                    {
                                        required: true,
                                        min: 1,
                                        max: 50,
                                        message: '歌单介绍长度为1到50个字符'
                                    }
                                ]
                            })(
                                <Input type="text" />
                            )
                        }
                    </FormItem>
                    <FormItem label="歌单封面"
                    >
                        {
                            getFieldDecorator('listCover')(
                                <ImgUpload discription="上传歌单封面" action='/api/upload/avatar'/>
                            )
                        }
                    </FormItem>
                </Form>
            </Spin>
        );
    }
}

SongListForm.propTypes = {
    form: propTypes.object,
    loading: propTypes.bool
};

export default Form.create()(SongListForm);