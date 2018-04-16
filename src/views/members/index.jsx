import React from 'react'
import {NavBar, WhiteSpace, Button, Toast} from 'antd-mobile'
import GroupItem from './children/group-item'
import GroupSetting from './children/group-setting'
import GroupDisplay from './children/group-display'
import Styled from 'styled-components'
// import PropTypes from 'prop-types';
import {Route, Switch} from "react-router-dom";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import { connect } from 'react-redux'
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
    ? "225px"
    : "205px"};
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



class GroupLists extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            focusOnSearch: false,
            searchValue: '',
            searchResult: null,
            searched: false
        }
    }
    componentDidMount() {
        this._isMounted = true
        if (!this._isMounted) {
            return
        }
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
            this.setState({searched: true, searchResult: this.props.groupInfo[0]})
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
    // 编辑组
    editGroup = (props) => {
        this.props.changeCurGroup(props)
        let curUrl = this.props.match.url
        this
            .props
            .history
            .push({
                pathname: curUrl + '/edit-group'
            }) 
    }
    // 查看组信息
    displayGroupInfo = (props) => {
        this.props.changeCurGroup(props)
        let curUrl = this.props.match.url
        this
            .props
            .history
            .push({
                pathname: curUrl + '/display-group'
            }) 
    }
    render() {
        const {userInfo, groupInfo} = this.props
        let {
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
                    {groupInfo&&groupInfo.map(group => {
                        let {
                            members,
                            ...groupOwnData
                        } = group
                        return (
                            <GroupItem
                                key={groupOwnData.id}
                                groupInfo={groupOwnData}
                                memberInfo={members}
                                userInfo={userInfo}
                                editGroup={() => {this.editGroup({groupOwnData, members})}}
                                displayGroupInfo = {() => {this.displayGroupInfo({groupOwnData, members})}}
                            ></GroupItem>
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
const mapStateToProps = state => {
    return {
        userInfo: state.userInfo,
        groupInfo: state.groupInfo
    }
}
const GroupListsContainer = connect(mapStateToProps)(GroupLists)
class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            prevPath: '',
            curGroupInfo: {}
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
          this.setState({ prevPath: this.props.location })
        }
    }
    /**
     * 传递当前组参数
     * @curGroupInfo {members: [], groupInfo: {}}
     */
    changeCurGroup = (curGroupInfo) => {
        this.setState({
            curGroupInfo
        })
    }
    addNewGroup = (group) => {
        console.log('finish adding',group)
    }
    editGroup = (group) => {
        console.log('finish edit',group)
    }
    render() {
        let location = this.props.location
        const {groupInfo, members} = this.state.curGroupInfo
        let transtionName = this.state.prevPath&&this.state.prevPath.pathname !== this.props.match.path ? "slideRight" : "slideLeft"
        let LinkedGroupLists = (props) => <GroupListsContainer changeCurGroup={this.changeCurGroup}  {...props}/>
        let CreateNewGroup = (props) => <GroupSetting finishEdit={this.addNewGroup} {...props} title="新建组"/>
        let EditGroup = (props) => <GroupSetting finishEdit={this.editGroup} {...props} groupInfo={groupInfo} members={members} title="编辑组" />
        let DisplayGroup = (props) => <GroupDisplay {...props} groupInfo={groupInfo} members={members} title={groupInfo && groupInfo.name}/>
        return (
            <div >
                <TransitionGroup>
                <CSSTransition key={location.key} classNames={transtionName} timeout={300}>
                    <Switch location={location} >
                        <Route exact path={this.props.match.path} key='list' component={LinkedGroupLists}></Route>
                        <Route
                        path={`${this.props.match.path}/create-group`}
                        component={CreateNewGroup} key='create' ></Route>
                        <Route
                        path={`${this.props.match.path}/edit-group`}
                        component={EditGroup} key='edit' ></Route>
                        <Route
                        path={`${this.props.match.path}/display-group`}
                        component={DisplayGroup} key='display' ></Route>
                    </Switch>
                </CSSTransition>
                </TransitionGroup>
            </div>
        )
    }
}
export default Index