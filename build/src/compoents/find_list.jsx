import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card } from 'antd';
import { getSuggestList } from '../actions/song_list';

function mapProps(state) {
    return {
        suggestList: state.songList.suggestList,
    };
}

class FindList extends React.Component {
    constructor(props) {
        super(props);
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getSuggestList());
    }
    render() {
        const {suggestList, onClickList} = this.props;
        return (
            <div>
                <div className="suggest-wrapper">
                    <div className="card-list">
                        {
                            suggestList.map(function (list, index) {
                                return (
                                    <div className="card-wrapper" key={index} onClick={() => {onClickList(list.id);}}>
                                        <Card
                                            hoverable={true}
                                            cover={<img src={list.img} />}
                                            title={`${list.name}-${list.userName}`}
                                            style={{ width: '200px' }}
                                        >
                                        </Card>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
    handlePageChange(page, pageSize) {
        const {dispatch} = this.props;
        dispatch(getSuggestList(page, pageSize));
        this.setState({
            currentPage: page
        });
    }
}

FindList.propTypes = {
    dispatch: propTypes.func,
    suggestList: propTypes.array,
    onClickList: propTypes.func.isRequired
};

export default connect(mapProps)(FindList);