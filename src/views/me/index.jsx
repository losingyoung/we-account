import React from 'react'
import * as Styled from './Styled'
import {connect} from 'react-redux'
import {Switch, Route} from 'react-router'
import {
    NavBar,
    Icon,
    Button,
    WingBlank,
    WhiteSpace,
    List,
    Modal,
    InputItem,
    Toast
} from 'antd-mobile'
const ListItem = List.Item;
// import {  } from "module";
class Me extends React.Component {

    logout() {
      this.props.history.replace('')
    }
    getGender(val) {
        return val === "0" ? "fa fa-mars" : "fa fa-venus"
    }
    changeUseInfo = () => {
        console.log(this.props)
        let curUrl = this.props.match.url
        this.props.history.push(curUrl+'/edit-me')
    }
    render() {
        const {userInfo} = this.props
        if (!userInfo) {
            return (
                <div>
                    <WhiteSpace />
                    加载中
                </div>
            )
        }
        let genderClass = this.getGender(userInfo.gender)
        return (
            <div>
                <Styled.InfoBox>
                    <Styled.InfoWrapper>
                        <Styled.AvatarWrapper>
                            <Styled.AvatarImg src={userInfo.avatar} />
                        </Styled.AvatarWrapper>
                        <Styled.Infos>
                            <span>{userInfo.name}</span>
                            <span className={genderClass}></span>
                        </Styled.Infos>
                    </Styled.InfoWrapper>
                    <Styled.ArrowRightContainer onClick={this.changeUseInfo}>
                       <Styled.ArrowRight className="fa fa-angle-right"/>
                    </Styled.ArrowRightContainer>
                </Styled.InfoBox>
                <WhiteSpace size='md' />
                <Button type='primary' onClick={() => {this.logout()}}>退出账号</Button>
            </div>
        )
    }
}
class EditMe extends React.Component {
    state = {
        name: this.props.userInfo && this.props.userInfo.name,
        tel: this.props.userInfo && this.props.userInfo.tel
    }
    goBack = () => {
        this
            .props
            .history
            .go(-1)
    }
    changeAvatar = () => {

    }
    changeName = (val) => {
      this.setState({
          name: val
      })
    }
    changeTel = (val) => {
        this.setState({
            tel: val
        })
    }
    finishEdit = () => {
        this.props.finishEdit(this.state)
        this.goBack()
    }
    render() {
        const {name, tel} = this.state
        return (
            <div>
                <NavBar icon={<Icon type="left"/>} onLeftClick={this.goBack}>
                    <span>修改个人信息</span>
                </NavBar>
                <WhiteSpace />
                <List>
                    <ListItem extra={<div>extra</div>} arrow="horizontal" onClick={this.changeAvatar}>头像</ListItem>
                    <InputItem className="align-right" value={name} onChange={this.changeName}>名称</InputItem>
                    <InputItem className="align-right" type="phone" value={tel} onChange={this.changeTel}>手机</InputItem>
                </List>
                <WhiteSpace />
                <Button onClick={this.finishEdit} type='primary'>完成</Button>
            </div>
        )
    }
}
class MeContainer extends React.Component {
    finishEdit = (newUserInfo) => {
       console.log('finish new', newUserInfo)
    }
    render() {
        const {userInfo, match} = this.props
        return (
            <Switch>
                <Route path={match.path} exact render={(props) => <Me userInfo={userInfo} {...props}/>}/>
                <Route path={`${match.path}/edit-me`} render={(props) => <EditMe finishEdit={this.finishEdit} userInfo={userInfo} {...props}/>}/>
            </Switch>
        )
    }
}
const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    }
}

export default connect(mapStateToProps)(MeContainer)