import Styled from 'styled-components'


export const InfoBox = Styled.div`
width:100%;
display:flex;
justify-content: space-between;
background:#108ee9;
padding:15px;
color:#fff;
align-items:center;
`

export const InfoWrapper = Styled.div`
display:flex;
`

export const AvatarWrapper = Styled.div`
width:60px;
height:60px;
margin-right:15px;

`
export const AvatarImg = Styled.img`
width:100%;
height:100%;
border-radius:3px;
`

export const Infos = Styled.div`
font-size:14px;
display:flex;
flex-direction:column;
justify-content:center;
align-items:flex-start;
    >span{
       margin-bottom:5px; 
    }
`
export const ArrowRightContainer = Styled.div`
  width:32px;
  text-align: right;
`
export const ArrowRight = Styled.i`
font-size:36px;
`