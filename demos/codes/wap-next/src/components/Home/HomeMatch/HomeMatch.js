import React,{Component} from 'react';
import HomeFootBall from '../HomeFootBall/HomeFootBall';
import HomeBasketBall from '../HomeBasketBall/HomeBasketBall';
import HomeTennis from '../HomeTennis/HomeTennis';
// import AjaxComponent from "../../../../demo/HigherComponnent/AjaxComponent";


class HomeMatch extends Component{

    constructor(){
        super();
        this.gpt=1;
    }
    render(){
        let{football,basketball,tennis,location,history}=this.props;
        let football_len=football.length;
        let basketball_len=basketball.length;
        let tennis_len=tennis.length;
        return(
            <div>
                {football_len?<HomeFootBall gpt={this.gpt} history={history} location={location} races={football} />:null}
                {basketball_len?<HomeBasketBall gpt={this.gpt} history={history} location={location} races={basketball}/>:null}
                {tennis_len?<HomeTennis gpt={this.gpt} history={history} location={location} races={tennis}/>:null}
            </div>
        )
    }
}


// let AjaxHomeMatch=AjaxComponent(HomeMatch,{
//     url:NBServer.p_s1+'index/gHotIndex',
//     data:{
//         lang:'zh-cn',
//         gtp:'16,18',
//         bstage:'0,1000,2000',
//         page:1,
//         limit:500,
//         sortBy:'sortByTime'
//     },
//     async:false,
//     handleData:function (res) {
//         return res.data
//     }
// })

export default HomeMatch