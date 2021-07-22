import React,{Component} from 'react';
import './WinAndLose.css';
import {Commen} from "../../../../assets/js/commenFunc";
import BetItemContainer from '@/components/Bet/BetItemContainer';
class WinAndLose_single extends Component{
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
        if(ostatus==7){
            this.props.onBetToggle({...send_obj});
        }

    }
    render(){
        let {on,odds,checked,onBetToggle = (data)=>{}}=this.props;
        odds=Commen.save_float(odds,2);
        let  addclass='';

        if(checked){
            addclass='nb_curret';
        }
        return(
            <div className={`nb_OverallItemspage ${addclass}`} onClick={this.clickBet}>
                <p>{on}</p>
                <p>{odds}</p>
            </div>
        )
    }
}
class WinAndLose extends Component{
    render(){
        console.log(this.props)
        let {options,sno}=this.props;
        return(
            <div className="nb_Overalltabelbox">
                <div className="nb_Overalltit">
                    胜负
                </div>
                <div className="nb_OverallItemspagebox">
                    {options.map((item,index)=><BetItemContainer sno={sno} oid={item.oid} key={item.oid}><WinAndLose_single {...item} {...this.props}/></BetItemContainer>)}
                </div>

            </div>
        )
    }
}
export {WinAndLose}