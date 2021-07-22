import React,{Component} from 'react';
import '../css/MatchItemEarlyAndLive.css';
import IndexBetGtp16 from '../IndexBetGtp16/componnent/IndexBetGtp16';
import IndexBetGtp18 from '../IndexBetGtp18/component/IndexBetGtp18';
import Commen from '../../../assets/js/commenFunc';
class MatchItemEarlyAndLive extends Component{
    render(){
        return(

            <div className={'nb_matchItem_wrap'}>
                <div className={'nb_match_team'}>
                    <p className={'nb_team_score'}>
                        <span>1</span><span className={'teamName'}>{this.props.htn}</span>
                    </p>
                    <p className={'nb_match_time'}>
                        <span>{Commen.formatLongTime({
                            long_time:this.props.stm,
                            is_year:0,
                            is_second:0,
                            formart:'/'
                        })}</span>
                        <span className={'bet_item_num'}>{this.props.gtotal}</span>
                    </p>
                    <p className={'nb_team_score'}>
                        <span>1</span><span>{this.props.atn}</span>
                    </p>
                </div>
                <div className={'nb_bet_wrap'}>
                    <IndexBetGtp16 games={this.props.games}/>
                    <IndexBetGtp18/>
                </div>
            </div>
        )
    }
}
export default MatchItemEarlyAndLive;
// export  MatchTime;
// export  MatchTeamAndScore;