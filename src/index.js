import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd-mobile/dist/antd-mobile.css';
import { BrowserRouter as Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import './assets/js/fontawesome-all.js';
import 'antd/dist/antd.css';
import { Provider } from "react-redux";
import store from './store/store'
ReactDOM.render(
    ( <Provider store={store}>
        <Router >
          <App />
        </Router>
      </Provider>
    ), document.getElementById('root')
);
registerServiceWorker();