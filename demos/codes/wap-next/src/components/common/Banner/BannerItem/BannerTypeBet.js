import React,{Component} from 'react';
import {BannerItem_bet} from "./BannerItem_bet/BannerItem_bet";
import {BannerItem_background} from "./BannerItem_background/BannerItem_background";
import '../banner.css';
import {NavLink} from 'react-router-dom'
class BannerTypeBet extends Component{
    render(){

        let {type,backgroundImg,backgroundColor,data}=this.props;

        let {mid}=data;
        return(
            <li>
                {/*<NavLink to={{*/}
                    // pathname:'/new/matchDetail/:mid'
                    pathname:`/new/matchDetail/:${mid}`
                // }}>
                    <BannerItem_background backgroundColor={backgroundColor} backgroundImg={backgroundImg}/>
                    <BannerItem_bet {...this.props}/>
                {/*</NavLink>*/}

            </li>


        )
    }
}
export {BannerTypeBet}
