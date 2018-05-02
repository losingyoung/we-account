import React from 'react'
import {connect} from "react-redux";
import {setGroupPreference} from "../../store/actions/groupPreference";
import {setAccountItems} from "../../store/actions/accountItems";
import {NavBar, Picker} from 'antd-mobile';
import Title from './children/title'
import TYPE from '../../constants/constants'
import * as Service from "../../service";

class DashBoard extends React.Component {
    state = {
        ownerSelectData: null
    }
    componentWillReceiveProps(props) {
        console.log('rev',props)
        this.getOwnerPickerData()
    }
    componentDidMount() {
        console.log('did')
        this.getOwnerPickerData()
        this.getAccountItems()
    }
    getOwnerPickerData() {
        let {userInfo, groupInfo } = this.props
        if ( !userInfo || !groupInfo || this.state.ownerSelectData) {
            return
        }

        let curForValue = userInfo.wa_code
        let type = TYPE.PERSONAL
        if (this.props.curFor && this.props.curFor.value) {
            curForValue = this.props.curFor.value
            type = this.props.curFor.type
        }
        this.setOwnerPickerData([curForValue, type])

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
    setOwnerPickerData = ([curForValue, type]) => {
        if (typeof type === 'undefined') {
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
            type = memberData
                ? TYPE.GROUP
                : TYPE.PERSONAL
        }

        this
            .props
            .onChangeCurFor({value: curForValue, type})
        // this.setAccountItems({value: curForValue, type})
    }
    setAccountItems({type, value}) {
       if (!this.props.accountItems) {
           return null
       }
       let accountItems = type === TYPE.PERSONAL ? this.props.accountItems.personalAccountItems : this.props.accountItems.groupAccountItems
       let idKey = type === TYPE.PERSONAL ? 'wa_code' : 'group_id'
       return accountItems.filter(item => {
           return item[idKey] === value
       })
    }
    getAccountItems() {
        if (!this.props.accountItems) {
            Service.getAccountItem().then(res => {
                this.props.getAccountItemsFromServer(res.data)
                // console.log('ser', this.props.accountItems)
            })
        }

    }
    getOwnerPicker(ownerSelectData) {
        if (ownerSelectData) {
            return (
                <Picker
                    cascade={false}
                    data={ownerSelectData}
                    onOk={this.setOwnerPickerData}
                    value={this.props.curFor && this.props.curFor.value
                    ? [this.props.curFor.value]
                    : []}>
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
        
        let accounts = this.props.curFor && this.setAccountItems(this.props.curFor)
        let account = accounts && accounts[0]
        console.log('items', accounts && accounts[0])
        return (
            <div>
                <NavBar mode="dark">
                    {this.getOwnerPicker(ownerSelectData)}
                </NavBar>
                {account && <span>总支出 {account.totalCost} 距预算 最近添加项目 统计 日均 每一项支出／每天支出</span>}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {curFor: state.groupPreference, userInfo: state.userInfo, groupInfo: state.groupInfo, accountItems: state.accountItems}
}
const mapDispatchToProps = dispatch => {
    return {
        onChangeCurFor(curFor) {
            dispatch(setGroupPreference(curFor))
        },
        getAccountItemsFromServer(accountItems) {
            dispatch(setAccountItems(accountItems))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashBoard)