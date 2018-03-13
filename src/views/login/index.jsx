import React from 'react'
import {signUp} from '../../service'
import InputItem from "antd-mobile/lib/input-item";
import Toast from 'antd-mobile/lib/toast';
import * as Styled from './Styled'

class Login extends React.Component {
    Login() {
        signUp().then(res =>{
            console.log(res)
        })
        this.props.history.push('/index')
    }
    forgetPassword() {
        Toast.info('正在紧张建设中-.-', 1.5)
    }
    goDirectly() {
        Toast.info('正在紧张建设中-.-', 1.5)
    }
    render() {
        console.log(this.props)
        return (
            <Styled.LoginWrapper>
                <Styled.LoginContainer>
                <InputItem className='login-input' placeholder="账号" />
                <InputItem type='password' className='login-input' placeholder="密码" />
                <Styled.LoginTip>账号未注册过将主动注册</Styled.LoginTip>
                <Styled.LoginButton onClick={this.Login.bind(this)}>登陆(注册)</Styled.LoginButton>
                <Styled.LoginText>
                    <div onClick={this.forgetPassword.bind(this)}>忘记密码</div>
                    <div onClick={this.goDirectly.bind(this)}>直接试用</div>
                </Styled.LoginText>
                </Styled.LoginContainer>
            </Styled.LoginWrapper>
        )
    }
}

export default Login