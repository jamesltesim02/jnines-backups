import React,{Component} from 'react';
import {Commen} from '../../../../assets/js/commenFunc'
class ItemWithOvalue extends Component{
    render(){

        // console.log(this.props);
        let {odds,gtp,on,ovalue}=this.props;
        odds=Commen.save_float(commen.handleOdds(odds,gtp),3);

        if(gtp===18){
            if(on==='Over'){
                ovalue='大于'+ovalue
            }
            else{
                ovalue='小于'+ovalue
            }
        }
        return(
            <div className="nb_ConcedeScoreitem">
                <p className="color_50">{ovalue}</p>
                <p>{odds}</p>
            </div>
        )
    }
}
export default ItemWithOvalue