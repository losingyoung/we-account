import Styled from 'styled-components'

const Blue = "#108ee9"
export const LoginWrapper = Styled.div`
height:100%;
width:100%;
background:#b0eaef;
position:relative;
`

export const LoginContainer = Styled.div`
position: absolute;
left:50%;
top:50%;
min-width:80%;
transform: translate(-50%,-50%);
background:#fff;
border-radius:5px;
padding:15px 10px 15px 10px;
`

export const InputTable = Styled.div`

`


export const LoginText = Styled.div`
display:flex;
justify-content:space-between;
 >div{
   padding:15px;
 }
`
export const LoginTip = Styled.div`
width:100%;
text-align:center;
margin-top:10px;
color:#bbb;
`

export const LoginButton= Styled.div`
  width:calc(100% - 30px);
  margin:0 15px;
  border-radius:5px;
  margin-top:10px;
  height: 45px;
  background:#ddd;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:18px;
`
export const TelCodeBtn =Styled.div`
  padding:5px;
  background: ${props => props.disabled ? '#fff' : Blue};
  color: ${props => props.disabled ? '#666' : "#fff"};
  border: ${props => props.disabled ? '#ddd' : Blue};
  word-break: keep-all;
  border-radius: 5px;
`