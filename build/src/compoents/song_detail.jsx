import React from 'react';
import propTypes from 'prop-types';

import {Button} from 'antd';

class SongDetail extends React.Component {
    render() {
        const {song, handleSongPlay, handleHeartSong, handlePlusSong} = this.props;
        return (
            <div className="songdetail-wrapper">
                <span className="bold-title">{song.songName}</span>
                <span>{song.artist}</span>
                <br/>
                <img src={song.img} alt="" className="song-cover"/>
                <br/>
                <div>
                    <Button type="primary" icon="heart-o" className="button-margin" onClick={() => {handleHeartSong(song);}}>喜欢</Button>
                    <Button type="primary" icon="plus" className="button-margin" onClick={() => {handlePlusSong(song);}}>收藏</Button>
                    <Button type="primary" icon="caret-right" onClick={() => {handleSongPlay(song);}}  className="button-margin">播放</Button>
                </div>
            </div>
        );
    }
}

SongDetail.propTypes = {
    song: propTypes.object,
    handleSongPlay: propTypes.func,
    handleHeartSong: propTypes.func.isRequired,
    handlePlusSong: propTypes.func.isRequired
};

export default SongDetail;