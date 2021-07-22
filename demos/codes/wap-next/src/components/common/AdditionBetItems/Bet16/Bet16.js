import React,{Component} from 'react';
import {Odds,Ovalue} from "../../ScoreTimeTeam/ScoreTimeTeam";
import BetItemContainer from '@/components/Bet/BetItemContainer'
class Bet16_single extends Component{
    constructor(){
        super();
        this.clickBet=this.clickBet.bind(this);
    }
    clickBet(e){
        // let {aid,atn,bcontent,bstage,gno,goal}

        let {ostatus,sno}=this.props;

        if(ostatus==7){
            this.props.onBetToggle({
                ...this.props,
                sno
            });
        }
        e.stopPropagation()
    }
    render(){
        let  addclass='';
        let {odds,ovalue,gtp,checked,quoteing,onBetToggle = (data)=>{}}=this.props;
        if(checked){
            addclass='nb_current_click';
        }
        return(
            <div className={`nb_TabelItemspage ${addclass}`} onClick={this.clickBet}>
                <Ovalue {...this.props}/>
                <Odds {...this.props} />
            </div>
        )
    }
}
class Bet16 extends Component{
    render(){
        let {options,gtp,ovalue,sno}=this.props;
        return(
            <div>
                {options.map((item,index)=><BetItemContainer sno={this.props.sno} oid={item.oid} key={item.oid}><Bet16_single ovalue={ovalue} sno={sno} gtp={gtp}{...item}/></BetItemContainer>)}
            </div>
        )
    }
}
export default Bet16