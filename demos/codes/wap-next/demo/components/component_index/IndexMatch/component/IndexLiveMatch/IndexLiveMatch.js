import React,{Component} from 'react';
import TtpTittle from '../../../TtpTittle/component/TtpTittle';

import IndexRace from "../IndexRace";
class IndexLiveMatch extends Component{

    render(){
        return(
            <div id={'nb_live'}>
                <TtpTittle ttpName={'滚球'}/>
                {this.props.live.map((race,index)=><IndexRace
                    race={race} key={index}
                />)}
            </div>
        )
    }
}
export default IndexLiveMatch