import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchSong } from '../actions/list';
import {Row, Col, Select, Input, Layout} from 'antd';
import MUSIC_SERVER from '../../../enums/music_server';

const Option = Select.Option;
const Search = Input.Search;
const {Header, Footer, Content} = Layout;
function mapProps(state) {
    return {
        loading: state.list.loading,
        list: state.list.list
    };
}
class Demo extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        const {dispatch} = this.props; 
        dispatch(searchSong({
            key: '笑忘书',
            server: 'netease'
        }));
    }
    render() {
        return (
            <div className="index-wrapper">
                <Layout>
                    <Header style={{backgroundColor: 'white'}}>
                        <Row type="flex" justify="center">
                            <Col span={2}>
                                <Select defaultValue={MUSIC_SERVER[0]} style={{width: '100%'}}>
                                    {MUSIC_SERVER.map(function(server, index) {
                                        return (
                                            <Option key={index} value={server}>{server}</Option>
                                        );
                                    })}
                                </Select>
                            </Col>
                            <Col span={10}>
                                <Search
                                    placeholder="请输入要查询的关键字"
                                    style={{width: '100%'}}
                                />    
                            </Col>
                        </Row>
                    </Header>
                    <Content>
                        
                    </Content>
                    <Footer>
                       
                    </Footer>
                </Layout>
            </div>
        );
    }
}
Demo.propTypes = {
    list: propTypes.array,
    dispatch: propTypes.func,
    getState: propTypes.func
};
export default connect(mapProps)(Demo);