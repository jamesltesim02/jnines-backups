import React,{Component} from 'react';
import './Theader.css';

import BackIncon from '@/components/common/icons/BackIcon/BackIcon'
import Chooseicon from '@/components/common/icons/Chooseicon/Chooseicon';
import {Commen} from "../../../assets/js/commenFunc";
import NBBase from '../../../assets/js/base'
class Theader extends Component{


    constructor(){

        super();

        this.goBack=this.goBack.bind(this);
        this.selectLeage=this.selectLeage.bind(this);

        // this.showLeage=false;


    }

    /*
    * 后退
    * */
    goBack(){
        localStorage.removeItem(NBBase.list_pageInfo);
        this.props.history.goBack();
    }


    /*
    * 点击选择联赛
    * */
    selectLeage(){
        // this.showLeage=!this.showLeage;
        // this.props.selectLeage(this.showLeage)
        this.props.selectLeage()
    }
    render(){

       let {title}=this.props;


        return(
            <div className={'nb_two_header'}>
                <div className="nb_goBack" onClick={this.goBack}>
                    <BackIncon/>
                </div>
                <span>{title}</span>
                <div className="nb_nav_choose" onClick={this.selectLeage}>
                    选择联赛<Chooseicon/>
                </div> 
            </div>
        )
    }
}
export  {Theader}
