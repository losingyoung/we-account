import React from 'react'
import {signUp} from '../../service'
import InputItem from "antd-mobile/lib/input-item";
import ToggleShow from '../../components/toggle-show'
import {Toast} from 'antd-mobile';
import * as Styled from './Styled'
import md5 from 'blueimp-md5'
// import {connect} from 'react-redux'
class MobileValidate extends React.Component { 
    state = {
        telNo: '',
        leftSeconds: 0
    }
    changeTelNo = telNo => {
       this.setState({
          telNo
       })
    }
    clickSend = () => {
        if (this.state.telNo.replace(/\s*/g, '').length !== 11) {
            Toast.show('请输入正确的手机号')
            return
        }
        this.setState({
            leftSeconds: 60
        })
        this.timer = setInterval(() => {
            this.setState((preState) => {
                if (preState.leftSeconds === 0) {
                  clearInterval(this.timer)
                  return {}
                }
                return {
                    leftSeconds: preState.leftSeconds - 1
                }
             }
            )
        }, 1000)
        this.props.sendTelCode && this.props.sendTelCode(this.state.telNo)
    }
    render() {
        const {telNo,leftSeconds} = this.state
        let codeText = leftSeconds > 0 ? `重新发送(${leftSeconds}s)` : '发送验证码'
        return (
            <div>
              <InputItem className='login-input' placeholder="手机号" type="phone" value={telNo} onChange={this.changeTelNo}/>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <InputItem className='login-input' placeholder="验证码" /><Styled.TelCodeBtn onClick={this.clickSend} disabled={leftSeconds > 0}>{codeText}</Styled.TelCodeBtn>
              </div>
            </div>
        )
    }
  
}
class Login extends React.Component {
    state = {
        account: '',
        pwd: '',
        showPwdInput: false,
        showValidateCode: true,
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
    // 点击发送验证码
    sendTelCode = (tel) => {
        console.log('发送验证码到手机', tel)
    }
    validateTelCode = () => {
        // 验证code
        console.log('获取服务器正确验证码 对比')
        console.log('正确则跳转')
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
                      <MobileValidate sendTelCode={this.sendTelCode}/>
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