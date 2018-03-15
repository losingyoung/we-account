import React, { Component } from 'react';
import './App.css';
import {Route, Switch} from 'react-router-dom'
import Login from './views/login'
import Home from './views/home'
import Demo from './views/demo'

class App extends Component {

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/index' component={Home} />
          <Route path='/demo' component={Demo} />
        </Switch>
      </div>
    );
  }
}

export default App;
