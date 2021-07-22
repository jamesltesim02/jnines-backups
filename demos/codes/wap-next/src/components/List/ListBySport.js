import React,{Component} from 'react';
import {Theader} from "../common/Theader/Theader";
import {SportsPannel} from '../common/SportsPannel/SportsPannel';
import '../Home/home.css';
import ListMatch from "./ListMatch/ListMatch";

import Tfooter from "../common/Tfooter/Tfooter";
import {HashRouter,Switch,Route,Redirect} from 'react-router-dom';
import {SelectLeage} from "@/components/common/SelectLeage/SelectLeage";
import {SelectLeageContainer} from "@/containers/SelectLeageContainer";
import NBBase from '../../assets/js/base';
import {TtpPannel} from "../common/TtpPannel/TtpPannel";

class ListBySport extends Component{





    constructor(){
        super();
        this.state={
            selectLeageShow:false
        };
        this.toggleClickLeage=this.toggleClickLeage.bind(this);
        this.handleSelectedRids=this.handleSelectedRids.bind(this);
        this.handleHideRace=this.handleHideRace.bind(this);
        this.selectTtp=this.selectTtp.bind(this);
    }

    /*
    * 选择全部、今日、滚球、早盘,并发送action
    * */
    selectTtp(ttp){
        this.props.selectTtp(ttp);
    }

    /*
    * 处理点击选择联赛时，显示隐藏选择联赛组件
    * */
    toggleClickLeage(){
        this.setState({
            selectLeageShow:true
        })
    }

    /*
    * 隐藏选择联赛
    * */
    handleHideRace(){
        this.setState({
            selectLeageShow:false
        })
    }

    /*
    * 接收选择联赛时的rid字符串
    * */
    handleSelectedRids(ridStr){
        this.setState({
            selectLeageShow:false
        });
        this.props.handleSelectedRids(ridStr)
    }

    render(){
        let {title,ttp,races,match,history,sno,location}=this.props;
        return(
            <div className={'nb_home'}>
                <div className={'nb_fixed_header_wrap'}>

                    <Theader title={title} history={history} selectLeage={this.toggleClickLeage} />

                    {<TtpPannel match={match} location={location} ttp={ttp} selectTtp={this.selectTtp}/>}
                </div>
                <div className={'nb_home_match_wrap'}>
                    <div className={'nb_home_scroll'}>
                        <div className={'nb_homeMatch_wrap'}>
                            <ListMatch sno={sno} races={races} location={location}/>
                        </div>
                    </div>
                </div>
                <Tfooter/>
                {this.state.selectLeageShow?<SelectLeageContainer match={match} handleHideRace={this.handleHideRace} handleSelectedRids={this.handleSelectedRids.bind(this)} sno={this.props.sno} ttp={this.props.ttp}/>:null}
            </div>
        )
    }
}
export {ListBySport}