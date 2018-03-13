import React from 'react'
import {signUp} from '../../service'
import InputItem from "antd-mobile/lib/input-item";
import * as Styled from './Styled'

class Login extends React.Component {
    Login() {
        signUp().then(res =>{
            console.log(res)
        })
        this.props.history.push('/index')
    }
    render() {
        console.log(this.props)
        return (
            <Styled.LoginWrapper>
                <Styled.LoginContainer>
                <InputItem className='login-input' placeholder="账号" />
                <InputItem type='password' className='login-input' placeholder="密码" />
                <Styled.LoginButton onClick={this.Login.bind(this)}>Login</Styled.LoginButton>
                </Styled.LoginContainer>
            </Styled.LoginWrapper>
        )
    }
}

export default Login