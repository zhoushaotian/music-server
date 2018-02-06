import React from 'react';
import propTypes from 'prop-types';

import { Row, Col, Button, Spin, Progress } from 'antd';

class FooterBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            currentTime: 0
        };
        this.handleSongEnd = this.handleSongEnd.bind(this);
        this.handleClickPause = this.handleClickPause.bind(this);
    }
    handleClickPause() {
        const {handleClickPause, isPlay} = this.props;
        if(this.playerDom) {
            isPlay ? this.playerDom.pause() : this.playerDom.play();
            handleClickPause();
        }
    }
    handleSongEnd() {
        const {playList, handleSongEnd} = this.props;
        let random = Math.floor(Math.random() * playList.length);
        if(playList[random]) {
            handleSongEnd(playList[random]);
        }
    }
    render() {
        const { isPlay, url, currentArtist, currentName} = this.props;
        const {currentTime, total} = this.state;
        return (
            <Spin spinning={false}>
                <Row type="flex" justify="start">
                    <Col>
                        <Button type="primary" shape="circle" icon="step-backward" onClick={() => {this.handleSongEnd();}}/>
                        <Button type="primary" shape="circle" icon={isPlay ? 'pause' : 'caret-right'} onClick={this.handleClickPause}/>
                        <Button type="primary" shape="circle" icon="step-forward" onClick={() => {this.handleSongEnd();}}/>
                    </Col>
                    <Col span={10} offset={1}>
                        <audio src={url} autoPlay="true" id="player" onEnded={this.handleSongEnd} />
                        <Progress percent={currentTime / total * 100} strokeWidth={6} format={() => {
                            let currentMin = Math.floor(currentTime / 60);
                            let currentSec = Math.floor(currentTime - currentMin * 60);
                            let totalMin = Math.floor(total / 60);
                            let totalSec = Math.floor(total - totalMin * 60);
                            return `${currentMin}:${currentSec}/${totalMin ? totalMin : 0}:${totalSec ? totalSec : 0}`;
                        }} />
                    </Col>
                    <Col offset={1}>
                        <span>{currentName}-</span><span>{currentArtist}</span>
                    </Col>
                </Row>
            </Spin>
        );
    }
    componentDidMount() {
        this.playerDom = document.getElementById('player');
        setInterval(() => {
            this.setState({
                currentTime: this.playerDom.currentTime,
                total: this.playerDom.duration
            });
        }, 1000);
    }
}
FooterBar.propTypes = {
    isPlay: propTypes.bool.isRequired,
    url: propTypes.string,
    currentName: propTypes.string,
    currentArtist: propTypes.string,
    playList: propTypes.array,
    handleSongEnd: propTypes.func.isRequired,
    handleClickPause: propTypes.func.isRequired
};
export default FooterBar;