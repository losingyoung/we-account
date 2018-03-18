import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {getUserInfo} from '../../service'
import Footer from '../../components/footer'
import DashBoard from '../dashboard'
import Budget from '../budget'
import Add from '../add'
import Members from '../members'
import Me from '../me'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            routeArr: ['', 'budget', 'add', 'members', 'me'],
            userInfo: {}
        }
        this.activeRoute = this.activeRoute.bind(this)
    }
    componentWillMount() {
        if (this.props.history.replace('/', "") !== "index") {
            this.props.history.push('/index')
        }
        getUserInfo().then(res => {
            console.log('userinfo', res)
            let data = res.data
            this.setState({
                userInfo: data.userInfo
            })
        })
        // getUserInfo by session
        
    }
    activeRoute(route) {
        let curUrl = this.props.match.url
        let state = {userInfo: this.state.userInfo}
        this.props.history.push({pathname: curUrl + (route ? "/" + route : ""), state})
    }
    render() {
        let curUrl = this.props.match.url
        
        return (
            <div>
                <Switch>
                    <Route path={curUrl} component={DashBoard} exact/>
                    <Route path={curUrl + '/budget'} component={Budget} />
                    <Route path={curUrl + '/add'} component={Add} />
                    <Route path={curUrl + '/members'}  component={Members} />
                    <Route path={curUrl + '/me'} component={Me} />
                </Switch>
                <Footer  activeRoute={this.activeRoute} routeArr={this.state.routeArr}/>
            </div>
        )
    }
}

export default Home