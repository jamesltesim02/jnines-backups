import React,{Component} from 'react';
import './SportType.css';
// import FootballIcon from '@/components/common/icons/FootballIcon/FootballIcon';
import FootballIcon from '@/components/common/icons/FootballIcon/FootballIcon';
import Basketballicon from '@/components/common/icons/BasketballIcon/BasketballIcon';
import TennisIcon from '@/components/common/icons/TennisIcon/TennisIcon';

class SportType extends Component{
    render(){


        let {type}=this.props.sportsType;

        return(
            <div className={'nb_home_sportsType'}>

              {type===10?<FootballIcon />:(type===11?<Basketballicon />:<TennisIcon/>)}

               <span>{this.props.sportsType.text}</span>

            </div>
        )
    }
}
export default SportType