import React,{Component} from 'react';

import RaceTittle from '../../RaceTittle/component/RaceTittle';
import MatchItemEarlyAndLive from '../../jsx/MatchItemEarlyAndLive'
class IndexRace extends Component{
    render(){

        return(
            <div className={'nb_race'}>

                <RaceTittle {...this.props.race}/>

                {this.props.race.matches.map((matchItem,index)=><MatchItemEarlyAndLive
                    {...matchItem} key={matchItem.mid}
                />)}


            </div>
        )
    }
}
export default IndexRace