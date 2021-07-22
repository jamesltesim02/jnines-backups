import React,{Component} from 'react';
import IndexLiveMatch from './IndexLiveMatch/IndexLiveMatch';
import IndexTodayMatch from './IndexTodayMatch/IndexTodayMatch';

import IndexEarlyMatch from './IndexEarlyMatch/IndexEarlyMatch';

class IndexMatch extends Component{

    constructor(props){

        super(props);

    }


    render(){
        return(
            <div className={'nb_index_match_wrap'}>
                {this.props.showLive?<IndexLiveMatch  live={this.props.live}/>:null}
                {this.props.showToday?<IndexTodayMatch today={this.props.today}/>:null}
                {this.props.showEarly?<IndexEarlyMatch early={this.props.early}/>:null}
            </div>

        )
    }


}






export default IndexMatch