import React,{Component} from 'react';
import './ConcedeScorefttiti.css'
import ConcedeSoretititem from '@/components/common/ConcedeSoretititem/ConcedeSoretititem';
class ConcedeScorefttiti extends Component{
    render(){
        let player=['全场'];
        return(
            <div className="nb_ConcedeScoretitbox">
                <ConcedeSoretititem player={player}/>
            </div>
        )
    }
}
export default ConcedeScorefttiti
