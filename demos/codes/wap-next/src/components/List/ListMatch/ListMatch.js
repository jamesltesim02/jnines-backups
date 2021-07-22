import React,{Component} from 'react';
import ListRace from '../ListRace/ListRace';



class ListMatch extends Component{
    render(){

        let {sno,races,location}=this.props;
        const racePlayerObj={
            10:['全场让球','全场大小'],
            11:['全场让球','全场大小'],
            12:['局数让球','局数大小'],
        };
        const racePosition='nb_raceName_left';
        let raceTypeItems=racePlayerObj[sno];
        return(
            <div>

                {races.map((item,index)=><ListRace key={item.rid} location={location} {...item} raceTypeItems={raceTypeItems} racePosition={racePosition}/>)}
            </div>


        )
    }
}
export default ListMatch