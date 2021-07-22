import React,{Component} from 'react';
import TtpTittle from '../../../TtpTittle/component/TtpTittle';

import IndexRaceContainer from "../../../../../containers/IndexRaceContainer";
class IndexEarlyMatch extends Component{



    render(){
        return(

            <div id={'nb_early'}>
                <TtpTittle ttpName={'早盘'}/>


                {this.props.early.map((race,index)=><IndexRaceContainer
                    race={race} key={race.rid}
                />)}
            </div>
        )
    }
}
export default IndexEarlyMatch