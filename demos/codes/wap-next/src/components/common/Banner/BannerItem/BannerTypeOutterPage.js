import React,{Component} from 'react';
import {BannerItem_bet} from "./BannerItem_bet/BannerItem_bet";
import {BannerItem_background} from "./BannerItem_background/BannerItem_background";
import '../banner.css';
import {NavLink} from 'react-router-dom'
class BannerTypeOutterPage extends Component{

    constructor(props){
        super(props);
        let {url}=this.props;
        this.linkOut=this.linkOut.bind(this,url);
    }
    linkOut(url){
        window.open(url,"_blank")
    }
    render(){

        let {type,backgroundImg,backgroundColor}=this.props;

        console.log(this.props)

        return(
            <li>
                <a onClick={this.linkOut}>
                    <BannerItem_background backgroundColor={backgroundColor} backgroundImg={backgroundImg}/>
                </a>
            </li>
        )
    }
}
export {BannerTypeOutterPage}
