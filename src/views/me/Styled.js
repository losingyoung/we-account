import Styled from 'styled-components'

export const InfoBox = Styled.div `
width:100%;
display:flex;
justify-content: space-between;
background:#108ee9;
padding:15px;
color:#fff;
align-items:center;
`

export const InfoWrapper = Styled.div `
display:flex;
`

export const AvatarWrapper = Styled.div `
width:60px;
height:60px;
margin-right:15px;

`
export const AvatarImg = Styled.img `
width:100%;
height:100%;
border-radius:3px;
`
export const BigAvatarImgOverlay = Styled.div`
position:fixed;
top:0;
left:0;
height:100%;
width:100%;
z-index:110;
background:#000;
`
export const BigAvatarImg = Styled.img`
position:absolute;
top:50%;
left: 0;
transform: translate(0, -50%);
width:100%;

}
`
export const Infos = Styled.div `
font-size:14px;
display:flex;
flex-direction:column;
justify-content:center;
align-items:flex-start;
    >span{
       margin-bottom:5px; 
    }
`
export const ArrowRightContainer = Styled.div `
  width:32px;
  text-align: right;
`
export const ArrowRight = Styled.i `
font-size:36px;
`
export const ChangeAvatarContainer = Styled.div `
    position: relative;
    height: 60px;
`
export const ChangeAvatarImg = Styled.div `
    height: 100%;
    width: 60px;
    position: absolute;
    right: 0;
    background-image: ${props => "url(" + props.avatarImg + ")"};
    background-size: 100%;
  .avatar-input{
    opacity: 0;
    position: absolute;
    right: 0;
    height: 100%;
  }
`