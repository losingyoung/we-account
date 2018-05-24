import React from 'react'
import {signUp} from '../../service'
import InputItem from "antd-mobile/lib/input-item";
import ToggleShow from '../../components/toggle-show'
import {Toast} from 'antd-mobile';
import * as Styled from './Styled'
import md5 from 'blueimp-md5'
// import {connect} from 'react-redux'
function MobileValidate(props) {
  return (
      <div>
        <InputItem className='login-input' placeholder="手机号" value={props.telNo} onChange={props.changeTelNo}/>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <InputItem className='login-input' placeholder="验证码" /><div style={{wordBreak: 'keep-all', background: 'red'}}>发送验证码</div>
        </div>
      </div>
  )
}
class Login extends React.Component {
    state = {
        account: '',
        pwd: '',
        showPwdInput: true,
        telNo: ''
    }
    async Login() {
        const {account, pwd} = this.state
        let params = {
          account,
          pwd: md5(pwd, account)
        }
       const res = await signUp(params)
        if (!res) {return}
        if (res.new) {
            this.setState({
                showPwdInput: false,
                showValidateCode: true
            })
        } else {
            // +++++++++++++++if need tel validate+++++++++++++++
            if (res.correct) {
                this.props.history.push('/index')
            } else {
                Toast.show('密码错误', 1.5)
                // alert('密码错误')
            }
        }
    }
    changeAccount = account => {
       this.setState({
           account
       })
    }
    changePwd = pwd => {
        this.setState({
            pwd
        })
    }
    changeTelNo = telNo => {
        this.setState({
            telNo
        })
    }
    validateTelCode = () => {
        // 验证code
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
        const {account, pwd, telNo, showPwdInput, showValidateCode} = this.state
        return (
            <Styled.LoginWrapper>
                <Styled.LoginContainer>
                    <ToggleShow show={showPwdInput}>
                        <InputItem className='login-input' placeholder="账号" value={account} onChange={this.changeAccount}/>
                        <InputItem type='password' className='login-input' placeholder="密码" value={pwd} onChange={this.changePwd}/>
                        <Styled.LoginTip>账号未注册过将自动注册</Styled.LoginTip>
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
                    </ToggleShow>
                    <ToggleShow show={!showPwdInput && showValidateCode}>
                      <MobileValidate telNo={telNo} changeTelNo={this.changeTelNo}/>
                      <Styled.LoginButton
                            onClick={this
                            .validateTelCode}>验证</Styled.LoginButton>
                    </ToggleShow>
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