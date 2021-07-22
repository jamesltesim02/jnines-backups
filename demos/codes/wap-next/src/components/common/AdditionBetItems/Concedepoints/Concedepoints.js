import React,{Component} from 'react';
import './Concedepoints.css'
class Concedepoints extends Component{
    render(){
        return(
            <div>
               <ul className="nb_Concedepointsul">
                 <li className="nb_Concedepointsli fl color_30">全场让球</li>
                 <li className="nb_Concedepointsli fl color_30">全场大小</li>
                 <li className="nb_Concedepointsli fl color_30">上半让球</li>
                 <li className="nb_Concedepointsli fl color_30">上半大小</li>
               </ul>  
            </div>
        )
    }
}
export default Concedepoints