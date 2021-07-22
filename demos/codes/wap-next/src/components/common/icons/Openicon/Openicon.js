import React, {Component} from 'react';

import '@/components/common/icons/icons.css';


// export default (props) => {
//
//
//
//   let newProps = {
//     ...props,
//     className: 'icon-open-icon ' + (props.className || '')
//   }
//
//   return <span {...newProps}></span>
// }

class Openicon extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open:false,
            className: 'icon-open-icon'
        };
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        console.log(this.props)
        this.setState({
            open:!this.state.open,
            // className: 'icon-open-icon nb_active'
        });
        let {mid} = this.props;
        this.props.getAddtionInfo(mid)
    }

    render() {
        // let newProps = {
        //     ...this.props,
        //     className: this.state.className
        // };

        let str='icon-open-icon';
        if(!this.state.open){
            str='icon-open-icon nb_active'
        }

        return (
            <span className={str} onClick={this.handleClick}></span>
        )
    }

}

export {Openicon}