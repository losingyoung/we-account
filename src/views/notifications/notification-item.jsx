import React from 'react'
import Styled from 'styled-components'
import {Button} from 'antd-mobile'
const ItemContainer = Styled.div`

width:100%;
padding:10px 0;
padding-left:15px;
background:#fff;
margin-top:10px;
position:relative;
`

const MainBody = Styled.div`
display:flex;
align-items:center;
justify-content:space-between;
`

const MessageContainer = Styled.div`
display:flex;
flex-direction: column;
align-items:flex-start;
text-align:left;
`
const DateBar = Styled.div`
margin-bottom:5px;
color:#999;
`
const Description = Styled.div`
color: #000;
font-size:14px;
`
const MessageItem = Styled.div`
color: #999;
`
const Message = Styled.span`
color: #000;
`
const ButtonGroup = Styled.div`
display:flex;
min-width:135px;
align-items:center;
.am-button:nth-child(1){
    margin-right:5px;
}
.am-button:nth-child(2){
    margin-right:15px;
}
`
class Item extends React.Component {
    render() {
        const {date, description, message, request} = this.props
        console.log(this.props)
        return (
            <ItemContainer>
                {/* <DateBar></DateBar> */}
                <MainBody>
                    <MessageContainer>
                        <DateBar>{date}</DateBar>
                        <Description>{description}</Description>
                        <MessageItem>留言:&nbsp;<Message>{message}</Message></MessageItem>
                    </MessageContainer>
                    {request && <ButtonGroup>
                        <Button type="primary" size="small">同意</Button>
                        <Button type="ghost" size="small">拒绝</Button>
                    </ButtonGroup>}
                </MainBody>
            </ItemContainer>
        )
    }
}
export default Item