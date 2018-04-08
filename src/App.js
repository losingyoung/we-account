import React, { Component } from 'react';
import './App.css';
import {Route, Switch} from 'react-router-dom'
import Login from './views/login'
import Home from './views/home'
import Demo from './views/demo'

class App extends Component {
  // state={
  //   curPath: ''
  // }
  // componentWillMount() {
  //   console.log('app will mount')
  //   const storedPath = localStorage.getItem("curPath")
  //   alert(storedPath)
  //   if (window.location.pathname !== storedPath) {
  //     window.location.replace(storedPath)
  //   }
    
  // }
  // componentDidUpdate(prevProps) {
  //   if (window.location.pathname !== this.state.curPath) {
  //     localStorage.setItem('curPath', window.location.pathname)
  //   }
  // }
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
