import React,{Component} from 'react';
import {Theader} from "../common/Theader/Theader";
import {TtpSportPannel} from "@/components/common/TtpSportPannel/TtpSportPannel";
import '../Home/home.css';
import ListMatch from "./ListMatch/ListMatch";

import Tabbar from "../common/Tabbar/Tabbar";
import {HashRouter,Switch,Route,Redirect} from 'react-router-dom';
import {SelectLeage} from "@/components/common/SelectLeage/SelectLeage";
import {SelectLeageContainer} from "@/containers/SelectLeageContainer";
import NBBase from '../../assets/js/base';
import {TtpPannel} from "../common/TtpPannel/TtpPannel";

class ListByTime extends Component{





    constructor(){
        super();
        this.state={
            selectLeageShow:false
        };
        this.toggleClickLeage=this.toggleClickLeage.bind(this);
        this.handleSelectedRids=this.handleSelectedRids.bind(this);
        this.handleHideRace=this.handleHideRace.bind(this);
        this.selectSno=this.selectSno.bind(this);
    }

    /*
    * 切换运动项
    * */
    selectSno(sno){
        this.props.selectSno(sno);
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
                    {<TtpSportPannel selectSno={this.selectSno} location={location} match={match} />}
                </div>
                <div className={'nb_home_match_wrap'}>
                    <div className={'nb_home_scroll'}>
                        <div className={'nb_homeMatch_wrap'}>

                            <ListMatch sno={sno} races={races} location={location}/>

                        </div>
                    </div>
                </div>
                <Tabbar/>
                {this.state.selectLeageShow?<SelectLeageContainer match={match} handleHideRace={this.handleHideRace} handleSelectedRids={this.handleSelectedRids.bind(this)} sno={sno} ttp={this.props.ttp}/>:null}
            </div>
        )
    }
}
export {ListByTime}