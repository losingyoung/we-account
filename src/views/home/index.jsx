import React from 'react'
import {Route, Switch} from 'react-router-dom'

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
            userCode: ''
        }
    }
    componentWillMount() {
        console.log('1')
        if (this.props.history.replace('/', "") !== "index") {
            this.props.history.push('/index')
        }
        // getUserInfo by session
        
    }
    render() {
        let curUrl = this.props.match.url
        let state = {userCode: this.state.userCode}
        return (
            <div>
                <Switch>
                    <Route path={curUrl} component={DashBoard} exact/>
                    <Route path={curUrl + '/budget'} component={Budget} />
                    <Route path={curUrl + '/add'} component={Add} />
                    <Route path={curUrl + '/members'}  component={Members} />
                    <Route path={curUrl + '/me'} component={Me} />
                </Switch>
                <Footer  activeRoute={(route) => {this.props.history.push({pathname: `${curUrl}/${route}`, state})}} routeArr={this.state.routeArr}/>
            </div>
        )
    }
}

export default Home