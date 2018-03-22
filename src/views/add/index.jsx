import React from 'react'
import { DatePicker, Picker, List, NavBar, WhiteSpace, InputItem, TextareaItem } from 'antd-mobile';
import './index.css'
import SwitchButton from '../../components/switch-button'
import ICONS from './icon'
import Styled from 'styled-components'
import * as Service from '../../service'
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
const Blue = "#108ee9"
const screenWidth = document.documentElement && document.documentElement.clientWidth || window.innerWidth
const oneLineCount = screenWidth >= 375 ? 7 : 5
const iconWidth = (screenWidth - 14) / oneLineCount - 20
const CategoryArea = Styled.div`
background:#fff;
min-height:44px;
display:flex;
flex-wrap:wrap;
padding:0 7px;

  .cate-item-wrapper{
      padding:9px;
      border:solid #fff 1px;
      border-radius:5px;
      position:relative;
      &.active{
          border-color:black;
          box-shadow: 0px 0px 5px inset;
          color: ${Blue};
      }
      .del-icon{
          position:absolute;
          top:-5px;
          right:-10px;
          height:10px;
      }
      img,svg {
            width:${iconWidth}px;
      }
      svg{
            color: ${Blue};
            height:100%;
      }
  }

`

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
            inOutData: {
                left: {
                    value: 'income',
                    label: '收入'
                },
                right: {
                    value: 'spending',
                    label: '支出'
                }
            },
            inOutType: 'income',
            categoryInfo: [],
            activeCate: null,
            editIconMode: false
        }
    }
    async componentWillMount() {
        this._isMounted = true
        let userInfo = (this.props.location.state && this.props.location.state.userInfo) || {}
        let groupInfos = (this.props.location.state && this.props.location.state.groupInfos) || {}
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
        let curForValue = userInfo.wa_code
        let type = TYPE.PERSONAL
        if (this.props.location.state && this.props.location.state.curFor && this.props.location.state.curFor.value) {
            curForValue = this.props.location.state.curFor.value
            type = this.props.location.state.curFor.type
        }
        let cateIcons;
        if (type === TYPE.PERSONAL) {
            cateIcons = await Service.getPersonalIcons({ wa_code: curForValue })
        } else {
            cateIcons = await Service.getGroupIcons({ group_id: curForValue })
        }
        console.log('cc', cateIcons)
        this.setState({
            curForValue,
            ownerSelectData,
            userInfo: user,
            categoryInfo: cateIcons.data
        })
    }
    componentWillUnmount(a) {
        this._isMounted = false
    }
    goBack() {
        // console.log('back')
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
        this.setState({ curForValue, memberData, memberValue: [] })
    }
    // 更改日期
    changeDate = (value) => {
        this.setState({ dateValue: value })
    }
    //更改人员
    changeMemberValue = (value) => {
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
    // category
    clickCategory = (cateId) => {
        if (this.editIconMode) {
            return false
        }
        this.setState({
            activeCate: cateId
        })
    }
    changeToEditMode = () => {
        console.log('ccc')
        this.setState({
            editIconMode: true
        })
    }
    //delete cate icon
    DelIcon = (cate_id) => {
        console.log('del')
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
    getUserPciker(props) {
        if (!props.userInfo) {
            return null
        }
        return (
            <Picker
                cascade={false}
                data={[[props.userInfo]]}
                value={[props.curForValue]}
                disabled={true}
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
        // console.log('switch', this.switchInOutType, state.inOutType)
        return (
            <div className="add-wrapper">
                <NavBar mode="dark" icon={leftIcon} onLeftClick={this.goBack}>
                    {this.getOwnerPicker(ownerData)}
                </NavBar>
                <WhiteSpace size='xs' />
                <DatePicker mode="date" value={state.dateValue} onOk={this.changeDate}>
                    <List.Item arrow="horizontal">日期</List.Item>
                </DatePicker>
                <WhiteSpace size='xs' />
                {memberData ? this.getGroupUserPciker({ ...state, memberData: memberData.members.map(member => { return Object.assign({}, member, { value: member.wa_code, label: member.name }) }), changeMemberValue: this.changeMemberValue }) : this.getUserPciker(state)}
                <WhiteSpace size='xs' />
                <List key='price'>
                    <InputItem
                        type={"number"}
                        placeholder="元"
                        clear
                        onChange={(v) => { console.log('onChange', v); }}
                        onBlur={(v) => { console.log('onBlur', v); }}
                        className="switch-input"
                    ><SwitchButton data={state.inOutData} onSwitch={this.switchInOutType} value={state.inOutType}></SwitchButton>
                    </InputItem>
                </List>
                <WhiteSpace size='xs' />
                <CategoryArea>
                    {state.categoryInfo.map(cate => {
                        return (
                            <div key={cate.id} className={`cate-item-wrapper ${!state.editIconMode && cate.id === state.activeCate ? "active" : ""}`} onClick={() => { this.clickCategory(cate.id) }}>
                                <img src={ICONS[cate.type]} alt={cate.title} />
                                <div>{cate.title}</div>
                               {state.editIconMode && (<span className="del-icon" onClick={() => {this.DelIcon(cate.id)}}><i className="fa fa-trash-alt" /></span>)} 
                            </div>
                        )
                    })}
                    {state.editIconMode ? <span className='cate-item-wrapper' key="add"><i className='fa fa-plus-circle'></i></span> : <span className='cate-item-wrapper' onClick={this.changeToEditMode} key="setting"><i className='fa fa-cog'></i></span>}
                </CategoryArea>
                <WhiteSpace size='xs' />
                <List >
                    <TextareaItem
                        // title="高度自适应"
                        autoHeight
                        placeholder="描述一下..."
                        key='description'
                        className="add-description"
                    />
                </List>
                <WhiteSpace size='xs' />


            </div>
        )
    }
}
export default Add