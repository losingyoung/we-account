import Styled from 'styled-components'

export const SwitchContainer = Styled.div`
display:flex;
`

const buttonWidth = "60px"
const buttonHeight = "30px"
export const LeftButton = Styled.span`
    text-align:center;
    display:inline-block;
    line-height:${buttonHeight};
    height:${buttonHeight};
    width:${buttonWidth};
    border-radius: 30px 0 0 30px;
    background-color: ${props => props.active ? props.activeColor : props.closeColor};
    color: #fff;
`
export const RightButton = Styled.span`
    text-align:center;
    display:inline-block;
    line-height:${buttonHeight};
    height:${buttonHeight};
    width:${buttonWidth};
    border-radius: 0 30px 30px 0;
    background-color: ${props => props.active ? props.activeColor : props.closeColor};
    color: #fff;
`