import React from 'react';
import propTypes from 'prop-types';
import {Progress, Row, Col, Button} from 'antd';

import '../style/music_player.less';
class MusicPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            total: 1
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
        const {url, songName, artist, imgSrc} = this.props;
        const {total, currentTime} = this.state;
        return (
            <div className="player-wrapper">
                <audio src={url} autoPlay="true" id="player"/>
                <Row type="flex" justify="center">
                    <Col lg={10}>
                        <span className="song-title">{songName}</span>
                        <span className="song-title">{artist}</span>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col lg={10}>
                        <div>
                            <img src={imgSrc} alt="" className="player-cover"/>
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
                        <a href={url} target="__blank" download=""><Button type="primary" shape="circle" icon="download"></Button></a>
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
    url: propTypes.string,
    songName: propTypes.string,
    artist: propTypes.string,
    imgSrc: propTypes.string
};
export default MusicPlayer;