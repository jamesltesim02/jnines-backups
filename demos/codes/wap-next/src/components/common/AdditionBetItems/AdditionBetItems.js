import React, {Component} from 'react';
import './AdditionBetItems.css';
import Concedepoints from './Concedepoints/Concedepoints';
import {Commen} from '../../../assets/js/commenFunc'

import Player_roler from "./Player_roler/Player_roler";
import Bet16 from "./Bet16/Bet16";

import {BetStandledAll,BetStandledHalf} from "./BetStandled/BetStandled";
import {WinAndLose} from "./WinAndLose/WinAndLose";


class AdditionBetItems extends Component {

    render() {
        console.log(this.props)
        let {all_16, all_18, half_16, half_18,gpt,sno,gtp_186,match} = this.props;
        let all1x2 = this.props['1x2'];
        let half1x2 = this.props['1x2_half'];
        let betTypes_length = [];
        betTypes_length[0] = all_16.length;
        betTypes_length[1] = all_18.length;
        betTypes_length[2] = half_16.length;
        betTypes_length[3] = half_18.length;
        let sort_betTypesLength = betTypes_length.sort(function (a, b) {
            return b - a
        });
        // console.log(betTypes_length)
        let handled_all_16 = Commen.handleLetBall(all_16);
        let handled_half_16 = Commen.handleLetBall(half_16);

        let last_handled_half_16=Commen.setTwoElement(handled_half_16);
        let last_handled_all_16=Commen.setTwoElement(handled_all_16);
        let last_all_18=Commen.setTwoElement(all_18);
        let last_half_18=Commen.setTwoElement(half_18);


        /*
        * 用来存放主客的个数;
        * */
        let player_arr = [];
        let len=sort_betTypesLength[0];
        if(len>2){
            len=2
        }
        for (let j = 0; j < len; j++) {
            player_arr.push(<Player_roler key={j + 'aa'}/>)
        }

        let standAllJsx=all1x2.map((item,index)=><BetStandledAll sno={sno} {...match} {...item} key={Math.random()}/>);
        let standhalfJsx=half1x2.map((item,index)=><BetStandledHalf sno={sno} {...match} {...item} key={Math.random()}/>);
        let last_stand=standAllJsx.concat(standhalfJsx);
        return (
            <div className="nb_AdditionBetItemsbox">
                <Concedepoints/>

                <div className="nb_AdditionBetItems">
                    <div className={'nb_Tabelbox'}>
                        <div className={'nb_Tabeltit'}>
                            {player_arr}
                        </div>
                        <div className={'nb_TabelItems'}>
                            {last_handled_all_16.map((item, index) => <Bet16 sno={sno} {...match} {...item} key={Math.random()}/>)}
                        </div>
                        <div className={'nb_TabelItems'}>
                            {last_all_18.map((item, index) => <Bet16 sno={sno} {...match}{...item} ovalue={item.ovalue} key={Math.random()}/>)}
                        </div>
                        <div className={'nb_TabelItems'}>
                            {last_handled_half_16.map((item, index) => <Bet16 sno={sno} {...match} {...item} key={Math.random()}/>)}
                        </div>
                        <div className={'nb_TabelItems'}>
                            {last_half_18.map((item, index) => <Bet16 sno={sno} {...match} {...item} key={Math.random()}/>)}
                        </div>

                    </div>
                    {last_stand}
                    {sno==11||sno==12?(gtp_186.length?<WinAndLose sno={sno} {...gtp_186[0]} {...match} />:null):null}
                </div>

            </div>

        )
    }
}


export default AdditionBetItems