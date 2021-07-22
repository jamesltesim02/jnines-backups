import React,{Component} from 'react';

import '@/components/common/icons/icons.css';


class MoreIcon extends Component{
  constructor(){
      super()
      this.handleClick=this.handleClick.bind(this)
  }
  handleClick(e){

    this.props.onClick();
      e.stopPropagation();
  }

  render(){
      let newProps = {
          ...this.props,
          className: 'icon-more-icon ' + (this.props.className || '')
      };
    return(
        <span {...newProps} onClick={this.handleClick}></span>
    )
  }
}
export default MoreIcon
