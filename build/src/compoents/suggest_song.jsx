import React from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { Card, Spin } from 'antd';
class SuggestSong extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            songList: []
        };
    }
    componentDidMount() {
        this.setState({
            loading: true
        });
        axios.get('/api/suggest/song').then((res) => {
            if(!this.unmount) {
                this.setState({
                    loading: false,
                    songList: res.data.data.result
                });
            }
        });
    }
    componentWillUnmount() {
        this.unmount = true;
    }
    render() {
        const { loading, songList } = this.state;
        const {handleSongClick} = this.props;
        return (
            <div className="suggest-wrapper">
                <Spin spinning={loading}>
                    <div className="card-list">
                        {
                            songList.map(function (song, index) {
                                return (
                                    <div className="card-wrapper" key={index} onClick={() => {handleSongClick(song);}}>
                                        <Card
                                            hoverable={true}
                                            cover={<img src={song.img} />}
                                            title={`${song.songName}-${song.artist}`}
                                            style={{ width: '200px' }}
                                        >
                                        </Card>
                                    </div>
                                );
                            })
                        }
                    </div>
                </Spin>
            </div>
        );
    }
}
SuggestSong.propTypes = {
    handleSongClick: propTypes.func.isRequired
};
export default SuggestSong;