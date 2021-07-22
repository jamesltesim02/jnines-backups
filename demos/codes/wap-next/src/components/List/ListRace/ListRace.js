import React,{Component} from 'react';
import RaceType from '../../common/RaceType/RaceType';
import {MatchItem} from '../../common/MatchItem/MatchItem'


class ListRace extends Component{
    render(){
        let {racePosition,raceName,raceTypeItems,sno,rn,matchs,location}=this.props;
        let gpt=1;
        return(
            <div>
                <RaceType raceName={rn} racePosition={racePosition} sno={sno} raceTypeItems={raceTypeItems}/>
                {matchs.map((item,index)=><MatchItem sno={sno} location={location} gpt={gpt} {...item} key={item.mid}/>)}
            </div>
        )
    }
}
export default ListRace