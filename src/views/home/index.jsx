import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Footer from '../../components/footer'
import DashBoard from '../dashboard'
import Budget from '../budget'

class Home extends React.Component {
    componentDidMount() {
        
    }
    render() {
        let curUrl = this.props.match.url
        return (
            <div>
                <Switch>
                    <Route path={curUrl} component={DashBoard} exact/>
                    <Route path={curUrl + '/budget'} component={Budget} />
                </Switch>
                <Footer />
            </div>
        )
    }
}

export default Home