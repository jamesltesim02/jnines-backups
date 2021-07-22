import React, {Component} from 'react';
import './MatchItem.css';
import {Commen} from '../../../assets/js/commenFunc';
import NBBase from '../../../assets/js/base';

import {Score, Time, Team, VideoIco, GtpNum, Ovalue, Odds} from '../../common/ScoreTimeTeam/ScoreTimeTeam';
import {Openicon} from '@/components/common/icons/Openicon/Openicon';
import {NavLink} from 'react-router-dom';
import AdditionBetItems from '../AdditionBetItems/AdditionBetItems';
import {Gtp16, Gtp18} from "../../common/ScoreTimeTeam/ScoreTimeTeam";
import format from 'simple-date-format';
import BetItemContainer from '@/components/Bet/BetItemContainer';

class MatchItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddtion: false,
        };


        this.getAddtionInfo=this.getAddtionInfo.bind(this);
        this.mid = null;
    }

    /*
    * 点击展开附加盘口,从本地存储中去附加盘口信息
    * */
    getAddtionInfo(mid) {
        this.mid = mid;
        this.setState({
            showAddtion: !this.state.showAddtion,
        });
    }


    render() {
        let {location} = this.props;
        let addtionItems = [];
        let this_addtionItem = [];
        if (location.pathname === '/') {
            addtionItems = JSON.parse(localStorage.getItem(NBBase.home_addtionBetItems));
        }
        else {
            addtionItems = JSON.parse(localStorage.getItem(NBBase.list_addtionBetItems));

            // this_addtionItem = addtionItems.filter((item, index) => item.mid === mid)[0];//该场比赛的附加盘
        }
        if(addtionItems){
            this_addtionItem = addtionItems.filter((item, index) => item.mid === this.mid)[0];//该场比赛的附加盘
        }

        let {games, gpt, sno, goal, stm, videoOn, gtotal, atn, htn, mid} = this.props;
        let goal01, goal02;
        if (goal) {
            goal01 = goal.split(':')[0];
            goal02 = goal.split(':')[1];
        }
        let dateStr = format(stm, 'MM/dd HH:mm');
        let gtp16_obj = games.filter(function (item, index) {
            return item.gtp === 16
        });
        let handle_16 = gtp16_obj.map(function (item, index) {
            if (item.isFav) {
                item.options.map(function (x, y) {
                    if (/^\-/.test(item.ovalue.toString())) {
                        if (x.on == 2) {
                            x.ovalue = Commen.handleOvalue('+' + Math.abs(+item.ovalue))
                        }
                        else {
                            x.ovalue = Commen.handleOvalue(item.ovalue);
                        }

                    }
                    else {
                        if (x.on == 2) {
                            x.ovalue = Commen.handleOvalue('-' + Math.abs(+item.ovalue))
                        }
                        else {
                            x.ovalue = Commen.handleOvalue('+' + item.ovalue);
                        }
                    }
                    x.odds = Commen.save_float(Commen.handleOdds(x.odds, item.gtp), 3)
                });
                return item
            }
        });
        let handle_16_last = handle_16.filter(function (item, index) {
            if (item) {
                return item.gtp
            }
        });
        let gtp18_obj = games.filter(function (item, index) {
            return item.gtp === 18;
        });
        let handle_18 = gtp18_obj.filter(function (item, index) {
            if (item.isFav) {
                return item
            }
        });
        if (!handle_16_last.length) {//没有主盘口时填充数据
            handle_16_last = [
                {
                    options: [
                        {
                            oid: Math.random()
                        },
                        {
                            oid: Math.random()
                        }
                    ]
                }
            ]
        }
        if (!handle_18.length) {//没有主盘口时填充数据
            handle_18 = [
                {
                    options: [
                        {
                            oid: Math.random()
                        },
                        {
                            oid: Math.random()
                        }
                    ]
                }
            ]
        }
        return (
            <div className={'nb_home_team_gtp'}>

                <div className={'nb_main_betItems'}>
                    <div className={'nb_home_team_wrap'}>
                        <NavLink to={`/new/matchDetail/${mid}`}>
                            <div className={'nb_homeTeam'}>
                                {typeof goal01 === 'string' ? <Score score={goal01}/> : null}
                                <Team team={htn}/>
                            </div>
                            <div className={'nb_time_wrap'}>
                                {videoOn ? <VideoIco/> : null}
                                <Time time={dateStr}/>
                                <GtpNum gtotal={gtotal}/>
                            </div>
                            <div className={'nb_awayTeam'}>
                                {typeof goal02 === 'string' ? <Score score={goal02}/> : null}
                                <Team team={atn}/>
                            </div>
                        </NavLink>
                    </div>
                    <div className={'nb_gtp16_gtp18'}>
                        <div className={'nb_gtp_16'}>
                            {handle_16_last.length ? handle_16_last[0].options.map((item, index) => <BetItemContainer
                                sno={sno} oid={item.oid} key={item.oid}><Gtp16 sno={sno} {...handle_16_last[0]} {...this.props} {...item}
                                                                      gpt={gpt}/></BetItemContainer>) : null}
                        </div>
                        <div className={'nb_gtp_18'}>
                            {handle_18.length ? handle_18[0].options.map((item, index) => <BetItemContainer
                               sno={this.props.sno} oid={item.oid} key={item.oid}><Gtp18 sno={sno} {...handle_18[0]} {...item} {...this.props}
                                                                     gpt={gpt}/></BetItemContainer>) : null}
                        </div>
                    </div>
                    <div className={'nb_match_down'}>
                        <span className={'nb_strech_match'}> <Openicon mid={mid} getAddtionInfo={this.getAddtionInfo}/>  </span>
                    </div>
                </div>
                {this.state.showAddtion?<AdditionBetItems {...this_addtionItem} {...this.props} sno={sno} gpt={gpt}/> : null}
            </div>
        )
    }
}

export {MatchItem}
