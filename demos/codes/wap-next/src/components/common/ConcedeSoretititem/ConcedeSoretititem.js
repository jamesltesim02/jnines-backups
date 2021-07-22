import React,{Component} from 'react';
import './ConcedeSoretititem.css'
class ConcedeSoretititem extends Component{
    render(){
        let player=this.props.player;
        return(
                 <div className="nb_ConcedeScoretit color_30">
                    <span>{player}</span>
                 </div>
        )
    }
}
export default ConcedeSoretititem