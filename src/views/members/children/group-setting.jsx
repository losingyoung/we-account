import React from 'react'
import {
    NavBar,
    Icon,
    Button,
    WingBlank,
    WhiteSpace,
    Flex,
    Modal,
    InputItem,
    Toast
} from 'antd-mobile'
import Styled from 'styled-components'

const BudgetWrapper = Styled.div `
.create-group-input{
    margin: 0 15px;
}
`
class GroupSetting extends React.Component {
    state = {
        title: this.props.title || '组', //新建/编辑组
        avatarFile: [],
        multiple: false,
        budget: (this.props.curGroupInfo && this.props.curGroupInfo.budget) || '',
        groupName: (this.props.curGroupInfo && this.props.curGroupInfo.groupName) || '',
        members: this.props.members || []
    }
    endEdit = false
    shouldComponentUpdate() {
        if (this.endEdit) {
            return false
        }
        return true
    }
    // onChangeGroupAvatar = (avatarFile, type, index) => {
    //     this.setState({avatarFile});
    // }
    goBack = () => {
        this
            .props
            .history
            .go(-1)
    }
    changeGroupName = (val) => {
        this.setState({groupName: val})
    }
    changeBudget = (val) => {
        this.setState({budget: val})
    }
    changeMembers = (members) => {
        this.setState({members})
    }
    //  完成添加组
    finishCreateGroup = () => {
        const {groupName, members, avatarFile, budget} = this.state
        const avatar = avatarFile.length > 0
            ? avatarFile[0]
            : ''
        let budgetNum = parseFloat(budget, 10) || 0
        const group_id = this.props.curGroupInfo && this.props.curGroupInfo.group_id
        if (!groupName) {
            Modal.alert('', '请输入组名称')
        }
        
        this
            .props
            .finishEdit({groupName, avatar, members, budget: budgetNum, group_id})
            .then(() => {
                this.endEdit = true
                Toast.success('保存成功', 1.5, () => {
                    // this.goBack()
                    this.props.goBackAfterFinish && this.goBack()
                })
            }, (msg) => {
                Modal.alert('', msg)
            })
    }
    render() {
        let leftIcon = <Icon type="left"/>
        const {groupName, members, budget, title} = this.state;
        return (
            <div className="create-new-group">
                <NavBar icon={leftIcon} onLeftClick={this.goBack}>
                    <span>{title}</span>
                </NavBar>

                {/* <WhiteSpace/>
                <WingBlank className="align-left">选择头像</WingBlank>
                <ImagePicker
                    files={avatarFile}
                    onChange={this.onChangeGroupAvatar}
                    selectable={avatarFile.length < 1}/> */}

                <WingBlank className="align-left">人员</WingBlank>
                <Members onChange={this.changeMembers} members={members}></Members>
                <WingBlank className="align-left">名称</WingBlank>
                <WhiteSpace/>
                <BudgetWrapper>
                    <InputItem
                        onChange={this.changeGroupName}
                        value={groupName}
                        className="create-group-input"></InputItem>
                </BudgetWrapper>
                <WhiteSpace/>
                <WingBlank className="align-left">预算</WingBlank>
                <WhiteSpace/> {/* <AntList key='budget'> */}
                <BudgetWrapper>
                    <InputItem type={"number"} // placeholder="元"
                        clear onChange={this.changeBudget} className="create-group-input" value={budget}>
                        {/* 预算 */}
                    </InputItem>
                </BudgetWrapper>
                <WhiteSpace/> {/* </AntList> */}
                <WhiteSpace size="lg"/>
                <WingBlank>
                    <Button type="primary" onClick={this.finishCreateGroup}>完成</Button>
                </WingBlank>
            </div>
        )
    }
}
class Members extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false
        }
    }
    removeMember = (index) => {
        const newMembers = []
        this
            .props
            .members
            .forEach((member, idx) => {
                if (idx !== index) {
                    newMembers.push(member)
                }
            })
        if (this.props.onChange) {
            this
                .props
                .onChange(newMembers, "remove", index)
        }
    }
    clickAddNew = () => {
        this.setState({showModal: true})
    }
    addNewMember = (member) => {
        const newMembers = this
            .props
            .members
            .concat(member)
        if (this.props.onChange) {
            this
                .props
                .onChange(newMembers, "add")
        }
    }
    onCloseMadal = () => {
        this.setState({showModal: false})
    }
    render() {
        const {members} = this.props
        const {showModal} = this.state
        const addedMemberEl = members.map((member, idx) => {
            return (
                <Flex.Item key={idx}>
                    <div className="am-image-picker-item">
                        <div
                            className="am-image-picker-item-remove"
                            onClick={() => {
                            this.removeMember(idx)
                        }}></div>
                        <div
                            className="am-image-picker-item-content"
                            style={{
                            "backgroundImage": `url(${member.avatar})`
                        }}></div>
                    </div>
                    <div className="added-member-name">
                        <span>{member.name}</span>
                    </div>
                </Flex.Item>
            )
        })
        const addMemberIcon = (
            <Flex.Item key="addMember">
                <div
                    className="am-image-picker-item am-image-picker-upload-btn"
                    onClick={this.clickAddNew}></div>
            </Flex.Item>
        )
        let allMemberEl = addedMemberEl.concat([addMemberIcon])
        const memberLen = allMemberEl.length
        if (memberLen % 4 !== 0) {
            const blankCount = 4 - memberLen % 4
            for (let i = 0; i < blankCount; i++) {
                allMemberEl.push(<Flex.Item key={`blank-${i}`}/>)
            }
        }
        const flexMemberRow = []
        for (let i = 0; i < allMemberEl.length / 4; i++) {
            const rowEl = allMemberEl.slice(i * 4, i * 4 + 4)
            flexMemberRow.push(rowEl)
        }
        const renderMemberEl = flexMemberRow.map((item, idx) => {
            return (
                <Flex key={`flex-${idx}`}>{item}</Flex>
            )
        })
        return (
            <div className="am-image-picker-list">
                {renderMemberEl}
                <Modal
                    visible={showModal}
                    transparent={true}
                    maskTransitionName={"bounce"}
                    style={{
                    width: "90%"
                }}
                    maskClosable={true}
                    onClose={this.onCloseMadal}>
                    <SearchMember onClose={this.onCloseMadal} onAddMember={this.addNewMember}></SearchMember>
                </Modal>
            </div>
        )
    }
}
const SearchMemberBar = Styled.div `
display:flex;
.am-button{
    flex-grow:1;
}
`
const AvatarContainer = Styled.div `
  height:60px;
  width:60px;
  margin-right:5px;
  img{
      width:100%;
  }
`
const ReasultItem = Styled.div `
display:flex;
justify-content:space-between;
align-items:center;
padding:8px;
margin-top:10px;
background:#d0d0d0;
color:#fff;
border-radius:3px;
.am-button{
    flex: 0 1 100px;
}
`
class SearchMember extends React.Component {
    state = {
        searched: false,
        searchWord: '',
        searchResult: null
    }
    handleKeyDownInput = (e) => {
        if (e.keyCode === 13) {
            this.setState({
                searched: true,
                searchResult: {
                    wa_code: 888,
                    name: 'member2',
                    gender: "0",
                    avatar: "http://ourrovucw.bkt.clouddn.com/avatar_girl.jpg"
                }
            })
        }
    }
    changeInput = (val) => {
        console.log(val)
        this.setState({searched: false, searchWord: val, searchResult: null})
    }
    inviteNewMember = () => {
        this.props.onAddMember && this
            .props
            .onAddMember(this.state.searchResult)
        this.props.onClose && this
            .props
            .onClose()
    }
    close = () => {
        this.props.onClose && this
            .props
            .onClose()
    }
    render() {
        const {searchResult, searchWord, searched} = this.state
        const displayContent = searchResult
            ? (
                <ReasultItem>
                    <AvatarContainer>
                        <img src={searchResult.avatar} alt="avatar"/>
                    </AvatarContainer>
                    <span>{searchResult.name}</span>
                    <Button onClick={this.inviteNewMember}>邀请加入</Button>
                </ReasultItem>
            )
            : (searched
                ? <div>无结果</div>
                : '')
        return (
            <div>
                <SearchMemberBar>
                    <InputItem
                        placeholder="输入we记号"
                        onChange={this.changeInput}
                        value={searchWord}
                        onKeyDown={this.handleKeyDownInput}></InputItem>
                    <Button type="primary" onClick={this.close}>取消</Button>
                </SearchMemberBar>
                {displayContent}
            </div>
        )
    }
}
export default GroupSetting