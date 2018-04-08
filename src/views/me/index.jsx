import React from 'react'
import * as Styled from './Styled'
import {WhiteSpace, Button} from 'antd-mobile'
// import {  } from "module";
class Me extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {}
        }
    }
    componentWillMount() {
        let userInfo = (this.props.location.state && this.props.location.state.userInfo) || {}
        console.log('in me', userInfo)
        this.setState({userInfo})
    }
    logout() {
      this.props.history.replace('')
    }
    getGender(val) {
        return val === "0" ? "fa fa-mars" : "fa fa-venus"
    }
    render() {
        let userInfo = this.state.userInfo
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
                    <Styled.ArrowRight className="fa fa-angle-right"/>
                </Styled.InfoBox>
                <WhiteSpace size='md' />
                <Button type='primary' onClick={() => {this.logout()}}>退出账号</Button>
            </div>
        )
    }
}
export default Me