import React,{Component} from 'react';
import './banner.css';
import {Commen} from '../../../assets/js/commenFunc'
import {BannerTypeActivity} from "./BannerItem/BannerTypeActivity";
import {BannerTypeBet} from "./BannerItem/BannerTypeBet";
import {BannerTypeInnerPage} from "./BannerItem/BannerTypeInnerPage";
import {BannerTypeOutterPage} from "./BannerItem/BannerTypeOutterPage";
// import Swiper from 'react-id-swiper'
class Banner extends Component{
    constructor(props){
        super(props);
        this.state={
            banners:[]
        }
    }
    /*
    * 获取banner数据
    **/
    componentWillMount(){
        this.getBanner()
    }
    getBanner(){
        let self=this;
        Commen.ajax({
            url:'index/gbanner',
            data:{
                nb_sign:'nb_nb_cash'
            },
            success:function (res) {

                if(res.result===200&&res.data&&res.data.length){

                    self.setState({
                        banners:res.data
                    })

                }
            }
        })
    }
    render(){

        let {banners}=this.state;
        return(
            <div className={'nb_banner_wrap'}>
                <div className="nb_navbox">
                    <div className="nb_nav nb_navscroll">
                            <ul className="nb_navul">
                                {/*<Swiper>*/}
                                    {banners.map(function (item,index) {
                                        if(item.type===1){
                                            return <BannerTypeBet {...item} key={item.id}/>
                                        }
                                        else if(item.type===2){
                                            return <BannerTypeInnerPage {...item} key={item.id}/>
                                        }
                                        else if(item.type===3){
                                            return <BannerTypeActivity {...item} key={item.id}/>
                                        }
                                        else if(item.type===4){
                                            return <BannerTypeOutterPage {...item} key={item.id}/>
                                        }
                                    })}
                                {/*</Swiper>*/}





                            </ul>
                    </div>
                </div> 
            </div>
        )
    }
}
export  default Banner