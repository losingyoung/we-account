import React from 'react'
import * as Styled from './Styled'
import * as Service from "../../service";
import {connect} from 'react-redux'
import {Switch, Route} from 'react-router'
import {
    NavBar,
    Icon,
    Button,
    // WingBlank,
    WhiteSpace,
    List,
    Modal,
    InputItem,
    // Toast
} from 'antd-mobile'
import SlideTransition from "../../components/slide-transition";
// import {TransitionGroup, CSSTransition} from "react-transition-group";
import ImgCroper from "../../components/img-croper";
import { updateUserInfo } from "../../store/actions/userInfo";
import {setGroupInfo} from '../../store/actions/groupInfo'
const ListItem = List.Item;
// import {  } from "module";
class Me extends React.Component {
    state = {
        showBigAvatar: false
    }
    logout() {
        this
            .props
            .history
            .replace('')
    }
    getGender(val) {
        return val === "0"
            ? "fa fa-venus"
            : "fa fa-mars"
    }
    changeUseInfo = () => {
        console.log(this.props)
        let curUrl = this.props.match.url
        this
            .props
            .history
            .push(curUrl + '/edit-me')
    }
    stopBigAvatrClose = (e) => {
        e.stopPropagation()
    }
    showBigAvatar = () => {
        this.setState({showBigAvatar: true})
    }
    hideBigAvatar = () => {
        this.setState({showBigAvatar: false})
    }
    render() {
        const {userInfo} = this.props
        const {showBigAvatar} = this.state
        if (!userInfo) {
            return (
                <div>
                    <WhiteSpace/>
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
                            <Styled.AvatarImg src={userInfo.avatarThumbnail} onClick={this.showBigAvatar}/>
                            <Styled.BigAvatarImgOverlay
                                onClick={this.hideBigAvatar}
                                style={{
                                display: showBigAvatar
                                    ? 'block'
                                    : 'none'
                            }}>
                                <Styled.BigAvatarImg src={userInfo.avatar} onClick={this.stopBigAvatrClose}/>
                            </Styled.BigAvatarImgOverlay>
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
                <WhiteSpace size='md'/>
                <Button
                    type='primary'
                    onClick={() => {
                    this.logout()
                }}>退出账号</Button>
            </div>
        )
    }
}
class EditMe extends React.Component {
    state = {
        name: this.props.userInfo && this.props.userInfo.name,
        tel: this.props.userInfo && this.props.userInfo.tel,
        avatar: this.props.userInfo && this.props.userInfo.avatar,
        showImgCroper: false,
        avatarFile: '',
        uploadedImg: ''
    }
    goBack = () => {
        this.props.history.go(-1)
    }
    changeAvatar = (event) => {
        let avatarFile = event.target.files[0]
        this.setState({showImgCroper: true, avatarFile})
    }
    cancelImgCroper = () => {
        this.avatarInputEl.value = []
        this.setState({showImgCroper: false, uploadedImg: ''})
    }
    completeCropImg = (dataUrl) => {
        this.avatarInputEl.value = []
        if (!dataUrl) {
            Modal.alert('','上传失败')
            this.setState({showImgCroper: false, uploadedImg: ''})
            return
        }
        this.setState({showImgCroper: false, uploadedImg: '', avatar: dataUrl})
    }
    changeName = (val) => {
        this.setState({name: val})
    }
    changeTel = (val) => {
        this.setState({tel: val})
    }
    finishEdit = () => {
        const newData = {
            wa_code: this.props.userInfo.wa_code,
            name: this.state.name,
            tel: this.state.tel,
            avatar: this.state.avatar,
            avatarThumbnail: this.state.avatar
        }
        Service.updateUserInfo(newData).then(res => {
            let data = res.data
            if (data.success) {
                Modal.alert('保存成功')
                this
                .props
                .finishEdit({groupInfo: data.groupInfo,...newData})
            // this.goBack()
            } else {
                Modal.alert('保存失败', data.errorMsg)
            }
        })

    }
    render() {
        const {
            name,
            tel,
            avatar,
            showImgCroper,
            uploadedImg,
            avatarFile
        } = this.state
        const avatarItem = (
            <Styled.ChangeAvatarContainer>
                <Styled.ChangeAvatarImg avatarImg={avatar}>
                    <input
                        ref={el => this.avatarInputEl = el}
                        type="file"
                        accept='image/*'
                        className='avatar-input'
                        onChange={this.changeAvatar}/>
                </Styled.ChangeAvatarImg>
            </Styled.ChangeAvatarContainer>
        )
        return (
            <div>
                <NavBar icon={< Icon type = "left" />} onLeftClick={this.goBack}>
                    <span>修改个人信息</span>
                </NavBar>
                <WhiteSpace/>
                <List>
                    <ListItem extra={avatarItem} arrow="horizontal">头像</ListItem>
                    {showImgCroper &&< ImgCroper imgToCrop = {
                        uploadedImg
                    }
                    avatarFile = {
                        avatarFile
                    }
                    onCancel = {
                        this.cancelImgCroper
                    }
                    onComplete = {
                        this.completeCropImg
                    } > </ImgCroper>}
                    <InputItem className="align-right" value={name} onChange={this.changeName}>名称</InputItem>
                    <InputItem
                        className="align-right"
                        type="phone"
                        value={tel}
                        onChange={this.changeTel}>手机</InputItem>
                </List>
                <WhiteSpace/>
                <Button onClick={this.finishEdit} type='primary'>完成</Button>
            </div>
        )
    }
}
class MeContainer extends React.Component {
    state = {
        prevPath: ''
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.location !== nextProps.location) {
            this.setState({prevPath: this.props.location})
        }
    }
    finishEdit = (newUserInfo) => {
        const {groupInfo, ...userInfo} = newUserInfo
        console.log('finish new', newUserInfo)
        this.props.updateUserInfo(userInfo)
        this.props.setGroupInfo(groupInfo)
    }
    render() {
        const {userInfo, match, location} = this.props
        const transtionName = this.state.prevPath && this.state.prevPath.pathname !== this.props.match.path
            ? "slideRight"
            : "slideLeft"
        return (
            <SlideTransition
                locationKey={location.key}
                transtionName={transtionName}
                timeout={300}>
                <Switch location={location}>
                    <Route
                        path={match.path}
                        exact
                        render={(props) => <Me userInfo={userInfo} {...props}/>}
                        key='me'/>
                    <Route
                        path={`${match.path}/edit-me`}
                        render={(props) => <EditMe
                        finishEdit={this.finishEdit}
                        userInfo={userInfo}
                        {...props}
                        key='editMe'/>}/>
                </Switch>
            </SlideTransition>
        )
    }
}
const mapStateToProps = state => {
    return {userInfo: state.userInfo}
}
const mapDispatchToProps = dispatch => {
    return {
        updateUserInfo(userInfo) {
            dispatch(updateUserInfo(userInfo))
        },
        setGroupInfo(info) {
            dispatch(setGroupInfo(info))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MeContainer)