import React from 'react';
import propTypes from 'prop-types';

import { Upload, Button, Icon, Avatar } from 'antd';

class AvatarUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img: ''
        };
        this.handleFileChange = this.handleFileChange.bind(this);
    }
    handleFileChange(info) {
        const {onChange} = this.props;
        if(info.file.response) {
            this.setState({
                img: info.file.response.data.path
            });
            onChange(info.file.response.data.path);
        }
    }
    render() {
        const { img } = this.state;
        const {action, name} = this.props;
        return (
            <Upload
                action={action}
                accept='image/*'
                showUploadList={false}
                name={name}
                onChange={this.handleFileChange}
            >
                {img ? <Avatar src={img} size='large'/> : null}
                <Button>
                    <Icon type="upload" />上传头像
                </Button>
            </Upload>
        );
    }
}
AvatarUpload.propTypes = {
    action: propTypes.string,
    name: propTypes.string,
    onChange: propTypes.func
};

export default AvatarUpload;