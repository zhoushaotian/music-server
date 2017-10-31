import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import {Progress, Row, Col, Button} from 'antd';

import '../style/music_player.less';
function mapProps(state) {
    return {
        detail: state.detail
    };
}
class MusicPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            total: 1,
            songFlag: 0
        };
    }
    handlePlayStatus(status) {
        if(status) {
            document.getElementById('player').play();
        }else {
            document.getElementById('player').pause();
        }
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({
                currentTime: document.getElementById('player').currentTime,
                total: document.getElementById('player').duration
            });
        }, 1000);
    }
    render() {
        const {detail, songList} = this.props;
        const {total, currentTime, songFlag} = this.state;
        const songName = songList[songFlag] ? songList[songFlag].songName : '';
        const artist = songList[songFlag] ? songList[songFlag].artist : '';
        const img = songList[songFlag] ? songList[songFlag].img : '';
        return (
            <div className="player-wrapper">
                <audio src={detail.url} autoPlay="true" id="player"/>
                <Row type="flex" justify="center">
                    <Col lg={10}>
                        <span className="song-title">{songName}</span>
                        <span className="song-title">{artist}</span>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col lg={10}>
                        <div>
                            <img src={img} alt="" className="player-cover"/>
                        </div>
                    </Col>
                </Row>
                <Row type="flex" justify="center" gutter={32}>
                    <Col lg={2}>
                        <Button type="primary" shape="circle" icon="caret-right" onClick={() => {this.handlePlayStatus(true);}}/>
                    </Col>
                    <Col lg={2}>
                        <Button type="primary" shape="circle" icon="pause" onClick={() => {this.handlePlayStatus(false);}}/>
                    </Col>
                    <Col lg={2}>
                        <a href={detail.url} target="__blank" download=""><Button type="primary" shape="circle" icon="download"></Button></a>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col span={10}>
                        <Progress percent={currentTime / total * 100} strokeWidth={2} format={() => {
                            let currentMin = Math.floor(currentTime / 60);
                            let currentSec = Math.floor(currentTime - currentMin * 60);
                            let totalMin = Math.floor(total / 60);
                            let totalSec = Math.floor(total - totalMin * 60);
                            return `${currentMin}:${currentSec}/${totalMin ? totalMin : 0}:${totalSec ? totalSec : 0}`;
                        }}/>
                    </Col>
                </Row>
            </div>
        );
    }
}
MusicPlayer.propTypes = {
    songList: propTypes.array,
    detail: propTypes.object
};
export default connect(mapProps)(MusicPlayer);