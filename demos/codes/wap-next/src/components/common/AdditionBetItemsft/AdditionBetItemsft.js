import React,{Component} from 'react';
import './AdditionBetItemsft.css';
import ConcedeScoreftbox from './ConcedeScoreftbox/ConcedeScoreftbox';
import ConcedeScorefttiti from './ConcedeScorefttiti/ConcedeScorefttiti';
class AdditionBetItemsft extends Component{
    render(){
        let player='全场';
        return(
                <div className="nb_AdditionBetItems nb_AdditionBetItemsft">
                    <ConcedeScorefttiti player={player}/>
                    <ConcedeScoreftbox/>
                    <ConcedeScoreftbox/>
                    <ConcedeScoreftbox/>
                </div>
        )
    }
}
export default AdditionBetItemsft