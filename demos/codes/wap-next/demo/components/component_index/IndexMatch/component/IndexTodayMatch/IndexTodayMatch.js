import React,{Component} from 'react';
import TtpTittle from '../../../TtpTittle/component/TtpTittle';
import RaceTittle from '../../../RaceTittle/component/RaceTittle';
import MatchItemToday from '../../../jsx/MatchListToday';
class IndexTodayMatch extends Component{
    render(){
        return(
            <div id={'nb_today'}>
                <TtpTittle ttpName={'今日'}/>
                <RaceTittle/>
                <MatchItemToday/>
            </div>
        )
    }
}
export default IndexTodayMatch