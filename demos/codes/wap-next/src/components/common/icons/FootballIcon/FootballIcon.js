import React,{Component} from 'react';

import '@/components/common/icons/icons.css';
class FootballIcon extends Component{


    render(){


        let newProps = {
            ...this.props,
            className: 'icon-variety-football ' + (this.props.className || '')
        };
        return(
            <span {...newProps}></span>
        )
    }
}
export default FootballIcon
