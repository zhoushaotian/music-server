import React from 'react';
import propTypes from 'prop-types';
import {Avatar, Table, Button} from 'antd';

import {timeCovert} from '../tool/tool';
class SongListDetail extends React.Component {
    render() {
        const {listDetail, handleDeleteSong, handleClickPlus, handleClickHeart, handleSongClick, isSuggest, handleLoveList} = this.props;
        const columns = [
            {
                dataIndex: 'songName',
                title: '音乐标题'
            },
            {
                dataIndex: 'artist',
                title: '歌手'
            },
            {
                title: '操作',
                render: (text, record) => {
                    return (
                        <div className="list-operate">
                            <Button type="primary" shape="circle" icon="plus" onClick={() => {handleClickPlus(record);}}/>
                            {listDetail.own ? <Button type="primary" shape="circle" icon="delete" onClick={() => {handleDeleteSong(record);}}/> : null}
                            <Button type="primary" shape="circle" icon="heart" onClick={() => {handleClickHeart(record);}}/>
                            <Button type="primary" shape="circle" icon="profile" onClick={() => {handleSongClick(record);}}></Button>
                        </div>
                    );
                }
            }
        ];
        let markOpt;
        if(isSuggest && !listDetail.marked) {
            markOpt = <Button  type="primary" icon="plus" onClick={() => {handleLoveList(listDetail.songListId);}}>收藏</Button>;
        }else if(isSuggest) {
            markOpt = <Button icon="heart" type="primary">已收藏</Button>;
        }else {
            markOpt = null;
        }
        return (
            <div className="songlist-detail-wrapper">
                <div className="songlist-header">
                    <img src={listDetail.img} alt="" className="avatar"/>
                    <div className="songlist-info margin-left">
                        <h1>{listDetail.listName} {markOpt}</h1>
                        <Avatar src={listDetail.avatar}/>
                        <span className="small-name">{listDetail.createdBy}</span>
                        <span className="time-info">{timeCovert(listDetail.time)}创建</span>
                    </div>
                </div>
                <div>
                    <Table pagination={false} loading={listDetail.loading} columns={columns} dataSource={listDetail.songList} rowKey={(record) => {
                        return record.songId;
                    }
                    }/>
                </div>
            </div>
        );
    }
}
SongListDetail.propTypes = {
    listDetail: propTypes.object,
    handleDeleteSong: propTypes.func.isRequired,
    handleClickPlus: propTypes.func.isRequired,
    handleClickHeart: propTypes.func.isRequired,
    handleSongClick: propTypes.func.isRequired,
    handleLoveList: propTypes.func,
    isSuggest: propTypes.bool

};

export default SongListDetail;