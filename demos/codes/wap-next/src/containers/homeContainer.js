import React,{Component} from 'react';
import Home from '../components/Home//Home';

import {Commen} from "../assets/js/commenFunc";

import {homeReducers} from '../reducers/homeMatchReducer';

import {connect} from "react-redux";
class HomeContainer extends Component{


    constructor(){
        super();
    }


    /*
    * 获取主要盘口
    * */
    getMainBet(){
        let self=this;
        Commen.getIndexData({
            url:'index/gHotIndex',
            gtp:'16,18',
            bstage:'0,1000,2000',
            page:1,
            limit:500,
            sortBy:'sortByTime'
        },function (obj) {


            self.props.initMatches({
                ...obj
            });
            setTimeout(function () {

                /*
                * 获取主盘口之后请求当前页所在附加盘口
                * */
                Commen.initStrechMatch({
                    url:'index/gAttachIndex',
                    page:1,
                    limit:500,
                    sortBy:'sortByTime',
                    storeName:'home'
                })
            },100);
        });
    }






    componentDidMount(){
        this.getMainBet()
    }


    render(){

        let {match,location,history}=this.props;
        return(
            <div style={{width:'100%',height:'100%'}}>

                <Home {...this.props.homeData} history={history} location={location} match={match} />
            </div>

        )
    }
}



const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        /*
        * 初始化首页主盘接口数据
        * */
        initMatches: (matchObj) => {
            dispatch(homeReducers.createActions.initMatches(matchObj));


        },
        /*
        * 初始化首页展开接口数据
        * */
        initStrechMatch:(data)=>{
            dispatch(homeReducers.createActions.initStrechMatch(data));
        },
        // changeLanguage: (languageObj) => {
        //     dispatch(homeReducers.createActions.changeLanguage(languageObj));
        // },

    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer)




// export default IndexContainer