import React,{Component} from 'react';
import './scoreTimeTeam.css'
import Liveicon from '@/components/common/icons/Liveicon';
import Pankouicon from '@/components/common/icons/Pankouicon/Pankouicon';
import {Commen} from '../../../assets/js/commenFunc'
import BetItemContainer from '@/components/Bet/BetItemContainer'
class Score extends Component{
    render(){
        let {score}=this.props;
        return(
            <span className={'nb_match_score'}>{score}</span>
        )
    }
}
class VideoIco extends Component{
    render(){
        return(
           <span className="fl"><Liveicon /></span> 
        )
    }
}
class Team extends Component{
    render(){
        return(
            <span className={'nb_match_team'}>{this.props.team}</span>
        )
    }
}
class GtpNum extends Component{
    render(){
        return(
            <span className={'nb_match_gtpNum'}>{this.props.gtotal}<Pankouicon/> </span>
        )
    }
}
class Time extends Component{
    render(){

        return(
            <span className={'nb_match_time'}>{this.props.time}</span>
        )
    }
}

class Ovalue extends Component{
    render(){
        let gtp18_lan={
            'Over':'大',
            'Under':'小',
        };
        let {gtp,ovalue,on}=this.props;
            ovalue=Commen.handleOvalue(ovalue);

        if(gtp===18){
            ovalue=gtp18_lan[on]+''+ovalue
        }



        return(
            <p className={'nb_home_ovalue'}>{ovalue}</p>
        )
    }
}
class Odds extends Component{
    render(){
        let {gtp,odds,checked}=this.props;
        odds=Commen.save_float(Commen.handleOdds(odds,gtp),3);
        if(isNaN(odds)){
            odds='';
        }
        let checked_class='';
        if(checked){
            checked_class='nb_current_click'
        }
        return(
            <p className={`nb_betItem_odds ${checked_class}`}>{odds}</p>
        )
    }
}
class Gtp16 extends Component{

    constructor(){
        super();
        this.clickBet=this.clickBet.bind(this);
    }
    clickBet(){
        let {ostatus,sno}=this.props;
        let send_obj={
            aid:this.props.aid,
            atn:this.props.atn,
            bcontent:this.props.bcontent,
            bstage:this.props.bstage,
            gno:this.props.gno,
            goal:this.props.goal,
            gpt:this.props.gpt,
            gtp:this.props.gtp,
            hid:this.props.hid,
            htn:this.props.htn,
            mid:this.props.mid,
            mstate:this.props.mstate,
            oid:this.props.oid,
            odds:this.props.odds,
            on:this.props.on,
            ostatus:this.props.ostatus,
            ovalue:this.props.ovalue,
            sno
        };
        /*
        * 状态等于7时可投
        * */
        if(ostatus==7){
            this.props.onBetToggle({...send_obj});
        }

    }
    render(){
        let  addclass='';
        let {odds,ovalue,gtp,checked,quoteing,onBetToggle = (data)=>{}}=this.props;
        if(checked){
            addclass='nb_current_click';
        }

        return(
                <div className={`nb_gtp16_betItem ${addclass}`} onClick={this.clickBet}>
                    <Ovalue gtp={gtp} ovalue={ovalue}/>
                    <Odds  gtp={gtp} odds={odds} checked={checked}/>
                </div>
        )
    }
}
class Gtp18 extends Component{
    constructor(){
        super();
        this.clickBet=this.clickBet.bind(this)
    }
    clickBet(){
        let {ostatus,sno}=this.props;
        let send_obj={
            aid:this.props.aid,
            atn:this.props.atn,
            bcontent:this.props.bcontent,
            bstage:this.props.bstage,
            gno:this.props.gno,
            goal:this.props.goal,
            gpt:this.props.gpt,
            gtp:this.props.gtp,
            hid:this.props.hid,
            htn:this.props.htn,
            mid:this.props.mid,
            mstate:this.props.mstate,
            oid:this.props.oid,
            odds:this.props.odds,
            on:this.props.on,
            ostatus:this.props.ostatus,
            ovalue:this.props.ovalue,
            sno
        };
        if(ostatus==7){
            this.props.onBetToggle({...send_obj});
        }

    }
    render(){
        let {odds,on,gtp,ovalue}=this.props;
        let addclass='';
        if(this.props.checked){
            addclass='nb_current_click'
        }
        return(
                <div className={`nb_gtp16_betItem ${addclass}`} onClick={this.clickBet}>
                    <Ovalue on={on} gtp={gtp} ovalue={ovalue}/>
                    <Odds  gtp={gtp} odds={odds} checked={this.props.checked}/>
                </div>


        )
    }
}










export {Score,VideoIco,Team,Time,GtpNum,Ovalue,Odds,Gtp18,Gtp16}