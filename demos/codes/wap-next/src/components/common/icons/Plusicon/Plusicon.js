import React from 'react';

import '@/components/common/icons/icons.css';


export default (props) => {
  
  let newProps = {
    ...props,
    className: 'icon-plus-icon ' + (props.className || '')
  }

  return <span {...newProps}></span>
}