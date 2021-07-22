import React,{Component} from 'react';
import '../../banner.css'
class BannerItem_background extends Component{


    render(){
        let {backgroundImg,backgroundColor}=this.props;
        return(
            <div className="nb_navlibg" style={{backgroundImage:`url(${backgroundImg})`,backgroundColor:backgroundColor}}></div>
        )
    }

}
export {BannerItem_background}