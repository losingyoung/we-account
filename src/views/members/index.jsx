import React from 'react'
import {NavBar, WhiteSpace} from 'antd-mobile'
import GroupItem from './group-item'
import Styled from 'styled-components'
import PropTypes from 'prop-types';

const ItemsContainer = Styled.div`
  padding:15px 10px;
`

const BtnWrapper = Styled.span`
      height:30px;
  svg{
      width:30px !important;
      height:30px;
  }
`
const SearchInput = Styled.input`
  outline:none;
  height:30px;
  border:1px solid #eee;
  border-radius:5px;
  margin: 0 5px;
  text-indent:5px;
  background: ${props => props.focus ? "#fff" : "transparent"};
  &::-webkit-input-placeholder{
      color:#eee;
      font-size:16px;
  }
`

class Members extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
            groupInfos: null
        }
    }
    componentWillMount() {
        this._isMounted = true
        // ***********以后放到redux 集中管理***************
        let userInfo = (this.props.location.state && this.props.location.state.userInfo) || {}
        let groupInfos = (this.props.location.state && this.props.location.state.groupInfos) || {}
        if (!this._isMounted) {
            return
        }
        this.setState({
            userInfo,
            groupInfos
        })
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    render() {
        let {userInfo, groupInfos} = this.state
        return (
            <div>
                <NavBar mode="dark" >
                 <BtnWrapper><i className="fa fa-search"/></BtnWrapper>
                   <SearchInput placeholder="搜索组" />
                 <BtnWrapper><i className="fa fa-plus-circle"/></BtnWrapper>
                </NavBar>
                <ItemsContainer>
                    {groupInfos.map(group => {
                        let {members, ...groupInfo} = group
                        return (
                            <GroupItem key={groupInfo.id} groupInfo={groupInfo} memberInfo={members} userInfo={userInfo}>  
                            </GroupItem>
                        )
                    })}
                </ItemsContainer>                
            </div>
        )
    }
}
Members.propTypes = {
    // userInfo: 
}
export default Members