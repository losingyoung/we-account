import React from 'react'
// import {NavBar, WhiteSpace} from 'antd-mobile'
import Styled from 'styled-components'
const Blue = "#108ee9"

const ListContainer = Styled.div `
  background-color:#fff;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:10px 15px;
  margin-bottom:10px;
`
const ImgMetaContainer = Styled.div `
  display:flex;
  justify-content:flex-start;
  align-items:center;
`
const AvatarContainer = Styled.div `
  height:60px;
  width:60px;
  margin-right:5px;
  img{
      width:100%;
  }
`
const MetaContainer = Styled.div `
  text-align:left;
`
const MetaRow = Styled.div `
 padding:2px 0;
 color:#aaa;
`
const MetaText = Styled.span `
  color:#666;
`
const OperationContainer = Styled.div `
  display:flex;
  flex-direction: column;
  justify-content:space-around;
  align-items: flex-start;
  
`
const OperationIconWrapper = Styled.span `
padding:0 10px;
color:${Blue};
  svg{
      height:30px;
      width:18px !important;
  }
`
class Item extends React.Component {
    editGroupItem() {}
    delGroupItem() {}
    render() {
        let {memberInfo, groupInfo, userInfo} = this.props
        return (
            <ListContainer>
                <ImgMetaContainer>
                    <AvatarContainer>
                        <img src={groupInfo.avatar} alt="avatar"/>
                    </AvatarContainer>
                    <MetaContainer>
                        <MetaRow>主人: 
                            <MetaText>{groupInfo.ownerName}</MetaText>
                            <span><i className="fa fa-chess-queen"/></span>
                        </MetaRow>
                        <MetaRow>成员: 
                            <MetaText>{memberInfo
                                    .filter(val => !val.owner)
                                    .reduce((sum, cur, idx, arr) => {
                                        let trail = ', '
                                        if (idx === arr.length - 1) {
                                            trail = ''
                                        }
                                        return sum + cur.name + trail
                                    }, "")}</MetaText>
                        </MetaRow>
                        <MetaRow>收入 支出 预算
                        </MetaRow>
                    </MetaContainer>
                </ImgMetaContainer>
                {/* 如果是owner */}
                {userInfo.wa_code === groupInfo.owner_wa_code && <OperationContainer >
                    <OperationIconWrapper onClick={this.editGroupItem}>
                        <i className="fa fa-edit"></i>
                    </OperationIconWrapper>
                    <OperationIconWrapper onClick={this.delGroupItem}>
                        <i className="fa fa-trash-alt"></i>
                    </OperationIconWrapper>
                </OperationContainer>}
            </ListContainer>
        )
    }
}
export default Item
