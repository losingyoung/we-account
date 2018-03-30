import React from 'react'
import {NavBar, WhiteSpace, Button} from 'antd-mobile'
import GroupItem from './group-item'
import Styled from 'styled-components'
import PropTypes from 'prop-types';

const ItemsContainer = Styled.div`
  padding:15px 10px;
`

const BtnWrapper = Styled.span`
      height:30px;
  svg{
      width:30px !important;
      height:30px;
  }
`
const SearchInput = Styled.input`
  color: #333;
  transition: 0.3s width;
  outline:none;
  height:30px;
  width:${props => props.focus ? "6.6rem" : "5.5rem"};
  border:1px solid #eee;
  border-radius:5px;
  margin: 0 5px;
  text-indent:5px;
  background: ${props => props.focus ? "#fff" : "transparent"};
  &::-webkit-input-placeholder{
      color:${props => props.focus ? "" : "#eee"};
      font-size:16px;
  }
`

class Members extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
            groupInfos: null,
            focusOnSearch: false
        }
    }
    componentWillMount() {
        this._isMounted = true
        // ***********以后放到redux 集中管理***************
        let userInfo = (this.props.location.state && this.props.location.state.userInfo) || {}
        let groupInfos = (this.props.location.state && this.props.location.state.groupInfos) || {}
        if (!this._isMounted) {
            return
        }
        this.setState({
            userInfo,
            groupInfos
        })
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    handleClickSearch = () => {
        this.setState({
            focusOnSearch: true
        })
    }
    handleFocusSearch = () => {
      this.setState({
          focusOnSearch: true
      })
    }
    handleBlurSearch = () => {
        this.setState({
            focusOnSearch: false
        })
    }
    render() {
        let {userInfo, groupInfos, focusOnSearch} = this.state
        return (
            <div>
                <NavBar mode="dark" >
                 <BtnWrapper onClick={this.handleClickSearch}><i className="fa fa-search"/></BtnWrapper>
                   <SearchInput ref={el => {this.searchInputRef = el}} placeholder="搜索组" onFocus={this.handleFocusSearch} onBlur={this.handleBlurSearch} focus={focusOnSearch}/>
                 {focusOnSearch ? <Button key="searchButton" size="small">搜索</Button> : <BtnWrapper><i className="fa fa-plus-circle"/></BtnWrapper>}
                </NavBar>
                {!focusOnSearch && <ItemsContainer>
                    {groupInfos.map(group => {
                        let {members, ...groupInfo} = group
                        return (
                            <GroupItem key={groupInfo.id} groupInfo={groupInfo} memberInfo={members} userInfo={userInfo}>  
                            </GroupItem>
                        )
                    })}
                </ItemsContainer>}
            </div>
        )
    }
}
Members.propTypes = {
    // userInfo: 
}
export default Members