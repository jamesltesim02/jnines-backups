import React,{Component} from 'react';
import Header from '../common/Header/Header';
import {SportsPannel} from '../common/SportsPannel/SportsPannel';
import Banner from '../common/Banner/Banner';
import './home.css';
import RacePannel from "../common/RacePannel/RacePannel";
import Notice from "../common/Notice/Notice";
import HomeMatch from "./HomeMatch/HomeMatch";

import Tabbar from "../common/Tabbar/Tabbar";

class Home extends Component{

    constructor(props){

        super(props)
        this.state={
            showMore:false
        };


        this.hideMore=this.hideMore.bind(this)
    }


    /*
    * 隐藏更多菜单
    * */
    hideMore(e){
        this.setState({
            showMore:false
        })
    }


    render(){
        const title='体育投注';
        let {match}=this.props;
        console.log(this.props);
        let showMore=this.state.showMore;
        return(
            <div className={'nb_home'} style={{width:'100%',height:'100%'}} onClick={this.hideMore}>
                <div className={'nb_fixed_header_wrap'}>
                    <Header title={title} showMore={showMore} more_flag={true}/>
                    <SportsPannel match={match}/>
                </div>
                <div className={'nb_home_match_wrap'}>
                    <div className={'nb_home_scroll'}>
                        <div className={'nb_banner_racePannel'}>
                            <Banner/>
                            <RacePannel/>
                            <Notice/>
                        </div>
                        <div className={'nb_homeMatch_wrap'}>
                            <HomeMatch {...this.props}/>
                        </div>
                    </div>
                </div>
                <Tabbar/>
            </div>
        )
    }
}
export default Home