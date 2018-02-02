import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import {Button} from 'antd';

import {timeCovert} from '../tool/tool';
import InfoForm from './form/info_form';
import {modifyBio} from '../actions/user';
function mapProps(state) {
    return {
        user: state.user
    };
}
class MyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false
        };
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleChangeBio = this.handleChangeBio.bind(this);
        this.handleCancleEdit = this.handleCancleEdit.bind(this);
        
    }
    handleEditClick() {
        this.setState({
            edit: true
        });
    }
    handleChangeBio(bio) {
        const {dispatch} = this.props;
        this.setState({
            edit: false
        }, () => {
            dispatch(modifyBio(bio));
        });
    }
    handleCancleEdit() {
        this.setState({
            edit: false
        });
    }
    render() {
        const {user} = this.props;
        const {edit} = this.state;
        return (
            <div className="content-wrapper">
                <img src={user.avatar} alt="" className="avatar"/>
                <div className="person-info">
                    <div className="info-header">
                        <span className="person-name">{user.name}</span>
                        <Button onClick={this.handleEditClick}>编辑信息</Button>
                    </div>
                    <br/>
                    {edit ? (
                        <InfoForm loading={user.loading} handleChangeBio={this.handleChangeBio} handleCancle={this.handleCancleEdit} bio={user.bio}/>
                    ) : (
                        <div>
                            <label className="text-bold">个人介绍:</label><span>{user.bio}</span><br/>
                            <label className="text-bold">注册时间:</label><span>{timeCovert(user.time)}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

MyInfo.propTypes = {
    user: propTypes.object,
    dispatch: propTypes.func
};

export default connect(mapProps)(MyInfo);