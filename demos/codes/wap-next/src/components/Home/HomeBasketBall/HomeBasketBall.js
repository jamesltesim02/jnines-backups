import React,{Component} from 'react';
import HomeRace from '../HomeRace/HomeRace';
import SportType from '../SportType/SportType';
import './HomeBasketBall.css'
class HomeBasketBall extends Component{

    render(){

        
        const sportsType={
            type:11,
            text:'热门篮球'
        };
        const raceTypeItems=['全场让球','全场大小'];
        let {gpt,races}=this.props;
        return(
            <div className={'nb_home_basketball'}>
                <SportType sportsType={sportsType}/>
                {races.map((race,index)=><HomeRace
                    {...race} key={race.rid} gpt={gpt} sno={11} raceTypeItems={raceTypeItems}
                />)}
            </div>
        )
    }

}

export default HomeBasketBall