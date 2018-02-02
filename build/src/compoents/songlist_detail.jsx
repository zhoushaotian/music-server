import React from 'react';
import propTypes from 'prop-types';
class SongListDetail extends React.Component {
    render() {
        const {name} = this.props;
        return (
            <div>
                SongListDetail-{name}
            </div>
        );
    }
}
SongListDetail.propTypes = {
    name: propTypes.string,
    by: propTypes.string,
    time: propTypes.string,
    songList: propTypes.array
};

export default SongListDetail;