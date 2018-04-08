import React from 'react'
import * as Styled from './Styled'
import PropTypes from 'prop-types';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0
        };
    }
    clickTab(index) {
     this.setState({
        activeTab: index
     })
    this.props.activeRoute(this.props.routeArr[index])
    }
    render() {
        
        return (
            <Styled.Container>
                <Styled.TabItem onClick={(e) => {this.clickTab(0)}} active={this.state.activeTab === 0} >
                    <Styled.TabIcon className='fas fa-chart-bar' />
                    <Styled.TabTitle>统计</Styled.TabTitle>
                </Styled.TabItem>
                <Styled.TabItem onClick={(e) => {this.clickTab(1)}} active={this.state.activeTab === 1}>
                    <Styled.TabIcon className='fas fa-comment'/>
                    <Styled.TabTitle>消息</Styled.TabTitle>
                </Styled.TabItem>
                <Styled.AddButton onClick={(e) => {this.clickTab(2)}} active={this.state.activeTab === 2}>
                  <i className="fa fa-plus-circle" />
                </Styled.AddButton>
                <Styled.PlaceholderButton/>
                <Styled.TabItem onClick={(e) => {this.clickTab(3)}} active={this.state.activeTab === 3}>
                    <Styled.TabIcon className='fas fa-users'/>
                    <Styled.TabTitle>成员</Styled.TabTitle>
                </Styled.TabItem>
                <Styled.TabItem onClick={(e) => {this.clickTab(4)}} active={this.state.activeTab === 4}>
                    <Styled.TabIcon className='fas fa-paw'/>
                    <Styled.TabTitle>我的</Styled.TabTitle>
                </Styled.TabItem>
                
            </Styled.Container>
        )

    }
}
Footer.propTypes = {
    activeRoute: PropTypes.func,
    routeArr: PropTypes.array
}
export default Footer