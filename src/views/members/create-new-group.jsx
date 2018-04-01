import React from 'react'
import { NavBar, Icon, Button, ImagePicker, WingBlank, WhiteSpace, Flex, Modal } from 'antd-mobile'

class CreateNewGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            multiple: false,
            addedMembers: [{
                wa_code: 333,
                name: 'member1',
                gender: "0",
                avatar: "http://ourrovucw.bkt.clouddn.com/avatar_girl.jpg"
            }]
        }
    }
    onChange = (files, type, index) => {
        this.setState({
            files,
        });
    }
    goBack = () => {
        this.props.history.go(-1)
    }
    changeMembers = (members) => {
      this.setState({
          addedMembers: members
      })
    }
    render() {
        let leftIcon = <Icon type="left" />
        const { files, addedMembers } = this.state;
        return (
            <div >
                <NavBar icon={leftIcon} onLeftClick={this.goBack}>
                    <span>新建组</span>
                </NavBar>
                <WhiteSpace />
                <WingBlank className="align-left">选择头像</WingBlank>
                <ImagePicker
                    files={files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={files.length < 1}
                />
                <WingBlank className="align-left">人员</WingBlank>
                  <Members onChange={this.changeMembers} members={addedMembers}></Members>
                <WingBlank className="align-left">预算</WingBlank>

                <WingBlank><Button type="primary">完成</Button></WingBlank>
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
        this.props.members.forEach((member, idx) => {
            if (idx !== index) {
                newMembers.push(member)
            }
        })
        if (this.props.onChange) {
            this.props.onChange(newMembers, "remove", index)
        }
    }
    clickAddNew = () => {
      this.setState({
          showModal: true
      })
    }
    addNewMember = () => {
        const newMembers = this.props.members.concat({
            wa_code: 333,
            name: 'member1',
            gender: "0",
            avatar: "http://ourrovucw.bkt.clouddn.com/avatar_girl.jpg"
        })

        if (this.props.onChange) {
            this.props.onChange(newMembers, "add")
        }
    }
    onCloseMadal = () => {
      this.setState({
        showModal: false
      })
    }
    render() {
        const { members } = this.props
        const { showModal} = this.state
        const addedMemberEl = members.map((member, idx) => {
            return (
                <Flex.Item key={idx}>
                    <div className="am-image-picker-item">
                        <div className="am-image-picker-item-remove" onClick={() => { this.removeMember(idx) }}></div>
                        <div className="am-image-picker-item-content" style={{ "backgroundImage": `url(${member.avatar})` }}></div>
                    </div>
                    <div className="added-member-name"><span>{member.name}</span></div>
                </Flex.Item>
            )
        })
        const addMemberIcon = (
            <Flex.Item key="addMember">
                <div className="am-image-picker-item am-image-picker-upload-btn" onClick={this.clickAddNew}></div>
            </Flex.Item>
        )
        let allMemberEl = addedMemberEl.concat([addMemberIcon])
        const memberLen = allMemberEl.length
        if (memberLen % 4 !== 0) {
            const blankCount = 4 - memberLen % 4
            for (let i = 0; i < blankCount; i++) {
                allMemberEl.push(<Flex.Item key={`blank-${i}`} />)
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
                <Modal visible={showModal}
                    transparent={true}
                    maskTransitionName={"bounce"}
                    style={{
                        width: "80%"
                    }}
                    maskClosable={true}
                    onClose={this.onCloseMadal}>
                  <div>shuru</div>    
                </Modal>
            </div>
        )
    }
}
export default CreateNewGroup