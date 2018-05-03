import React from 'react'
import {connect} from "react-redux";
import {setGroupPreference} from "../../store/actions/groupPreference";
import {setAccountItems} from "../../store/actions/accountItems";
import {NavBar, Picker} from 'antd-mobile';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line'
// const echarts = require('../../assets/js/echarts');
import Title from './children/title'
import TYPE from '../../constants/constants'
import * as Service from "../../service";

class DashBoard extends React.Component {
    state = {
        ownerSelectData: null
    }
    componentWillReceiveProps() {
        this.getOwnerPickerData()
    }
    componentDidMount() {
        this.getOwnerPickerData()
        this.getAccountItems()
        // this.initCharts()
        console.log('didmount')
    }
    getOwnerPickerData() {
        let {userInfo, groupInfo} = this.props
        if (!userInfo || !groupInfo || this.state.ownerSelectData) {
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
    // 切换选人/组
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
    // 找到对应的account
    setAccountItems({type, value}) {
        if (!this.props.accountItems) {
            return null
        }
        let accountItems = type === TYPE.PERSONAL
            ? this.props.accountItems.personalAccountItems
            : this.props.accountItems.groupAccountItems
        let idKey = type === TYPE.PERSONAL
            ? 'wa_code'
            : 'group_id'
        return accountItems.filter(item => {
            return item[idKey] === value
        })
    }
    getAccountItems() {
        if (!this.props.accountItems) {
            Service
                .getAccountItem()
                .then(res => {
                    this
                        .props
                        .getAccountItemsFromServer(res.data)
                    // console.log('ser', this.props.accountItems)
                })
        }

    }
    initCharts(data) {
        const overviewChart = echarts.init(this.overviewChart)
        const overviewOption = {
            xAxis: {
                type: 'category',
                data: data.date
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data.data,
                type: 'line'
            }]
        }
        overviewChart.setOption(overviewOption);
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
    getAccountBody(account) {
        if (!account) {
            return (
                <div>加载中...</div>
            )
        }
        const leftBudget = account.budget > 0
            ? <span>距预算: {account.budget - account.totalCost}</span>
            : ''
        return (
            <div>
                <div>tab1
                    <span>总支出 {account.totalCost}
                        {leftBudget}
                    </span>
                    <div>
                        最近添加项目:
                    </div>
                    <div>
                        {account.items.length > 0
                            ? account
                                .items
                                .map(item => {
                                    return (
                                        <div key={item.itemId}>
                                            <span>{item.description}</span>
                                            <span>{item.price}</span>
                                        </div>
                                    )
                                })
                            : <span>无</span>}
                    </div>

                </div>
                <div>tab2 统计 
                    <div ref={el => this.overviewChart = el}  style={{width: "100%", height:"200px"}}></div>
                    <div>日均: {account.averageDay}</div>
                     每一项支出／每天支出
                </div>
            </div>
        )
    }
    componentDidUpdate() {
        console.log('did update')

        if (this.overviewChart && this.account && this.account.chartData) {
            this.initCharts(this.account.chartData.totalOverview)
        }
    }
    render() {
        console.log('render')
        const {ownerSelectData} = this.state
        let accounts = this.props.curFor && this.setAccountItems(this.props.curFor)
        let account = accounts && accounts[0]
        // let budget =
        let targetFor = (ownerSelectData && this.props.curFor) && ownerSelectData[0].filter(item => {
            return this.props.curFor.type === item.type && this.props.curFor.value === item.value
        })
        if (account && targetFor) {
            account.budget = targetFor[0] && targetFor[0].budget
        }
        const accountBody = this.getAccountBody(account)
        this.account = account
        return (
            <div>
                <NavBar mode="dark">
                    {this.getOwnerPicker(ownerSelectData)}
                </NavBar>
                {accountBody}

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