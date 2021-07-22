import React,{Component} from 'react';
import './SportsPannel.css';

import {NavLink} from 'react-router-dom';
import FootballIcon from '@/components/common/icons/FootballIcon/FootballIcon';
import BasketballIcon from '@/components/common/icons/BasketballIcon/BasketballIcon';
import TennisIcon from '@/components/common/icons/TennisIcon/TennisIcon';

class SportsPannel extends Component{
    render(){
        let {match,location} = this.props;


        let type = '/new/list/sport';

        if(match.params.page){
            if(match.url.indexOf('time')){
                type='/list/time/'+match.params.page
            }

        }


        return(
            <div className={'nb_fixed_sport'}>
                <NavLink to={`${type}/football?sno=10`}><FootballIcon {...this.props}/></NavLink>
                <NavLink to={`${type}/basketball?sno=11`}><BasketballIcon {...this.props}/></NavLink>
                <NavLink to={`${type}/tennis?sno=12`}><TennisIcon {...this.props}/></NavLink>
            </div>
        )
    }
}
export {SportsPannel}