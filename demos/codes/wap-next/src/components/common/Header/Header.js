import React,{Component} from 'react';
import {Link} from 'react-router-dom'

import './Header.css';

import BackIncon from '@/components/common/icons/BackIcon/BackIcon'
import MoreIcon from '@/components/common/icons/MoreIcon/MoreIcon';
// import Topupicons from '@/components/common/icons/Topupicons';

import CombinedShape from './CombinedShape/CombinedShape';

class Header extends Component{

    constructor(props){
        super(props);
        this.state={
            showMore:props.showMore,
        };
        this.handleClickMore=this.handleClickMore.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            showMore:nextProps.showMore
        })
    }
    handleClickMore(e){

        this.setState({
            showMore:!this.state.showMore
        });



    }

    render(){
        return(
            <div className={'nb_fixed_header'}>
                <BackIncon
                    className="nb_goBack"
                />
                <span>{this.props.title}</span>
                {this.props.more_flag?<MoreIcon
                    className="nb_more_entry"
                    onClick={this.handleClickMore}
                />:null}
                {this.state.showMore?<CombinedShape/>:null}
            </div>
        )
    }
}
export  default Header
