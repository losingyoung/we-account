import React, { Component } from 'react';
import './App.css';
import {Route, Switch} from 'react-router-dom'
import Login from './views/login'
import Home from './views/home'

class App extends Component {

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/index' component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;
