import React,{Component} from 'react';
import {MatchItem} from '../../common/MatchItem/MatchItem';
import RaceType from '../../common/RaceType/RaceType';
import AdditionBetItems from '@/components/common/AdditionBetItems/AdditionBetItems';


// import './HomeRace.css';

class HomeRace extends Component{
    render(){

        let {matchs,rn,gpt,sno,raceTypeItems,location}=this.props;

        // let {gpt,sno,raceTypeItems}=this.props;
        const race_position='nb_raceName_center';
        return(
            <div>
                <RaceType raceName={rn} racePosition={race_position} sno={sno} raceTypeItems={raceTypeItems}/>
                <div className="nb_rectanglebox">
                    {/*{matchs.map((match,index)=><MatchItem sno={sno} gpt={gpt} match={match} key={match.mid}/>)}*/}
                    {matchs.map((match,index)=><MatchItem sno={sno} gpt={gpt} location={location} {...match} key={match.mid}/>)}
                </div>
            </div>
        )
    }
}
export default HomeRace