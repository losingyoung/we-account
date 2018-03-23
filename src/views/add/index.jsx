import React from 'react'
import { fromJS } from 'immutable'
import {
    DatePicker,
    Picker,
    List as AntList,
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
        this.state = {
            title: props.title || "",
            activeCateType: props.activeCateType,
            iconWidth: 0
        }
    }
    setActiveIcon = (type) => {
        this.setState({
            activeCateType: type
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
        let { title, activeCateType } = this.state
        this.props.confirmEdit && this.props.confirmEdit({
            title,
            activeCateType
        })
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
        let { activeCateType, title, iconWidth } = this.state

        return (
            <div className="icon-edit-wrapper" ref={el => this.boxBody = el}>
                <div className="title-container">
                    <input value={title} onChange={this.changeCateTitle} />
                </div>
                <div className="operation-buttons">
                    <span onClick={this.confirmChange}><i className='fa fa-check' /></span>
                    {/* <span><i className='fa fa-times-circle'/></span> */}
                </div>
                <div className="icons-container">
                    <CategoryArea iconWidth={iconWidth}>
                        {Object.keys(ICONS)
                            .map(type => {
                                return (
                                    <div
                                        key={type}
                                        className={`cate-item-wrapper ${type === activeCateType
                                            ? "active"
                                            : ""}`}
                                        onClick={() => {
                                            this.setActiveIcon(type)
                                        }}>
                                        <img src={ICONS[type]} alt={type} />
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
        this.initCateData(type, curForValue)
        // let cateIcons;
        // if (type === TYPE.PERSONAL) {
        //     cateIcons = await Service.getPersonalIcons({wa_code: curForValue})
        // } else {
        //     cateIcons = await Service.getGroupIcons({group_id: curForValue})
        // }
        this.setState({ curForValue, ownerSelectData, userInfo: user })
    }
    componentWillUnmount(a) {
        this._isMounted = false
    }
    goBack() {
        // console.log('back')
    }
    async initCateData(type, curForValue) {
        let cateIcons;
        if (type === TYPE.PERSONAL) {
            cateIcons = await Service.getPersonalIcons({ wa_code: curForValue })
        } else {
            cateIcons = await Service.getGroupIcons({ group_id: curForValue })
        }
        this.setState({ categoryInfo: fromJS(cateIcons.data), activeCate: null, editIconMode: false })
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
        // this.props.changeOwnerPreference({value: curForValue, type: memberData ?
        // TYPE.GROUP : TYPE.PERSONAL})
        let type = memberData ? TYPE.GROUP : TYPE.PERSONAL
        this.initCateData(type, curForValue)
        this.setState({ curForValue, memberData, memberValue: [] })
    }
    // 更改日期
    changeDate = (value) => {
        this.setState({ dateValue: value })
    }
    //更改人员
    changeMemberValue = (value) => {
        this.setState({ memberValue: value })
    }
    // 收入 支出
    switchInOutType = (value) => {
        this.setState({ inOutType: value })
    }
    // 点击某个类别
    clickCategory = (cate) => {
        if (this.state.editIconMode) {
            this.mode = 'update'
            this.setState({ showIconEditModal: true, activeCate: cate })
            return false
        }
        this.setState({ activeCate: cate })
    }
    // 开启编辑模式
    changeToEditMode = () => {
        this.setState({ editIconMode: true, activeCate: null })
    }
    //delete cate icon
    DelIcon = (e, cate) => {
        e.stopPropagation()
        const { memberData, userInfo, curForValue, categoryInfo } = this.state
        let params = {
            forType: TYPE.PERSONAL,
            wa_code: userInfo.wa_code,
            ...(cate.toJS())
        }
        if (memberData) {
            params.forType = TYPE.GROUP
            params.group_id = curForValue
        }

        Service.deleteCate(params).then(res => {
            console.log('del', res)
            let data = res.data
            if (data.success) {
                categoryInfo.some((item, idx) => {
                    if (item.get("id") === cate.get("id")) {
                        this.setState({
                            categoryInfo: categoryInfo.delete(idx)
                        })
                        return true
                    }
                })

                // (index >= 0 && this.setState({
                //     categoryInfo: categoryInfo.delete(index)
                // }))
            }
        })

    }
    // add cate icon
    handleAddCate = () => {
        this.mode = 'add'
        this.setState({ showIconEditModal: true })
    }
    // 窗口编辑的完成按钮
    confirmEditCate = ({ title, activeCateType }) => {
        console.log('confirm', this.state.activeCate, title, activeCateType)
        const { memberData, userInfo, curForValue, categoryInfo } = this.state

        let id = this.state.activeCate.get('id')
        let params = {
            forType: TYPE.PERSONAL,
            wa_code: userInfo.wa_code
        }
        if (memberData) {
            params.forType = TYPE.GROUP
            params.group_id = curForValue
        }
        if (this.mode === 'update') {
           let newCate = this.state.activeCate.set("title", title).set("type", activeCateType)
           let newParams = newCate.merge(params)
           Service.updateCate(newParams.toJS()).then(res => {
            categoryInfo.some((item, idx) => {
                if (item.get("id") === id) {
                    console.log('update this')
                }
            })
           })
        }






        this.mode = null
    }
    // 完成编辑按钮
    finishEditCateIcon = () => {
        this.setState({ editIconMode: false })
    }
    onCloseEditCateIcon = () => {
        this.setState({ showIconEditModal: false })
    }
    getOwnerPicker(ownerData) {
        if (ownerData) {
            return (
                <Picker cascade={false} data={ownerData} onOk={this.setOwnerPickerData}
                    onDismiss={e => { console.log('dismiss', e) }} value={[this.state.curForValue]}>
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
                <AntList.Item >人员</AntList.Item>
            </Picker>
        )
    }
    getGroupUserPciker(props) {
        return (
            <Picker
                cascade={false}
                data={[props.memberData]}
                onOk={props.changeMemberValue}
                value={props.memberValue || []}>
                <AntList.Item arrow="horizontal">人员</AntList.Item>
            </Picker>
        )
    }
    render() {
        let state = this.state
        let leftIcon = '' // <Icon type="left" />
        let ownerData = state.ownerSelectData
        let memberData = state.memberData
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
                <WhiteSpace size='xs' />
                <DatePicker mode="date" value={state.dateValue} onOk={this.changeDate}>
                    <AntList.Item arrow="horizontal">日期</AntList.Item>
                </DatePicker>
                <WhiteSpace size='xs' /> {memberData
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
                <WhiteSpace size='xs' />
                <AntList key='price'>
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
                </AntList>
                <WhiteSpace size='xs' />
                {/* 分类信息 */}
                <CategoryArea iconWidth={iconWidth}>
                    {state
                        .categoryInfo
                        .map(cate => {
                            return (
                                <div
                                    key={cate.get("id")}
                                    className={`cate-item-wrapper ${!state.editIconMode && state.activeCate && cate.get("id") === state.activeCate.get("id")
                                        ? "active"
                                        : ""}`}
                                    onClick={() => {
                                        this.clickCategory(cate)
                                    }}>
                                    <img src={ICONS[cate.get("type")]} alt={cate.get("title")} />
                                    <div>{cate.get("title")}{state.editIconMode && (
                                        <span
                                            className="edit-icon"
                                        ><i className="fa fa-edit" /></span>
                                    )}</div>
                                    {state.editIconMode && (
                                        <span
                                            className="del-icon"
                                            onClick={(e) => {
                                                this.DelIcon(e, cate)
                                            }}><i className="fa fa-trash-alt" /></span>
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
                <WhiteSpace size='xs' />
                <AntList >
                    <TextareaItem // title="高度自适应"
                        autoHeight placeholder="描述一下..." key='description' className="add-description" />
                </AntList>
                <Modal
                    visible={state.showIconEditModal}
                    transparent={true}
                    maskTransitionName={"bounce"}
                    style={{
                        width: "80%"
                    }}
                    maskClosable={true}
                    onClose={this.onCloseEditCateIcon}>
                    <IconEditBox title={state.activeCate && state.activeCate.get("title")} activeCateType={state.activeCate && state.activeCate.get("type")} confirmEdit={this.confirmEditCate} mode={this.mode}></IconEditBox>
                </Modal>

            </div>
        )
    }
}
export default Add