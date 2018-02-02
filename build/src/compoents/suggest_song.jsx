import React from 'react';
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
            loading: true,
            songList: []
        });
        axios.get('/api/suggest/song').then((res) => {
            if(!this.unmount) {
                this.setState({
                    loading: false,
                    songList: res.data.songList
                });
            }
        });
    }
    componentWillUnmount() {
        this.unmount = true;
    }
    render() {
        const { loading, songList } = this.state;
        return (
            <div className="suggest-wrapper">
                <Spin spinning={loading}>
                    <div className="card-list">
                        {
                            songList.map(function (song, index) {
                                return (
                                    <div className="card-wrapper" key={index}>
                                        <Card
                                            hoverable={true}
                                            cover={<img src={song.album.coverSmall} />}
                                            title={`${song.name}-${song.artists[0].name}`}
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

export default SuggestSong;