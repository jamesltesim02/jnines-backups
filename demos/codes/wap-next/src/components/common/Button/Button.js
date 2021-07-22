import React, { Component } from 'react';
import './Button.css';
const Button = ({onClick}) => (
  <div>
    <button onClick={onClick} className="nb_Button">关闭</button>
  </div>
)
export default Button