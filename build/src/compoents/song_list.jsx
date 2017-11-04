import React from 'react';
import propTypes from 'prop-types';

import {Table, Icon} from 'antd';
class SongList extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickRow = this.handleClickRow.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }
    buildSongListItem(currentIndex) {
        return (text, record, index) => {
            if(currentIndex === index) {
                return <span className="song-item item-orange">{text}</span>;
            }
            return <span className="song-item item-blue">{text}</span>;
        };
    }
    handleDeleteClick(index) {
        const {handleDeleteClick} = this.props;
        handleDeleteClick(index);
    }
    handleClickRow(record, index) {
        const {handleClickRow} = this.props;
        handleClickRow(record, index);
    }
    render() {
        const {songList, currentIndex, loading} = this.props;
        const columns = [
            {
                dataIndex: 'songName',
                title: '歌名',
                render: this.buildSongListItem(currentIndex)
            },
            {
                dataIndex: 'artist',
                title: '歌手',
                render: this.buildSongListItem(currentIndex)
            },
            {
                render: (text, record, index) => {
                    return <Icon type="close" onClick={(e) => {e.stopPropagation();this.handleDeleteClick(record, index);}}/>;
                }
            }
        ];
        return (
            <Table columns={columns} dataSource={songList} showHeader={false} pagination={false} className="songlist-wrapper" 
                onRowClick={this.handleClickRow}
                rowKey='songId'
                size='small'
                loading={loading}
                locale={{
                    emptyText: '登陆后添加的歌曲会保存'
                }}>    
            </Table>
        );
    }
}
SongList.propTypes = {
    songList: propTypes.array,
    currentIndex: propTypes.number,
    handleClickRow: propTypes.func,
    handleDeleteClick: propTypes.func,
    loading: propTypes.bool
};
export default SongList;