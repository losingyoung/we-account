import React from 'react'
import { Map, fromJS } from 'immutable'
import {connect} from 'react-redux'
import {setGroupPreference} from '../../store/actions/groupPreference'
import {
    DatePicker,
    Picker,
    List as AntList,
    NavBar,
    WhiteSpace,
    InputItem,
    TextareaItem,
    Modal,
    Toast,
    Button
} from 'antd-mobile';
import './index.css'
import SwitchButton from '../../components/switch-button'
import ICONS from './icon'
import * as Styled from './Styled'
import * as Service from '../../service'
import IconEditBox from './children/icon-edit-box'
import Title from './children/title'
import TYPE from '../../constants/constants'


class Add extends React.Component {
    constructor(props) {
        super(props)
        this.mode = null
        this.nextIconId = null
        this.state = {
            ownerSelectData: null, // dataset 可以选个人还是某个组
            memberData: null, // 所有组员信息
            dateValue: new Date(),
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
            price: null,
            description: '',
            categoryInfo: [],
            activeCate: null,
            editIconMode: false,
            showIconEditModal: false
        }
    }
    async componentWillMount() {
        this._isMounted = true
        let userInfo = this.props.userInfo
        if (!userInfo || !this._isMounted) {
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
        this.setOwnerPickerData([curForValue], ownerSelectData[0])
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getNextIconId() {
        return this.nextIconId
    }
    goBack =()=> {
        // console.log('back')
    }
    async initCateData(type, curForValue) {
        let cateIcons;
        if (type === TYPE.PERSONAL) {
            cateIcons = await Service.getPersonalIcons({ wa_code: curForValue })
        } else {
            cateIcons = await Service.getGroupIcons({ group_id: curForValue })
        }
        let data = cateIcons.data
        this.nextIconId = data.nextIconId
        this.setState({ categoryInfo: fromJS(data.icons), activeCate: null, editIconMode: false })
    }
    // 为谁加
    setOwnerPickerData = ([curForValue], ownerSelectData) => {
        let memberData = null
        const ownerData = this.state.ownerSelectData ? this.state.ownerSelectData[0] : ownerSelectData
        ownerData
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
        this.initCateData(type, curForValue)
        this.setState({ memberData, memberValue: [] })
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
    // 价格变化
    changePrice = (value) => {
      value = parseFloat(value)
      if (!Number.isNaN(value)) {
          this.setState({
              price: value
          })
      }
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
        const {userInfo, curFor} = this.props
        const { memberData, categoryInfo } = this.state
        const curForValue = curFor.value
        let params = {
            forType: curFor.type,
            wa_code: userInfo.wa_code,
            ...(cate.toJS())
        }
        if (memberData) {
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
                    return false
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
        const {userInfo, curFor} = this.props
        const { memberData, categoryInfo } = this.state
        const curForValue = curFor.value
        
        let params = {
            forType: curFor.type,
            wa_code: userInfo.wa_code
        }
        if (memberData) {
            params.group_id = curForValue
        }
        if (this.mode === 'update') {
            let id = this.state.activeCate.get('id')
           let updatedCate = this.state.activeCate.set("title", title).set("type", activeCateType)
           let newParams = updatedCate.merge(params)
           Service.updateCate(newParams.toJS()).then(res => {
               let data = res.data
               if (data.success) {
                categoryInfo.some((item, idx) => {
                    if (item.get("id") === id) {
                       this.setState({
                        categoryInfo:categoryInfo.setIn([idx, "title"], title).setIn([idx, "type"], activeCateType),
                        showIconEditModal: false
                       }) 
                        return true
                    }
                    return false
                })
               }

           })
        } else if (this.mode === 'add') {
            if (!title) {
                alert('请输入名称')
                return
            }
            if (!activeCateType) {
                alert('请选择类别')
                return     
            }
            let iconId = this.getNextIconId()
            let newCate = {
                id: iconId,
                title,
                type: activeCateType
            }
            let newParams =  Object.assign({}, params, newCate)
            // console.log('add', categoryInfo.push(newCate))
            Service.addCate(newParams).then(res => {
               let data = res.data
               this.nextIconId = data.nextIconId
               this.setState({
                   categoryInfo: categoryInfo.push(Map(newCate)),
                   showIconEditModal: false
               })
            })

        }

        this.mode = null
    }
    // 完成类别编辑按钮
    finishEditCateIcon = () => {
        this.setState({ editIconMode: false })
    }
    onCloseEditCateIcon = () => {
        this.setState({ showIconEditModal: false })
    }
    // 确认添加整个项目
    completeAdding = () => {
        let {dateValue, price, inOutType, activeCate, memberValue, memberData, description} = this.state
        const {userInfo, curFor} = this.props
        if (!memberValue) {
            Toast.info("未选择人员哦",1.5)
            return           
        }
        if (!price) {
            Toast.info("未填写金额哦", 1.5)
            return
        }
        if (!activeCate) {
            Toast.info("未选择类别哦", 1.5)
            return
        }
        let params = {
            forType: curFor.type,
            wa_code: userInfo.wa_code,
            userName: userInfo.name,
            itemDate: dateValue.getTime(),
            categoryId: activeCate.get("id"),
            categoryType: activeCate.get("type"),
            categoryTitle: activeCate.get("title"),
            inOutType,
            price,
            description
        }
        if (memberData) {
            params.group_id = curFor.value
            params.groupName = memberData.groupName
            params.memberCode = memberValue[0]
            memberData.members.some(item => {
                if (item.wa_code === memberValue[0]) {
                    params.memberName = item.name
                    return true
                }
                return false
            })
        }

        Service.addAccountItem(params).then(res => {
            let data = res.data
            if (data.success) {
                Toast.success("添加成功", 2, () => {
                    this.setState({
                        price: null
                    })
                })
            }
        })
    }
    getOwnerPicker(ownerData) {
        if (ownerData) {
            return (
                <Picker cascade={false} data={ownerData} onOk={this.setOwnerPickerData}
                    onDismiss={e => { console.log('dismiss', e) }} value={this.props.curFor&&this.props.curFor.value ? [this.props.curFor.value]:[]}>
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
    getUserPciker(userInfo, curForValue) {
        if (!userInfo) {
            return null
        }
        return (
            <Picker
                cascade={false}
                data={[
                    [{
                        value: userInfo.wa_code,
                        label: userInfo.name,
                        type: TYPE.PERSONAL,
                        ...userInfo
                    }]
                ]}
                value={[userInfo.wa_code]}
                disabled={true}>
                <AntList.Item >人员</AntList.Item>
            </Picker>
        )
    }
    getGroupUserPciker(props) {
        console.log('group picker', props)
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
        const {memberData} = this.state
        const {userInfo, curFor} = this.props
        const screenWidth = (document.documentElement && document.documentElement.clientWidth) || window.innerWidth
        const oneLineCount = screenWidth < 375
            ? 5
            : (screenWidth <414 ? 6 : 7)
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
                <WhiteSpace size='xs' /> 
                  {memberData
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
                    : this.getUserPciker(userInfo, curFor &&curFor.value)}
                <WhiteSpace size='xs' />
                <AntList key='price'>
                    <InputItem
                        type={"number"}
                        placeholder="元"
                        clear
                        onChange={this.changePrice}
                        onBlur={(v) => {
                            console.log('onBlur', v);
                        }}
                        className="switch-input"
                        value={state.price}>
                        <SwitchButton
                            data={state.inOutData}
                            onSwitch={this.switchInOutType}
                            value={state.inOutType}></SwitchButton>
                    </InputItem>
                </AntList>
                <WhiteSpace size='xs' />
                {/* 分类信息 */}
                <Styled.CategoryArea iconWidth={iconWidth}>
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
                                    <img src={ICONS[cate.get("type")]} className="icon-img" alt={cate.get("title")} />
                                    <div className="icon-title-wrapper">
                                        <span className="icon-title">{cate.get("title")}</span>
                                        {state.editIconMode && (
                                            <span
                                                className="edit-icon"
                                            ><i className="fa fa-edit" /></span>
                                        )}
                                    </div>

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
                                <span className='cate-item-wrapper edit-setting-icon' key="add" onClick={this.handleAddCate}>
                                    <i className='fa fa-plus-circle'></i>
                                </span>
                                <span className='cate-item-wrapper edit-setting-icon' key="ok" onClick={this.finishEditCateIcon}>
                                    <i className='fa fa-check-circle'></i>
                                </span>
                            </React.Fragment>
                        )
                        : <span
                            className='cate-item-wrapper edit-setting-icon'
                            onClick={this.changeToEditMode}
                            key="setting">
                            <i className='fa fa-cog'></i>
                        </span>}
                </Styled.CategoryArea>
                <WhiteSpace size='xs' />
                <AntList >
                    <TextareaItem // title="高度自适应"
                        autoHeight placeholder="描述一下..." key='description' value={state.description} onChange={(description) => {this.setState({description})}} className="add-description" />
                </AntList>
                <WhiteSpace size='lg' />
                <Button type='primary' onClick={this.completeAdding}>添加+</Button>
                <Modal
                    visible={state.showIconEditModal}
                    transparent={true}
                    maskTransitionName={"bounce"}
                    style={{
                        width: "80%"
                    }}
                    maskClosable={true}
                    onClose={this.onCloseEditCateIcon}>
                    <IconEditBox icons={ICONS} title={state.activeCate && state.activeCate.get("title")} activeCateType={state.activeCate && state.activeCate.get("type")} confirmEdit={this.confirmEditCate} mode={this.mode}></IconEditBox>
                </Modal>
                <WhiteSpace size='lg' />
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
const mapDispatchToProps = dispatch => ({
    onChangeCurFor(curFor) {
        dispatch(setGroupPreference(curFor))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(Add)