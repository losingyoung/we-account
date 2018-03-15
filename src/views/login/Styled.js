import Styled from 'styled-components'

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
padding:0.4rem 0.2rem 0.1rem 0.2rem;
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
margin-top:0.2667rem;
color:#bbb;
`

export const LoginButton= Styled.div`
  width:calc(100% - 30px);
  margin:0 15px;
  border-radius:5px;
  margin-top:0.2667rem;
  height: 1.2rem;
  background:#ddd;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:18px;
`
