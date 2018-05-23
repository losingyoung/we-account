import React from 'react'
import {signUp} from '../../service'
import InputItem from "antd-mobile/lib/input-item";
// import Toast from 'antd-mobile/lib/toast';
import * as Styled from './Styled'
// import {connect} from 'react-redux'
class Login extends React.Component {
    state = {
        account: '',
        pwd: ''
    }
    Login() {
        const {account, pwd} = this.state
        let params = {
          account,
          pwd
        }
        signUp(params).then(res => {
            console.log('signup',res)
        })
        // this
        //     .props
        //     .history
        //     .push('/index')
    }
    changeAccount = val => {
       this.setState({
           account: val
       })
    }
    changePwd = val => {
        this.setState({
            pwd: val
        })
    }
    forgetPassword() {
        signUp()
        // Toast.info('正在紧张建设中-.-', 1.5)
    }
    goDirectly() {
        signUp()
        // Toast.info('正在紧张建设中-.-', 1.5)
    }
    render() {
        const {account, pwd} = this.state
        return (
            <Styled.LoginWrapper>
                <Styled.LoginContainer>
                    <InputItem className='login-input' placeholder="账号" value={account} onChange={this.changeAccount}/>
                    <InputItem type='password' className='login-input' placeholder="密码" value={pwd} onChange={this.changePwd}/>
                    <Styled.LoginTip>账号未注册过将主动注册</Styled.LoginTip>
                    <Styled.LoginButton
                        onClick={this
                        .Login
                        .bind(this)}>登陆(注册)</Styled.LoginButton>
                    <Styled.LoginText>
                        <div
                            onClick={this
                            .forgetPassword
                            .bind(this)}>忘记密码</div>
                        <div
                            onClick={this
                            .goDirectly
                            .bind(this)}>直接试用</div>
                    </Styled.LoginText>
                </Styled.LoginContainer>
            </Styled.LoginWrapper>
        )
    }
}
// const mapState = (state) => {
//     return {
//         counterA: state.counterA,
//         counterB: state.counterB
//     }
// }
// const mapDispatch = dispatch => {
//     return {
//         addA() {
//             dispatch({
//                 namespace: 'aaa',
//                 type: 'ADD'
//             })
//         },
//         mulA() {
//             dispatch({
//                 type: 'MUL'
//             })
//         },
//         reduceA () {
//             dispatch({
//                 namespace: 'aaa',
//                 type: 'REDUCE'
//             })
//         },
//         addB() {
//             dispatch({
//                 namespace: 'bbb',
//                 type: 'ADD'
//             })
//         },
//         reduceB () {
//             dispatch({
//                 namespace: 'bbb',
//                 type: 'REDUCE'
//             })
//         },
//         abB () {
//             dispatch({
//                 type: 'MINUS'
//             })
//         }
//     }
// }
export default Login //connect(mapState, mapDispatch)(Login)