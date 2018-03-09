import Styled from 'styled-components'

const buttonSize = '5rem'

export const Container = Styled.div`
position: fixed;
bottom: 0;
width:100%;
height:3rem;
display:flex;
`
export const TabItem = Styled.div`
flex:1;
`
export const PlaceholderButton = Styled.div`
width:${buttonSize};
height:${buttonSize};
`
export const AddButton = Styled.div`
border-radius:100%;
background:green;
position:fixed;
bottom:0;
width:${buttonSize};
height:${buttonSize};
left:50%;
transform: translateX(-50%);
`
// export const TabIcon = Styled.
