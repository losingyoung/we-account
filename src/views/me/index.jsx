import React from 'react'
import * as Styled from './Styled'
import {WhiteSpace, Button} from 'antd-mobile'
import {connect} from 'react-redux'
// import {  } from "module";
class Me extends React.Component {

    logout() {
      this.props.history.replace('')
    }
    getGender(val) {
        return val === "0" ? "fa fa-mars" : "fa fa-venus"
    }
    changeUseInfo = () => {

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
const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    }
}

export default connect(mapStateToProps)(Me)