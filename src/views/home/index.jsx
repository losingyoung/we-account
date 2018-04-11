import React from 'react'
import {Route, Switch} from 'react-router-dom'
// import { TransitionGroup, CSSTransition } from "react-transition-group";
import './index.css'
import * as Service from '../../service'
import Footer from '../../components/footer'
import DashBoard from '../dashboard'
import Notifications from '../notifications'
import Add from '../add'
import Members from '../members'
import Me from '../me'
const TYPE = {
    PERSONAL: "0",
    GROUP: "1"
}

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            routeArr: ['', 'notifications', 'add', 'members', 'me'], // 路径
            userInfo: {},
            groupInfos: [],
            curFor: {
                value: 777,
                type: TYPE.PERSONAL
            }, //当前个人 / 组 偏好
            hasUnreadMsg: false
        }
        this.activeRoute = this.activeRoute.bind(this)
    }
    componentDidMount() {
        if (this.props.history.replace('/', "") !== "index") {
            this.props.history.push('/index')
        }
        // 这里应加遮罩 必须取完数据才可以点击跳转****************************
        Service.getUserInfo().then(res => {
            console.log('userinfo', res.data.userInfo)
            let data = res.data
            this.setState({
                userInfo: data.userInfo
            })
        })
        Service.getGroups().then(res => {
            console.log('groupinfo', res.data)
            let {groupInfos} = res.data
            this.setState({
                groupInfos: groupInfos
            })
        })
        Service.getUnreadNotifications().then(res => {
            let data = res.data
            if (data.unread) {
                this.setState({
                    hasUnreadMsg: true
                })
            }
        })
        // getUserInfo by session
        
    }
    changeOwnerPreference = (val) => {
        this.setState({
            curFor: val
        })
    }
    activeRoute(route) {
        let curUrl = this.props.match.url
        let state = this.state
        this.props.history.push({pathname: curUrl + (route ? "/" + route : ""), state})
        if (route === this.state.routeArr[1]) {
            this.setState({
                hasUnreadMsg: false
            })
        }
    }
    render() {
        let curUrl = this.props.match.url
        let location = this.props.location
        return (
            <div>
                {/* <TransitionGroup>

                <CSSTransition key={location.key} classNames="fade" timeout={300}> */}
                    <Switch location={location} >
                    <Route path={curUrl} component={DashBoard} exact/>
                    <Route path={curUrl + '/notifications'} component={Notifications} />
                    <Route path={curUrl + '/add'} component={Add} changeOwnerPreference={this.changeOwnerPreference} />
                    <Route path={curUrl + '/members'}  component={Members} />
                    <Route path={curUrl + '/me'} component={Me}  />
                    <Route render={() => <div>Not Found</div>} />
                </Switch>
                {/* </CSSTransition>
                </TransitionGroup> */}
                <div style={{height:"80px", background: "#eee"}} className='placeholder'/>
                <Footer  activeRoute={this.activeRoute} routeArr={this.state.routeArr} unread={this.state.hasUnreadMsg}/>
            </div>
        )
    }
}

export default Home