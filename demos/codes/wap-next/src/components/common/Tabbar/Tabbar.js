import React,{Component} from 'react';

import {NavLink} from 'react-router-dom'

import './Tabbar.css';

import Homeicon from '@/components/common/icons/Homeicon/Homeicon';
import Rollingicon from '@/components/common/icons/Rollingicon/Rollingicon';
import Todayicon from '@/components/common/icons/Todayicon/Todayicon';
import Earlyicon from '@/components/common/icons/Earlyicon/Earlyicon';
import Dingdanicon from '@/components/common/icons/Dingdanicon/Dingdanicon';
import BettingNumber from '@/components/Bet/BettingNumber'


class Tabbar extends Component{


    // constructor(){
    //     super();
    //     this.handleActive=this.handleActive.bind(this)
    // }




    render(){
        return(
            <div className={'nb_fixed_tabbar'}>
                <ul className={'nb_tabbar_wrap'}>
                    <li>
                        <NavLink to={{
                            pathname:'/'
                        }} exact activeClassName='active'>
                            <p><Homeicon className="nb_icon"/></p> 
                            首页
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={{
                            pathname:'/list/time/live',
                            search:'ttp=1'
                        }}>
                            <p><Rollingicon className="nb_icon"/></p> 
                            滚球
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={{
                            pathname:'/list/time/today',
                            search:'ttp=2'
                        }}>
                            <p><Todayicon  className="nb_icon"/></p> 
                            今日
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={{
                            pathname:'/list/time/early',
                            search:'ttp=3'
                        }}>
                            <p><Earlyicon className="nb_icon"/></p> 
                            早盘
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/bet">
                            <p><Dingdanicon className="nb_icon"/></p> 
                            投注单
                        </NavLink>
                        <BettingNumber/>
                    </li>
                </ul>
            </div>
        )
    }
}
export  default Tabbar
