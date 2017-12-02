import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Pagination, Input, Button, message, Spin, Icon} from 'antd';

const {TextArea} = Input;


import { getNotes, commit, deleteNotes } from '../actions/notes';
function timeConvert(time) {
    let timeObj = new Date(time);
    let year = timeObj.getFullYear();
    let month = timeObj.getMonth() + 1;
    let day = timeObj.getDate();
    let hour = timeObj.getHours();
    let min = timeObj.getMinutes();
    let sec = timeObj.getSeconds();
    return `${year}年${month}月${day}日${hour}:${min < 10 ? 0 : ''}${min}:${sec < 10 ? 0 : ''}${sec}`;
}
function mapProps(state) {
    return {
        notes: state.notes
    };
}
class Notes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            comment: ''
        };
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleCommitClick = this.handleCommitClick.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getNotes(1, 8));
    }
    render() {
        const { notes } = this.props;
        const {currentPage, comment} = this.state;
        return (
            <div className='notes-wrapper'>
                <Spin spinning={notes.loading}>
                    <TextArea value={comment} onChange={this.handleTextChange}/>
                    <Button type='primary' style={{float: 'right'}} onClick={this.handleCommitClick}>提交</Button>
                    <div>
                        {notes.notes.map((note, index) => {
                            return (
                                <div key={index}>
                                    <div className='notes-header'>
                                        <Avatar src={note.avatar} />
                                        <span className='notes-name'>{note.name}</span>
                                        <span className='notes-time'>{timeConvert(Number(note.time))}</span>
                                        {note.own ? <Icon type="close-circle" onClick={() => {this.handleDeleteClick(note.id);}}/> : null}
                                    </div>
                                    <p className='msg'>
                                        {note.msg}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <Pagination current={currentPage} pageSize={8} total={notes.total} onChange={this.handlePageChange}/>
                </Spin>
            </div>
        );
    }
    handlePageChange(page, pageSize) {
        const {dispatch} = this.props;
        dispatch(getNotes(page, pageSize));
        this.setState({
            currentPage: page
        });
    }
    handleCommitClick() {
        const {comment, currentPage} = this.state;
        const {dispatch} = this.props;
        if(!comment) {
            return message.error('请输入评论内容');
        }
        dispatch(commit(comment, currentPage, 8));
    }
    handleTextChange(e) {
        this.setState({
            comment: e.target.value
        });
    }
    handleDeleteClick(id) {
        const {dispatch} = this.props;
        const {currentPage} = this.state;
        dispatch(deleteNotes(id, currentPage, 8));
    }
}
Notes.propTypes = {
    notes: propTypes.object,
    dispatch: propTypes.func
};
export default connect(mapProps)(Notes);