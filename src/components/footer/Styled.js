import Styled from 'styled-components'

const buttonSize = '70px'
const Blue = "#108ee9"
export const Container = Styled.div`
position: fixed;
bottom: 0;
width:100%;
height:60px;
display:flex;
background-color:#fff;
padding:5px;
`
export const TabItem = Styled.div`
flex:1;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
color:${props => props.active ? Blue : "#b0b0b0"};
`
export const PlaceholderButton = Styled.div`
width:${buttonSize};
height:${buttonSize};
`
export const AddButton = Styled.div`
border-radius:100%;
background:${props => props.active ? "#fff" : Blue};
position:fixed;
bottom:0;
width:${buttonSize} 
height:${buttonSize};
left:50%;
transform: translateX(-50%);
color:${props => props.active ? Blue : "#fff"};
>svg{
    border-radius:50%;
    width:100% !important;
    height:100%;
}
`
// export const AddButton = Styled.div`
// border-radius:100%;
// background:#108ee9;
// position:fixed;
// bottom:0;
// width:${buttonSize};
// height:${buttonSize};
// left:50%;
// transform: translateX(-50%);
// `

export const TabIcon = Styled.i`
font-size:30px;
`

export const TabTitle = Styled.span`
font-size:16px;
`
