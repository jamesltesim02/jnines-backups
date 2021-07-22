import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';

import './assets/styles/common.less';

import App from './App';
import reportWebVitals from './reportWebVitals';

FastClick.attach(document.body)

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
