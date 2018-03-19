import Styled from 'styled-components'

const buttonSize = '70px'

export const Container = Styled.div`
position: fixed;
bottom: 0;
width:100%;
height:60px;
display:flex;
background-color:#ddd;
padding:5px;
`
export const TabItem = Styled.div`
flex:1;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
color:${props => props.active ? "#108ee9" : "#fff"};
`
export const PlaceholderButton = Styled.div`
width:${buttonSize};
height:${buttonSize};
`
export const AddButton = Styled.div`
border-radius:100%;
background:#108ee9;
position:fixed;
bottom:0;
width:${buttonSize};
height:${buttonSize};
left:50%;
transform: translateX(-50%);
`

export const TabIcon = Styled.i`
font-size:30px;
`

export const TabTitle = Styled.span`
font-size:16px;
`
