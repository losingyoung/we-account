import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd-mobile/dist/antd-mobile.css';
import { BrowserRouter as Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import './assets/js/fontawesome-all.js';

ReactDOM.render(
    ( <Router >
        <App />
       </Router>
    ), document.getElementById('root')
);
registerServiceWorker();