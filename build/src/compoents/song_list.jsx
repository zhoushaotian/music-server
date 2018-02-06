import React from 'react';
import propTypes from 'prop-types';

import {Table, Button} from 'antd';
class SongList extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClickPlus = this.handleClickPlus.bind(this);
        this.handleClickHeart = this.handleClickHeart.bind(this);
    }
    handleChange(page) {
        const {handlePageChange} = this.props;
        handlePageChange(page);
    }
    handleClickPlus(song) {
        const {handleAddSong} = this.props;
        handleAddSong(song);
    }
    handleClickHeart(song) {
        const {handleLoveSong} = this.props;
        handleLoveSong(song);
    }
    render() {
        const {songList, handleSongClick} = this.props;
        const columns = [
            {
                dataIndex: 'name',
                title: '歌名'
                
            },
            {
                dataIndex: 'artists[0].name',
                title: '歌手'
            },
            {
                title: '操作',
                render: (text, record) => {
                    return (
                        <div className="list-operate">
                            <Button type="primary" shape="circle" icon="plus" onClick={() => {this.handleClickPlus(record);}}/>
                            <Button type="primary" shape="circle" icon="heart" onClick={() => {this.handleClickHeart(record);}}/>
                            <Button type="primary" shape="circle" icon="profile" onClick={() => {handleSongClick(record);}}></Button>
                        </div>
                    );
                }
            }
        ];
        return (
            <Table columns={columns} dataSource={songList.list} 
                pagination={{
                    current: songList.currentPage,
                    total: songList.total,
                    pageSize: 10,
                    onChange: this.handleChange

                }}
                loading={songList.loading}
                locale={{
                    emptyText: ''
                }}>    
            </Table>
        );
    }
}
SongList.propTypes = {
    songList: propTypes.object,
    handleClickRow: propTypes.func,
    handleDeleteClick: propTypes.func,
    handlePageChange: propTypes.func,
    handleAddSong: propTypes.func,
    handleLoveSong: propTypes.func,
    handleSongClick: propTypes.func.isRequired
};
export default SongList;