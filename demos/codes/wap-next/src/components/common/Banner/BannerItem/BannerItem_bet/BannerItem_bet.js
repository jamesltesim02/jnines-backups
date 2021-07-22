import React,{Component} from 'react';
import '../../banner.css'
import format from 'simple-date-format';
// import {Odds} from "../../../ScoreTimeTeam/ScoreTimeTeam";
import {Commen} from "../../../../../assets/js/commenFunc";
import BetItemContainer from '@/components/Bet/BetItemContainer';
class BannerOdds extends Component{


    constructor(){
        super();
        this.clickBet=this.clickBet.bind(this)
    }

    clickBet(){
        let {ostatus,onBetToggle,oid}=this.props;
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
            onBetToggle({
                ...send_obj
            })
        }
    }

    render(){
        let {gtp,odds,checked,ostatus}=this.props;
        odds=Commen.save_float(Commen.handleOdds(odds,gtp),3);
        if(isNaN(odds)){
            odds='';
        }
        let class_str=''
        if(checked){
            class_str='banner_bet_checked'
        }
        return(
            <p className={`nb_teambleft ${class_str}`} ostatus={ostatus} onClick={this.clickBet}>{odds}</p>
        )
    }
}




class BannerItem_bet extends Component{
    render(){
        // let dateStr = format(stm, 'MM/dd HH:mm');
        console.log(this.props)
        console.log('这里是banner')

        let {rn,stm,htn,atn,ovalue,options,gtp}=this.props.data;
        return(
            <div className="nb_navlipage">
                <p className="nb_navtit">
                    <span className="fl">{rn}</span>
                    <span className="fr">
                        {format(stm, 'yy/MM/dd HH:mm')}
                    </span>
                </p>
                <div className="nb_team">
                    <p className="nb_teamp">
                        <span>{htn}</span>
                    </p>
                    <span className="nb_vs">VS</span>
                    <p className="nb_teamp">
                        <span>{atn}</span>
                    </p>
                </div>
                <div className="nb_team nb_teamb">
                    {options.map((item,index)=><BetItemContainer oid={item.oid} key={item.oid}><BannerOdds key={item.oid} gtp={gtp} {...item}/></BetItemContainer>)}
                    <span className="nb_teambcenter">{Commen.handleOvalue(ovalue)}</span>
                </div>
            </div>
        )
    }
}
export {BannerItem_bet}