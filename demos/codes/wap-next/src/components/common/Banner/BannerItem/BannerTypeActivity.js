import React,{Component} from 'react';
import {BannerItem_bet} from "./BannerItem_bet/BannerItem_bet";
import {BannerItem_background} from "./BannerItem_background/BannerItem_background";
import '../banner.css';

class BannerTypeActivity extends Component{
    render(){

        let {type,backgroundImg,backgroundColor}=this.props;

        return(
            <li>
                <a href='./sss'>
                    <BannerItem_background backgroundColor={backgroundColor} backgroundImg={backgroundImg}/>
                </a>
            </li>
        )
    }
}
export {BannerTypeActivity}
