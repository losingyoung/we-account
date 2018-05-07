import React from 'react'
import {signUp} from '../../service'
import InputItem from "antd-mobile/lib/input-item";
import Toast from 'antd-mobile/lib/toast';
import * as Styled from './Styled'

class Login extends React.Component {
    Login() {
        signUp().then(res => {
            console.log(res)
        })
        this
            .props
            .history
            .push('/index')
    }
    forgetPassword() {
        Toast.info('正在紧张建设中-.-', 1.5)
    }
    goDirectly() {
        Toast.info('正在紧张建设中-.-', 1.5)
    }
    // upload = () => {
    //     var fileObj = document
    //         .getElementById("FileUpload")
    //         .files[0]; // js 获取文件对象
    //     if (typeof(fileObj) == "undefined" || fileObj.size <= 0) {
    //         alert("请选择图片");
    //         return;
    //     }
    //     var formFile = new FormData(fileObj);
    //     formFile.append("action", "UploadVMKImagePath");
    //     formFile.append("uploadFile", fileObj); //加入文件对象
    //     formFile.append("file", '1');
    //     // debugger
    //     var data = formFile;
    //     uploadFile(data)
    //     console.log('upload', formFile)
    // }
    render() {
        return (
            <Styled.LoginWrapper>
                {/* <form ref={el => this.formEl = el}>
                  <input type="file" name="file" id="FileUpload"/>
                </form>
                
                <button id="btn_uploadimg" onClick={this.upload}>click</button> */}
                <Styled.LoginContainer>
                    <InputItem className='login-input' placeholder="账号"/>
                    <InputItem type='password' className='login-input' placeholder="密码"/>
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

export default Login