import React,{Component} from 'react';
import HomeRace from '../HomeRace/HomeRace';
import SportType from '../SportType/SportType';
import './HomeFootBall.css';


class HomeFootBall extends Component{

    render(){

        const sportsType={
            type:10,
            text:'热门足球'
        };
        const raceTypeItems=['全场让球','全场大小'];
       let {gpt,races,location}=this.props;
        return(
            <div className={'nb_home_football'}>
              
                <SportType sportsType={sportsType}/>
                {races.map((race,index)=><HomeRace
                    {...race} key={race.rid} location={location} gpt={gpt} sno={10} raceTypeItems={raceTypeItems}
                />)}



            </div>
        )
    }

}

export default HomeFootBall