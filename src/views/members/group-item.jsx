import React from 'react'
import {Button, Modal} from 'antd-mobile'
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
    editGroupItem = (e) => {
        e.stopPropagation()
        // console.log(this.props)
       this.props.editGroup()
    }
    displayGroupInfo = () => {
        this.props.displayGroupInfo()
    }
    delGroupItem =(e) => {
        e.stopPropagation()
        Modal.alert("确认", "删除组将一起删除统计数据", [
            { text: '取消'},
            {
              text: '确认',
              onPress: () => {
                  //  发请求删除组 更新store 
              }
                
            }
          ])
    }
    render() {
        let {memberInfo, groupInfo, userInfo, type, clickApllyToJoin} = this.props
        return (
            <ListContainer onClick={this.displayGroupInfo}>
                <ImgMetaContainer>
                    <AvatarContainer>
                        <img src={groupInfo.avatar} alt="avatar"/>
                    </AvatarContainer>
                    <MetaContainer>
                        <MetaRow>主人: 
                            <MetaText>{groupInfo.ownerName}</MetaText>
                            <span><i className="fa fa-chess-queen"/></span>
                        </MetaRow>
                        {type !=="search" && (
                        <React.Fragment>
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
                        </React.Fragment>)}
                    </MetaContainer>
                </ImgMetaContainer>
                {/* 如果是owner */}
                {type !=="search" && userInfo.wa_code === groupInfo.owner_wa_code && <OperationContainer >
                    <OperationIconWrapper onClick={this.editGroupItem}>
                        <i className="fa fa-edit"></i>
                    </OperationIconWrapper>
                    <OperationIconWrapper onClick={this.delGroupItem}>
                        <i className="fa fa-trash-alt"></i>
                    </OperationIconWrapper>
                </OperationContainer>}
                {type ==="search" && (<OperationContainer>
                    <Button type="primary" onClick={clickApllyToJoin}><span style={{padding:"0 10px", "fontSize": "16px"}}>申请加入</span></Button>
                </OperationContainer>)}
            </ListContainer>
        )
    }
}

// class EditGroupItem extends React.Component {
//     render() {

//     }
// }

export default Item
