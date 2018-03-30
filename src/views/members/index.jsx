import React from 'react'
import {NavBar, WhiteSpace, Button, Toast} from 'antd-mobile'
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
            focusOnSearch: false,
            searchValue: '',
            searchResult: null,
            searched: false
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
    changeSearchWord = (e) => {
        e.preventDefault()
       this.setState({
           searchValue: e.target.value,
           searched: false
       })
    }
    handleKeyDownInput = (e) => {
        if (e.keyCode === 13) {
            this.setState({
                searched: true,
                searchResult:this.state.groupInfos[0]
            })
        }

    }
    cancelSearchGroup = () => {
        this.setState({
            focusOnSearch: false,
            searchValue: '',
            searched: false,
            searchResult: null
        })
    }
    handleApplyToJoin = () => {
        Toast.success("申请成功，请等待主人通过！", 2, () => {
            this.cancelSearchGroup()
        })
    }
    render() {
        let {userInfo, groupInfos, focusOnSearch, searchResult, searchValue, searched} = this.state
        console.log(searchValue)
        return (
            <div>
                <NavBar mode="dark" >
                 <BtnWrapper onClick={this.handleClickSearch}><i className="fa fa-search"/></BtnWrapper>
                   <SearchInput ref={el => {this.searchInputRef = el}} value={searchValue} onKeyDown={this.handleKeyDownInput} placeholder={focusOnSearch ? "输入组id搜索组" : "搜索"} onChange={this.changeSearchWord} onFocus={this.handleFocusSearch} focus={focusOnSearch}/>
                 {focusOnSearch ? <Button key="searchButton" size="small" onClick={this.cancelSearchGroup}>取消</Button> : <BtnWrapper><i className="fa fa-plus-circle"/></BtnWrapper>}
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
                <WhiteSpace></WhiteSpace>
                {focusOnSearch && searched && !searchResult&& <div>无结果</div>}
                {focusOnSearch && searchResult  && <GroupItem type="search" key={searchResult.id} groupInfo={searchResult} userInfo={userInfo} clickApllyToJoin={this.handleApplyToJoin}></GroupItem>}
            </div>
        )
    }
}
Members.propTypes = {
    // userInfo: 
}
export default Members