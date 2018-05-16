import React from 'react'
import {connect} from "react-redux";
import {setGroupPreference} from "../../store/actions/groupPreference";
import {setAccountItems} from "../../store/actions/accountItems";
import {NavBar, Picker, SegmentedControl, WingBlank, WhiteSpace, Toast, Modal} from 'antd-mobile';
import ToggleWrapper from '../../components/toggle-show'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
// const echarts = require('../../assets/js/echarts');
import Title from './children/title'
import TYPE from '../../constants/constants'
import * as Service from "../../service";
import AccountItem from "./children/account-item";

class DashBoard extends React.Component {
    state = {
        ownerSelectData: null,
        overViewMonth:null, //页面上显示的
        overViewYear: null,
        overViewData:null, //页面上显示的
        overViewYearData:null,
        selectedIndex: 0,
        selectedTimeDimension: 0
    }
    componentWillReceiveProps() {
        this.getOwnerPickerData()
    }
    componentDidMount() {
        this.getOwnerPickerData()
        this.getAccountItems()
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
    initOverviewCharts(data) {
        this.initMonthOverviewChart(data)
        this.initYearOverviewChart(data)
    }
    initMonthOverviewChart(data) {
        if (!this.monthOverviewChart) {
            this.monthOverviewChart = echarts.init(this.monthOverviewChartDiv)
            this.monthOverviewChart.on('click',e => {
                console.log('clicked',e)
                this.setState({
                    overViewMonth:e.name,
                    overViewData:e.value
                }, this.initMonthlyCategoryCharts)
            })
        }
        const overviewOption = {
            xAxis: {
                type: 'category',
                data: data.date
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            series: [{
                data: data.data,
                type: 'line'
            }],
            grid: {
                top:20,
                bottom: 30
            }
        }
        this.monthOverviewChart.setOption(overviewOption);
    }
    initYearOverviewChart(data) {
        if (!this.yearOverviewChart) {
            this.yearOverviewChart = echarts.init(this.yearOverviewChartDiv)
            this.yearOverviewChart.on('click',e => {
                console.log('clicked',e)
                this.setState({
                    overViewYear:e.name,
                    overViewYearData:e.value
                }, this.initYearlyCategoryCharts)
            })
        }
        const overviewOption = {
            xAxis: {
                type: 'category',
                data: data.date
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            series: [{
                data: data.data,
                type: 'line'
            }],
            grid: {
                top:20,
                bottom: 30
            }
        }
        this.yearOverviewChart.setOption(overviewOption);
    }
    initCategoryCharts() {
        this.initMonthlyCategoryCharts()
        this.initYearlyCategoryCharts()
        // this.monthCategoryChart.setOption(option)
        // this.yearCategoryChart.setOption(option)
        // this.monthPersonChart.setOption(option)
        // this.yearPersonChart.setOption(option)
    }
    initMonthlyCategoryCharts() {
        this.drawMonthCategoryChart()
        this.drawMonthPersonChart()
    }
    initYearlyCategoryCharts() {
        this.drawYearCategoryChart()
        this.drawYearPersonChart()
    }
    drawMonthCategoryChart() {
        if (!this.monthCategoryChart) {
            this.monthCategoryChart = echarts.init(this.monthCategoryChartDiv)
        }
        const option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                // axisLabel: {
                //     show: false
                // },
                axisTick: {
                    show: false
                },
                type: 'category',
                data: ['巴西','印尼','美国','印度','中国','世界人口']
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    data: [18203, 23489, 29034, 104970, 131744, 630230],
                    label: {
                        show: true,
                        position: 'insideLeft',
                        distance:10
                    }
                }
            ]
        };
        this.monthCategoryChart.setOption(option)
    }
    drawYearCategoryChart() {
        if (!this.yearCategoryChart) {
            this.yearCategoryChart = echarts.init(this.yearCategoryChartDiv)
        }
        const option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                // axisLabel: {
                //     show: false
                // },
                axisTick: {
                    show: false
                },
                type: 'category',
                data: ['巴西','印尼','美国','印度','中国','世界人口']
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    data: [18203, 23489, 29034, 104970, 131744, 630230],
                    label: {
                        show: true,
                        position: 'insideLeft',
                        distance:10
                    }
                }
            ]
        };
        this.yearCategoryChart.setOption(option)
    }
    drawMonthPersonChart() {
        if (!this.monthPersonChart) {
            this.monthPersonChart = echarts.init(this.monthPersonChartDiv)
        }
        const option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                // axisLabel: {
                //     show: false
                // },
                axisTick: {
                    show: false
                },
                type: 'category',
                data: ['巴西','印尼','美国','印度','中国','世界人口']
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    data: [18203, 23489, 29034, 104970, 131744, 630230],
                    label: {
                        show: true,
                        position: 'insideLeft',
                        distance:10
                    }
                }
            ]
        };
        this.monthPersonChart.setOption(option)
    }
    drawYearPersonChart() {
        if (!this.yearPersonChart) {
            this.yearPersonChart = echarts.init(this.yearPersonChartDiv)
        }
        const option = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                // axisLabel: {
                //     show: false
                // },
                axisTick: {
                    show: false
                },
                type: 'category',
                data: ['巴西','印尼','美国','印度','中国','世界人口']
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    data: [18203, 23489, 29034, 104970, 131744, 630230],
                    label: {
                        show: true,
                        position: 'insideLeft',
                        distance:10
                    }
                }
            ]
        };
        this.yearPersonChart.setOption(option)
    }
    // 切换标题栏
    changeTab = e => {
        const selectedIndex = e.nativeEvent.selectedSegmentIndex
        this.setState({
            selectedIndex
        })
    }
    // 切换时间维度
    changeTimeDimension = e => {
        const selectedTimeDimension = e.nativeEvent.selectedSegmentIndex
        this.setState({
            selectedTimeDimension
        })
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
    setInitialOverViewData(data) {
        if (data.date.length && data.data.length) {
            this.setState({
                overViewMonth:data.date[data.date.length - 1],
                overViewData:data.data[data.data.length - 1],
                overViewYear: data.date[data.date.length - 1],
                overViewYearData:data.data[data.data.length - 1]
            }, this.initCategoryCharts)
        }

    }
    // 初始化&account改变 重新画表
    componentDidUpdate() {
        if (this.monthOverviewChartDiv && this.account && this.account.chartData && this.changeAccount) {
            this.initOverviewCharts(this.account.chartData.totalOverview)
            this.setInitialOverViewData(this.account.chartData.totalOverview)
        }
    }
    delAccount = (account)=> {
        console.log('del', account)
        Modal.alert('删除', '确定删除吗?', [
            { text: '取消'},
            { text: '确定', onPress: () => {
                Toast.loading('加载中...')
                    setTimeout(() => {
                        Toast.hide()
                    }, 3000)
            } },
          ])
    }
    getAccountBody(account) {
        if (!account) {
            return (
                <div>加载中...</div>
            )
        }
        const {overViewMonth, overViewData, overViewYear, overViewYearData, selectedIndex, selectedTimeDimension} = this.state
        const leftBudget = account.budget > 0
            ? <span>距预算: {account.budget - account.totalCost}</span>
            : ''
        const chartWidth = window.innerWidth
        return (
            <div style={{backgroundColor: "#eee"}}>
                <WhiteSpace size='lg' />
                <WingBlank size='lg'>
                  <SegmentedControl values={['统计', '图表']} selectedIndex={selectedIndex} onChange={this.changeTab}/>
                </WingBlank>
                <WhiteSpace size='lg' />
                <ToggleWrapper show={selectedIndex === 0}>
                    <span>总支出 {account.totalCost}
                        {leftBudget}
                    </span>
                    <div>日均: {account.averageDay}</div>
                    <div>
                        最近添加项目:
                    </div>
                    <div>
                        {account.items.length > 0
                            ? account
                                .items
                                .map(item => {
                                    return (
                                        <AccountItem key={item.itemId} {...item} onDel={this.delAccount} />
                                    )
                                })
                            : <span>无</span>}
                    </div>
                </ToggleWrapper>
                <ToggleWrapper show={selectedIndex === 1}>
                  <WingBlank size='lg'>
                    <SegmentedControl style={{width:'70px', textAlign:'right'}} values={['月', '年']} selectedIndex={selectedTimeDimension} onChange={this.changeTimeDimension}/>
                  </WingBlank>
                  {/* 月度图表 */}
                  <ToggleWrapper show={selectedTimeDimension === 0}>
                    <div>{overViewMonth}月 ￥{overViewData}</div>
                    <div ref={el => this.monthOverviewChartDiv = el}  style={{width: `${chartWidth}px`, height:"150px"}}></div>
                    <div ref={el => this.monthCategoryChartDiv = el}  style={{width: `${chartWidth}px`, height:"200px"}}></div>
                    <div ref={el => this.monthPersonChartDiv = el}  style={{width: `${chartWidth}px`, height:"200px"}}></div>
                  </ToggleWrapper>
                  {/* 年度图表 */}
                  <ToggleWrapper show={selectedTimeDimension === 1}>
                     <div>{overViewYear}年 ￥{overViewYearData}</div>
                     <div ref={el => this.yearOverviewChartDiv = el}  style={{width: `${chartWidth}px`, height:"150px"}}></div>
                     <div ref={el => this.yearCategoryChartDiv = el}  style={{width: `${chartWidth}px`, height:"200px"}}></div>
                     <div ref={el => this.yearPersonChartDiv = el}  style={{width: `${chartWidth}px`, height:"200px"}}></div>
                  </ToggleWrapper>
                </ToggleWrapper>
            </div>
        )
    }

    render() {
        const {ownerSelectData} = this.state
        let accounts = this.props.curFor && this.setAccountItems(this.props.curFor)
        let account = accounts && accounts[0]
        // let budget =
        let targetFor = (ownerSelectData && this.props.curFor) && ownerSelectData[0].filter(item => {
            return this.props.curFor.type === item.type && this.props.curFor.value === item.value
        })
        if (account && targetFor) {
            account.budget = targetFor[0] && targetFor[0].budget
            if (this.account !== account) {
                this.changeAccount = true
                this.account = account
            } else {
                this.changeAccount = false
            }
        }
        const accountBody = this.getAccountBody(account)
        
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