import React from 'react'
import {NavBar, WhiteSpace, Button, Toast} from 'antd-mobile'
import GroupItem from './group-item'
import CreateNewGroup from './create-new-group'
import Styled from 'styled-components'
import PropTypes from 'prop-types';
import {Route, Switch} from "react-router-dom";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import './index.css'

const ItemsContainer = Styled.div `
  padding:15px 10px;
`

const BtnWrapper = Styled.span `
      height:30px;
  svg{
      width:30px !important;
      height:30px;
  }
`
const SearchInput = Styled.input `
  color: #333;
  transition: 0.3s width;
  outline:none;
  height:30px;
  line-height:30px;
  width:${props => props.focus
    ? "6rem"
    : "5.5rem"};
  border:1px solid #eee;
  border-radius:5px;
  margin: 0 5px;
  text-indent:5px;
  background: ${props => props.focus
        ? "#fff"
        : "transparent"};
  &::-webkit-input-placeholder{
      color:${props => props.focus
            ? ""
            : "#eee"};
      font-size:16px;
  }
`

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            prevPath: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
          this.setState({ prevPath: this.props.location })
        }
    }
    render() {
        let location = this.props.location
        let transtionName = this.state.prevPath&&this.state.prevPath.pathname !== this.props.match.path ? "slideRight" : "slideLeft"
        return (
            <div >
                <TransitionGroup>
                <CSSTransition key={location.key} classNames={transtionName} timeout={300}>
                    <Switch location={location} >
                        <Route exact path={this.props.match.path} key='list' component={GroupLists}></Route>
                        <Route
                        path={`${this.props.match.path}/create-group`}
                        component={CreateNewGroup} key='create'></Route>
                    </Switch>
                </CSSTransition>
                </TransitionGroup>
            </div>
        )
    }
}
class GroupLists extends React.Component {
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
        this.setState({userInfo, groupInfos})
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    //点击搜索图标
    handleClickSearch = () => {
        this.setState({focusOnSearch: true})
    }
    // 聚焦搜索框
    handleFocusSearch = () => {
        this.setState({focusOnSearch: true})
    }
    // 搜索词改变
    changeSearchWord = (e) => {
        e.preventDefault()
        this.setState({searchValue: e.target.value, searched: false})
    }
    // 键盘 确定
    handleKeyDownInput = (e) => {
        if (e.keyCode === 13) {
            this.setState({searched: true, searchResult: this.state.groupInfos[0]})
        }

    }
    // 取消搜索
    cancelSearchGroup = () => {
        this.setState({focusOnSearch: false, searchValue: '', searched: false, searchResult: null})
    }
    // 申请加入组
    handleApplyToJoin = () => {
        Toast.success("申请成功，请等待主人通过！", 2, () => {
            this.cancelSearchGroup()
        })
    }
    //添加组
    createNewGroup = () => {
        let curUrl = this.props.match.url
        let state = this.state
        this
            .props
            .history
            .push({
                pathname: curUrl + '/create-group',
                state
            })
    }
    render() {
        let {
            userInfo,
            groupInfos,
            focusOnSearch,
            searchResult,
            searchValue,
            searched
        } = this.state
        return (
            <div className="members-wrapper">
                <NavBar mode="dark">
                    <BtnWrapper onClick={this.handleClickSearch}><i className="fa fa-search"/></BtnWrapper>
                    <SearchInput
                        ref={el => {
                        this.searchInputRef = el
                    }}
                        value={searchValue}
                        onKeyDown={this.handleKeyDownInput}
                        placeholder={focusOnSearch
                        ? "输入组id搜索组"
                        : "搜索"}
                        onChange={this.changeSearchWord}
                        onFocus={this.handleFocusSearch}
                        focus={focusOnSearch}/> {focusOnSearch
                        ? <Button key="searchButton" size="small" onClick={this.cancelSearchGroup}>取消</Button>
                        : <BtnWrapper>
                            <span onClick={this.createNewGroup}><i className="fa fa-plus-circle"/></span>
                        </BtnWrapper>}
                </NavBar>
                {!focusOnSearch && <ItemsContainer>
                    {groupInfos.map(group => {
                        let {
                            members,
                            ...groupInfo
                        } = group
                        return (
                            <GroupItem
                                key={groupInfo.id}
                                groupInfo={groupInfo}
                                memberInfo={members}
                                userInfo={userInfo}></GroupItem>
                        )
                    })}
                </ItemsContainer>}
                <WhiteSpace/> {focusOnSearch && searched && !searchResult && <div>无结果</div>}
                {focusOnSearch && searchResult && <GroupItem
                    type="search"
                    key={searchResult.id}
                    groupInfo={searchResult}
                    userInfo={userInfo}
                    clickApllyToJoin={this.handleApplyToJoin}></GroupItem>}
            </div>
        )
    }
}
Index.propTypes = {
    // userInfo:
}
export default Index