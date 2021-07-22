import React,{Component} from 'react';
import IndexMatch from '../components/component_index/IndexMatch/component/IndexMatch';
import Header from '../components/component_index/Header/component/Header';
import Pannel from '../components/component_index/Pannel/component/Pannel';
import Commen from "../assets/js/commenFunc";
import NBBase from '../assets/js/base.js';
import {indexMatchReducers} from '../reducers/indexMatch';

import {connect} from "react-redux";
class IndexMatchContainer extends Component{


    constructor(){
        super();

        this.onClick=this.changeLanguage.bind(this);

    }

    componentDidMount(){
        this.getIndexData();


    }

    getIndexData(){
        let that=this;
        let obj=null;
        Commen.ajax({
            async:false,
            url:NBServer.p_s1+'ghomematch',
            data:{
                hot: 1,
                gtp: '16,18',
                level: 2,
                bstage: '0,1000,2000',
                bcontent: 1,
                sortBy: 'sortByTime'
            },
            success:function (res) {
                let match_obj={
                    'live':[],
                    'today':[],
                    'early':[],
                };
                let rid_live_arr=[],rid_today_arr=[],rid_early_arr=[];
                if(res.result===200&&res.data.sports&&res.data.sports.length){
                    let sports=res.data.sports;
                    let sportLen=sports.length;

                    for(let i=0;i<sportLen;i++){

                        let races=sports[i].races;

                        let racesLen=races.length;
                        for(let j=0;j<racesLen;j++){

                            let matches=races[j].matchs;
                            let matchesLen=matches.length;
                            // rid_arr.push(races[j].rid);

                            for(let k=0;k<matchesLen;k++){

                                matches[k].rid=races[j].rid;
                                matches[k].rn=races[j].rn;
                                matches[k].sn=sports[i].sn;
                                matches[k].sno=sports[i].sno;
                                if(matches[k].mstate===1){
                                    rid_live_arr.push(races[j].rid);
                                    match_obj.live.push(matches[k]);
                                }
                                else if(matches[k].mstate===-1){
                                    rid_early_arr.push(races[j].rid);
                                    match_obj.early.push(matches[k]);
                                }
                                else{
                                    rid_today_arr.push(races[j].rid);
                                    match_obj.today.push(matches[k]);
                                }

                            }
                        }

                    }
                }
                let {live:liveMatch,today:todayMatch,early:earlyMatch}=match_obj;
                let unique_rid_live_arr=[...new Set(rid_live_arr)];
                let unique_rid_today_arr=[...new Set(rid_today_arr)];
                let unique_rid_early_arr=[...new Set(rid_early_arr)];
                let liveMatch_obj= that.handleMatchData(liveMatch,unique_rid_live_arr);
                let todayMatch_obj= that.handleMatchData(todayMatch,unique_rid_today_arr);
                let earlyMatch_obj= that.handleMatchData(earlyMatch,unique_rid_early_arr);

                obj={
                    live:liveMatch_obj,
                    today:todayMatch_obj,
                    early:earlyMatch_obj,
                    showEarly:unique_rid_early_arr.length?true:false,
                    showLive:unique_rid_live_arr.length?true:false,
                    showToday:unique_rid_today_arr.length?true:false,
                    // language:'zh-cn'
                };
                let language_active=JSON.parse(localStorage.getItem(NBBase.lan_active));

               that.props.initMatches({
                   ...obj,
                   language:language_active
               });
            }
        });




    }

    handleMatchData(matchArr,ridArr){

        let same_league=[];
        if(ridArr.length){
            ridArr.forEach(function (a,b) {
                let same_rid={
                    rid:a,
                    matches:[]
                };
                if(matchArr.length){
                    matchArr.forEach(function (c,d) {

                        if(a==c.rid){

                            same_rid.sn=c.sn;
                            same_rid.sno=c.sno;
                            same_rid.rn=c.rn;
                            same_rid.matches.push(c)
                        }

                    })
                }
                same_league.push(same_rid);
            });
        }
        return same_league
    }



    changeLanguage(){
        let that=this;

        let lanuage_en=localStorage.getItem(NBBase.lan_en);
        if(!lanuage_en){
            Commen.loadFileList('language-en-us.js', NBServer.p_stm, NBServer.p_m_v, function () {
                let plate_settings=JSON.parse(localStorage.getItem(NBBase.platform_settings));
                plate_settings.nb_language='en-us';
                localStorage.setItem(NBBase.lan_en,JSON.stringify(lan_en));
                localStorage.setItem(NBBase.lan_active,JSON.stringify(lan_en));
                localStorage.setItem(NBBase.platform_settings,JSON.stringify(plate_settings));
                that.props.changeLanguage({
                    language:lan_en
                })
            })
        }
        else{
            let language=JSON.parse(lanuage_en);
            that.props.changeLanguage({
                language:language
            })

        }




    }

    render(){
        let language=this.props.indexReducers.language;
        return(
            <div>
                <div className={'headerAndPannel'} onClick={this.onClick} style={{background: 'linear-gradient(135deg,#601fff,#35b9df)'}}>
                    <Header/>
                    <Pannel language={language}/>
                </div>
                <IndexMatch {...this.props.indexReducers}/>
                {/*<RaceTittle/>*/}
            </div>

        )
    }
}



const mapStateToProps = (state) => {
    return state
};

const mapDispatchToProps = (dispatch) => {
    return {
        initMatches: (matchObj) => {
            dispatch(indexMatchReducers.createActions.initMatches(matchObj))
        },
        changeLanguage: (languageObj) => {
            dispatch(indexMatchReducers.createActions.changeLanguage(languageObj))
        },

    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IndexMatchContainer)




// export default IndexContainer