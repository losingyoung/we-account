import React from 'react'
import {DatePicker, Picker, List, NavBar, WhiteSpace, InputItem} from 'antd-mobile';
import './index.css'
import SwitchButton from '../../components/switch-button'
function Title(props) {
    return (
        <div
            onClick={props.onClick}
            style={{
            padding: "5px 15px",
            display: "flex",
            "alignItems": "center"
        }}>
            <div style={{
                "marginRight": "5px"
            }}>{props.extra}</div>
            {props.children}
        </div>
    )
}
const TYPE = {
    PERSONAL: "0",
    GROUP: "1"
}
/* <div style={{ display: 'flex'}}>
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}></div>
             <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</div>
          </div> */
class Add extends React.Component {
    constructor(props) {
        super(props)
        this.goBack = this
            .goBack
            .bind(this)
        this.state = {
            ownerSelectData: null, // dataset 可以选个人还是某个组
            memberData: null,  // 所有组员信息
            curForValue: null, // 个人或某个组
            dateValue: '',
            userInfo: null,
            memberValue: null, //属于某个组员的
            inOutType: 'on'
        }
    }
    componentWillMount() {
        this._isMounted = true
        let userInfo  = (this.props.location.state && this.props.location.state.userInfo) || {}
        let groupInfos = (this.props.location.state && this.props.location.state.groupInfos) || {}
        // setTimeout(() => {
            if (!this._isMounted) {
                return
            }
            let user = 
                {
                    value: userInfo.wa_code,
                    label: userInfo.name,
                    type: TYPE.PERSONAL,
                    ...userInfo
                }
            
            let ownerSelectData = [[user].concat(groupInfos.map(group => {
                    return {
                        value: group.id,
                        label: group.name,
                        type: TYPE.GROUP,
                        ...group
                    }
                }))]
            let curForValue = (this.props.location.state && this.props.location.state.curFor && this.props.location.state && this.props.location.state.curFor.value) || userInfo.wa_code
            this.setState({
                curForValue, 
                ownerSelectData,
                userInfo: user
            })
        // }, 500)
    }
    componentWillUnmount(a) {
        this._isMounted = false
    }
    goBack() {
        console.log('back')
    }
    // 为谁加
    setOwnerPickerData = ([curForValue]) => {
        let memberData = null
        this.state.ownerSelectData[0].some(owner => {
            if (owner.value === curForValue) {
                if (owner.type === TYPE.GROUP) {
                    memberData = owner
                }
                return true
            }
            return false
        })
        console.log(this.props)
        // this.props.changeOwnerPreference({value: curForValue, type: memberData ? TYPE.GROUP : TYPE.PERSONAL})
        this.setState({curForValue, memberData, memberValue: []})
    }
    // 更改日期
    changeDate = (value) => {
        this.setState({dateValue: value})
    }
    //更改人员
    changeMemberValue = (value) => {
        console.log('change mem', value)
        this.setState({
            memberValue: value
        })
    }
    // 收入 支出
    switchInOutType = (value) => {
        this.setState({
            inOutType: value
        })
    }
    getOwnerPicker(ownerData) {
        if (ownerData) {
            return (
                <Picker
                    cascade={false}
                    data={ownerData}
                    onOk={this.setOwnerPickerData}
                    onDismiss={e => console.log('dismiss', e)}
                    value={[this.state.curForValue]}>
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
    getUserPciker (props) {
        if (!props.userInfo) {
            return null
        }
        return (
            <Picker
                cascade={false}
                data={[[props.userInfo]]}
                value={[props.curForValue]}
                disabled = {true}
            >
            <List.Item >人员</List.Item>
          </Picker>
        )
    }
    getGroupUserPciker(props) {
        // console.log(memberData)
        console.log(props)
        return (
            <Picker
                cascade={false}
                data={[props.memberData]}
                onOk={props.changeMemberValue}
                value={props.memberValue || []}
            >
              <List.Item arrow="horizontal">人员</List.Item>
            </Picker>
        )
    }
    render() {
        let state = this.state
        let leftIcon = '' // <Icon type="left" />
        let ownerData = state.ownerSelectData
        let memberData = state.memberData
        console.log('mem',memberData)
        console.log('state',state)
        return (
            <div>
                <NavBar mode="dark" icon={leftIcon} onLeftClick={this.goBack}>
                  {this.getOwnerPicker(ownerData)}
                </NavBar>
                <WhiteSpace size='xs' />
                <DatePicker mode="date" value={state.dateValue} onOk={this.changeDate}>
                    <List.Item arrow="horizontal">日期</List.Item>
                </DatePicker>
                <WhiteSpace size='xs' />
                {memberData ? this.getGroupUserPciker({...state, memberData: memberData.members.map(member => {return Object.assign({}, member, {value: member.wa_code, label: member.name})}), changeMemberValue: this.changeMemberValue}) : this.getUserPciker(state)}
                <WhiteSpace size='xs' />
                <List>
                <InputItem
                    type={"number"}
                    clear
                    onChange={(v) => { console.log('onChange', v); }}
                    onBlur={(v) => { console.log('onBlur', v); }}
                    className="switch-input"
                >
                <SwitchButton onSwitch={this.switchInOutType} value={state.inOutType}></SwitchButton>
                </InputItem>
                </List>
            </div>
        )
    }
}
export default Add