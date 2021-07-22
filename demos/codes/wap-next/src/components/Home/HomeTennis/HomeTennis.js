import React,{Component} from 'react';
import HomeRace from '../HomeRace/HomeRace';
import SportType from '../SportType/SportType';
import './homeTennis.css';
class HomeTennis extends Component{

    render(){


        const sportsType={
            text:'热门网球'
        };
        const raceTypeItems=['局数让分','局数大小'];
        let {gpt,races}=this.props;
        return(
                        <div className={'nb_home_tennis'}>
                        <SportType sportsType={sportsType}/>
                            {races.map((race,index)=><HomeRace
                                {...race} key={race.rid} gpt={gpt} sno={12} raceTypeItems={raceTypeItems}
                            />)}
        

        
             </div>
        )
    }

}

export default HomeTennis