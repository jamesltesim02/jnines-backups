import React,{Component} from 'react';
import './RaceType.css';

class RaceTypeName extends Component{
    render(){
        let {text}=this.props
        return(
            <div className={'nb_home_gtp16'}>{text}</div>
        )


    }
}

class RaceType extends Component{
    render(){
        let {racePosition,raceName,raceTypeItems}=this.props;
        return(
            <div className={'nb_race_title'}>
                <div className={racePosition}>
                    {raceName}
                </div>
                <div className={'nb_home_gtp'}>
                    {raceTypeItems.map((item,index)=><RaceTypeName text={item} key={Math.random()}/>)}
                </div>
            </div>
        )
    }
}
export default RaceType