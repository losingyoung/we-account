import React from 'react'
import { connect } from "react-redux";
import { setGroupPreference } from "../../store/actions/groupPreference";
import {
    NavBar,
    Picker
} from 'antd-mobile';
import Title from './children/title'
import TYPE from '../../constants/constants'

class DashBoard extends React.Component {
    state = {
        ownerSelectData: null
    }
    componentWillReceiveProps() {
        this.getOwnerPickerData()
    }
    componentDidMount() {
        this.getOwnerPickerData()
    }
    getOwnerPickerData() {
        let userInfo = this.props.userInfo
        if (!userInfo) {
            return
        }
        let curForValue = userInfo.wa_code
        let type = TYPE.PERSONAL
        if (this.props.curFor && this.props.curFor.value) {
            curForValue = this.props.curFor.value
            type = this.props.curFor.type
        } else {
            this.props.onChangeCurFor({
                value:curForValue,
                type
            })
        }
        let groupInfo = this.props.groupInfo || []
        let user = {
            value: userInfo.wa_code,
            label: userInfo.name,
            type: TYPE.PERSONAL,
            ...userInfo
        }
        let ownerSelectData = [
            [user].concat(groupInfo.map(group => {
                return {
                    value: group.group_id,
                    label: group.groupName,
                    type: TYPE.GROUP,
                    ...group
                }
            }))
        ]
        this.setState({ownerSelectData})
    }
    setOwnerPickerData = ([curForValue]) => {
        let memberData = null
        this
            .state
            .ownerSelectData[0]
            .some(owner => {
                if (owner.value === curForValue) {
                    if (owner.type === TYPE.GROUP) {
                        memberData = owner
                    }
                    return true
                }
                return false
            })
        let type = memberData ? TYPE.GROUP : TYPE.PERSONAL
        this.props.onChangeCurFor({
            value:curForValue,
            type
        })
    }
    getOwnerPicker(ownerSelectData) {
        if (ownerSelectData) {
            return (
                <Picker cascade={false} data={ownerSelectData} onOk={this.setOwnerPickerData}
                     value={this.props.curFor && this.props.curFor.value ? [this.props.curFor.value] : []}>
                    <Title>
                        <span className='fa fa-angle-down'></span>
                    </Title>
                </Picker>
            )
        } else {
            return (
                <Title>
                    <span>加载中...</span>
                </Title>
            )
        }
    }
    render() {
        const {ownerSelectData} = this.state
        return (
            <div>
                <NavBar mode="dark" >
                    {this.getOwnerPicker(ownerSelectData)}
                </NavBar>
                
                最近添加项目

                统计
                总支出
                距预算
                日均

                每一项支出／每天支出

            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        curFor: state.groupPreference,
        userInfo: state.userInfo,
        groupInfo: state.groupInfo
    }
}
const mapDispatchToProps = dispatch => {
    return {
       onChangeCurFor(curFor) {
         dispatch(setGroupPreference(curFor))
       } 
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashBoard)