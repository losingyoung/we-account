import React from 'react'
import {
    DatePicker,
    Picker,
    List,
    NavBar,
    WhiteSpace,
    InputItem,
    TextareaItem,
    Modal
} from 'antd-mobile';
import './index.css'
import SwitchButton from '../../components/switch-button'
import ICONS from './icon'
import Styled from 'styled-components'
import * as Service from '../../service'
// import * as Utils from '../../utils/tools'
const TYPE = {
    PERSONAL: "0",
    GROUP: "1"
}
const Blue = "#108ee9"
    
const CategoryArea = Styled.div `
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
        .edit-icon{
            position: absolute;
            bottom: 17px;
            right: 0;
            height:12px;
            svg{
                height:12px;
                width:12px;
            }
            
        }
        .del-icon{
            position:absolute;
            top:2px;
            right:-10px;
            height:12px;
        }
        img,svg {
            width:${props => props.iconWidth ? props.iconWidth : 30}px;
        }
        svg{
            color: ${Blue};
            height:100%;
        }
    }
`



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
// 弹出来的分类按钮编辑框
class IconEditBox extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            title: props.title || "",
            activeCate: props.activeCate,
            iconWidth: 0
        }
    }
    setActiveIcon = (type) => {
      this.setState({
        activeCate: type
      })
    }
    changeCateTitle = (e) => {
        e.preventDefault()
        this.setState({
            title: e.target.value
        })
    }
    confirmChange = () => {
      console.log('ok mode:', this.props.mode)
    }
    componentDidMount() {
        // const el = document.querySelector('.icon-edit-wrapper')
        const clientWidth = this.boxBody.clientWidth
        const oneLineCount = 5
        const iconWidth = (clientWidth - 14) / oneLineCount - 20
        this.setState({
            iconWidth
        })
    }
    render() {
        let {activeCate, title, iconWidth} = this.state
        
        return (
            <div className="icon-edit-wrapper" ref={el => this.boxBody = el}>
                <div className="title-container">
                  <input value={title} onChange={this.changeCateTitle} />
                </div>
                <div className="operation-buttons">
                    <span onClick={this.confirmChange}><i className='fa fa-check'/></span>
                    {/* <span><i className='fa fa-times-circle'/></span> */}
                </div>
                <div className="icons-container">
                <CategoryArea iconWidth={iconWidth}>
                        {Object.keys(ICONS)
                            .map(type => {
                                return (
                                    <div
                                        key={type}
                                        className={`cate-item-wrapper ${type === activeCate
                                        ? "active"
                                        : ""}`}
                                        onClick={() => {
                                        this.setActiveIcon(type)
                                    }}>
                                        <img src={ICONS[type]} alt={type}/>
                                    </div>
                                )
                            })}
                    </CategoryArea>
                </div>
            </div>
        )
    }

}


class Add extends React.Component {
    constructor(props) {
        super(props)
        this.goBack = this
            .goBack
            .bind(this)
        this.state = {
            ownerSelectData: null, // dataset 可以选个人还是某个组
            memberData: null, // 所有组员信息
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
            editIconMode: false,
            showIconEditModal: false
        }
    }
    async componentWillMount() {
        this._isMounted = true
        let userInfo = (this.props.location.state && this.props.location.state.userInfo) || {}
        let groupInfos = (this.props.location.state && this.props.location.state.groupInfos) || {}
        if (!this._isMounted) {
            return
        }
        let user = {
            value: userInfo.wa_code,
            label: userInfo.name,
            type: TYPE.PERSONAL,
            ...userInfo
        }

        let ownerSelectData = [
            [user].concat(groupInfos.map(group => {
                return {
                    value: group.id,
                    label: group.name,
                    type: TYPE.GROUP,
                    ...group
                }
            }))
        ]
        let curForValue = userInfo.wa_code
        let type = TYPE.PERSONAL
        if (this.props.location.state && this.props.location.state.curFor && this.props.location.state.curFor.value) {
            curForValue = this.props.location.state.curFor.value
            type = this.props.location.state.curFor.type
        }
        let cateIcons;
        if (type === TYPE.PERSONAL) {
            cateIcons = await Service.getPersonalIcons({wa_code: curForValue})
        } else {
            cateIcons = await Service.getGroupIcons({group_id: curForValue})
        }
        console.log('cc', cateIcons)
        this.setState({curForValue, ownerSelectData, userInfo: user, categoryInfo: cateIcons.data})
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
        console.log(this.props)
        // this.props.changeOwnerPreference({value: curForValue, type: memberData ?
        // TYPE.GROUP : TYPE.PERSONAL})
        this.setState({curForValue, memberData, memberValue: []})
    }
    // 更改日期
    changeDate = (value) => {
        this.setState({dateValue: value})
    }
    //更改人员
    changeMemberValue = (value) => {
        this.setState({memberValue: value})
    }
    // 收入 支出
    switchInOutType = (value) => {
        this.setState({inOutType: value})
    }
    // 点击某个类别
    clickCategory = (cate) => {
        if (this.state.editIconMode) {
            this.mode = 'update'
            this.setState({showIconEditModal: true, activeCate: cate})
            return false
        }
        this.setState({activeCate: cate})
    }
    // 开启编辑模式
    changeToEditMode = () => {
        this.setState({editIconMode: true, activeCate: null})
    }
    //delete cate icon
    DelIcon = (e, cate_id) => {
        console.log('del', e, cate_id)
        e.stopPropagation()
        alert('del')
       
    }
    // add cate icon
    handleAddCate = () => {
        this.mode = 'add'
        this.setState({showIconEditModal: true})
    }

    // 完成编辑按钮
    finishEditCateIcon = () => {
        this.setState({editIconMode: false})
    }
    onCloseEditCateIcon = () => {
        console.log('close mask')
        this.setState({showIconEditModal: false})
    }
    getOwnerPicker(ownerData) {
        if (ownerData) {
            return (
                <Picker cascade={false} data={ownerData} onOk={this.setOwnerPickerData}
                onDismiss={e => {console.log('dismiss', e)}} value={[this.state.curForValue]}>
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
                data={[
                [props.userInfo]
            ]}
                value={[props.curForValue]}
                disabled={true}>
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
                value={props.memberValue || []}>
                <List.Item arrow="horizontal">人员</List.Item>
            </Picker>
        )
    }
    render() {
        let state = this.state
        let leftIcon = '' // <Icon type="left" />
        let ownerData = state.ownerSelectData
        let memberData = state.memberData
        const Blue = "#108ee9"
        const screenWidth = (document.documentElement && document.documentElement.clientWidth) || window.innerWidth
        const oneLineCount = screenWidth >= 375
            ? 7
            : 5
        const iconWidth = (screenWidth - 14) / oneLineCount - 20

        return (
            <div className="add-wrapper">
                <NavBar mode="dark" icon={leftIcon} onLeftClick={this.goBack}>
                    {this.getOwnerPicker(ownerData)}
                </NavBar>
                <WhiteSpace size='xs'/>
                <DatePicker mode="date" value={state.dateValue} onOk={this.changeDate}>
                    <List.Item arrow="horizontal">日期</List.Item>
                </DatePicker>
                <WhiteSpace size='xs'/> {memberData
                    ? this.getGroupUserPciker({
                        ...state,
                        memberData: memberData
                            .members
                            .map(member => {
                                return Object.assign({}, member, {
                                    value: member.wa_code,
                                    label: member.name
                                })
                            }),
                        changeMemberValue: this.changeMemberValue
                    })
                    : this.getUserPciker(state)}
                <WhiteSpace size='xs'/>
                <List key='price'>
                    <InputItem
                        type={"number"}
                        placeholder="元"
                        clear
                        onChange={(v) => {
                        console.log('onChange', v);
                    }}
                        onBlur={(v) => {
                        console.log('onBlur', v);
                    }}
                        className="switch-input">
                        <SwitchButton
                            data={state.inOutData}
                            onSwitch={this.switchInOutType}
                            value={state.inOutType}></SwitchButton>
                    </InputItem>
                </List>
                <WhiteSpace size='xs'/>
                {/* 分类信息 */}
                <CategoryArea iconWidth={iconWidth}>
                    {state
                        .categoryInfo
                        .map(cate => {
                            return (
                                <div
                                    key={cate.id}
                                    className={`cate-item-wrapper ${ !state.editIconMode && state.activeCate && cate.id === state.activeCate.id
                                    ? "active"
                                    : ""}`}
                                    onClick={() => {
                                    this.clickCategory(cate)
                                }}>
                                    <img src={ICONS[cate.type]} alt={cate.title}/>
                                    <div>{cate.title}{state.editIconMode && (
                                        <span
                                            className="edit-icon"
                                           ><i className="fa fa-edit"/></span>
                                    )}</div>
                                    {state.editIconMode && (
                                        <span
                                            className="del-icon"
                                            onClick={(e) => {
                                                this.DelIcon(e, cate)
                                        }}><i className="fa fa-trash-alt"/></span>
                                    )}
                                </div>
                            )
                        })}
                        {/* 编辑按钮 */}
                    {state.editIconMode
                        ? (
                            <React.Fragment>
                                <span className='cate-item-wrapper' key="add" onClick={this.handleAddCate}>
                                    <i className='fa fa-plus-circle'></i>
                                </span>
                                <span className='cate-item-wrapper' key="ok" onClick={this.finishEditCateIcon}>
                                    <i className='fa fa-check-circle'></i>
                                </span>
                            </React.Fragment>
                        )
                        : <span
                            className='cate-item-wrapper'
                            onClick={this.changeToEditMode}
                            key="setting">
                            <i className='fa fa-cog'></i>
                        </span>}
                </CategoryArea>
                <WhiteSpace size='xs'/>
                <List >
                    <TextareaItem // title="高度自适应"
                        autoHeight placeholder="描述一下..." key='description' className="add-description"/>
                </List>
                <Modal
                    visible={state.showIconEditModal}
                    transparent={true}
                    maskTransitionName={"bounce"}
                    style={{
                    width: "80%"
                }}
                    maskClosable={true}
                    onClose={this.onCloseEditCateIcon}>
                    <IconEditBox title={state.activeCate && state.activeCate.title} activeCate={state.activeCate && state.activeCate.type} mode={this.mode}></IconEditBox>
                </Modal>

            </div>
        )
    }
}
export default Add