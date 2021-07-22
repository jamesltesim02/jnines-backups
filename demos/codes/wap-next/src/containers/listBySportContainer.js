import React,{Component} from 'react';
import {ListBySport} from "../components/List/ListBySport";
import {Commen} from "../assets/js/commenFunc";
import NBBase from '../assets/js/base.js';
import {listBySportReducers} from "../reducers/listBySportReducer";
import {SelectLeageContainer} from "@/containers/SelectLeageContainer";
import {connect} from "react-redux";
import querystring from 'querystring'
class listBySportContainer extends Component{


    constructor(props){
        super(props);


        this.handleSelectedRids=this.handleSelectedRids.bind(this);
        this.selectTtp=this.selectTtp.bind(this);
        /*
        * 初始页面对象
        * */

        let {location}=this.props;

        let search=location.search.replace('?','');
        let searchObj=querystring.parse(search);
        let{match}=this.props;
        const snoObj={
            'football':10,
            'basketball':11,
            'tennis':12
        };
        this.params={
            sno:snoObj[match.params.page],
            groupNo:'',
            rid:searchObj.rid||'',
            ttp:'',
            page:1,
            limit:20,
            sortBy:'sortByTime',
            competitorId:searchObj.competitorId||'',
            page_info:{
            },
            text:searchObj.text
        };
        let page_info=localStorage.getItem(NBBase.list_pageInfo);
        if(page_info){
            this.params.ttp=JSON.parse(page_info).ttp
        }
        localStorage.setItem(NBBase.list_pageInfo,JSON.stringify(this.params));
    }

    /*
    * 接收选择的ttp,发送action
    * */
    selectTtp(ttp){
        let obj={
            ttp:ttp
        };
        this.params.ttp=ttp;
        this.getData(obj)
    }




    /*
    * 接收rid字符串，并发送action
    * */
    handleSelectedRids(ridStr){
        this.params.rid=ridStr;
        let list_page=localStorage.getItem(NBBase.list_pageInfo);
        let ttp='';
        if(list_page){
            ttp=JSON.parse(list_page).ttp
        }
        this.getData({

            ttp:ttp,
            rid:ridStr
        });
    }

    /*
    * 组件挂载完成
    * */
    componentDidMount(){
        // let {location,match}=this.props;
        let ridStr=JSON.parse(localStorage.getItem(NBBase.has_selected_race));
        if(ridStr){
            ridStr=ridStr.join(',');
        }
        if(ridStr){
            this.params.rid=ridStr;
        }

        this.getData(this.params);
    }

    /*
       * 获取标题和ttp的值，参数为页面字符串
       * */
    getPageInfo(){
        let {location,match}=this.props;
        const titleObj=[
            {
                name:'足球',
                sno:10,
                page:'football'
            },{
                name:'篮球',
                sno:11,
                page:'basketball'
            },{
                name:'网球',
                sno:12,
                page:'tennis'
            },
        ];
        let target_tittle=titleObj.filter(function (item,index) {
            if(item.page===match.params.page){
                return item
            }
        });
        let obj={
            title:target_tittle[0].name,
            sno:target_tittle[0].sno,
        };
        return obj
    }


    /*
    * 请求列表页数据
    *
    * */
    getData(options){
        let page_info=this.getPageInfo();
        console.log(this.params)
        console.log('ddddddddddd')
        if(this.params.text){
            page_info.title=this.params.text
        }
        this.params.page_info=page_info;
        this.params.page_info.ttp=options.ttp;
        let params={
            sno:page_info.sno,
            groupNo:this.params.groupNo,
            rid:options.rid||this.params.rid,
            ttp:options.ttp||this.params.ttp,
            competitorId:options.competitorId||this.params.competitorId,
            page:1,
            limit:20,
            sortBy:'sortByTime',
        };

        let that=this;
        Commen.ajax({
            url:'index/gHotAll',
            data:params,
            success:function (res) {
                if(res.result===200&&res.data){
                    let races=[];
                    if(res.data.length){
                        races=res.data[0].races;
                        Commen.handleAddtionData(res.data,'list');
                    }
                    that.props.initMatches({
                        races,
                    });
                    console.log(that.params);
                    localStorage.setItem(NBBase.list_pageInfo,JSON.stringify(that.params));
                }
            }
        });




    }

    render(){


        let {match,listBySportData,location,history,time_flag}=this.props;
        console.log('这是足球')
        console.log(this.props)
        return(
            <div>
                <ListBySport selectTtp={this.selectTtp} history={history} time_flag={time_flag} handleSelectedRids={this.handleSelectedRids}  location={location} match={match} {...this.params.page_info} sno={this.params.sno} {...listBySportData}/>
            </div>
        )
    }
}



const mapStateToProps = (state) => {
    return state
};

const mapDispatchToProps = (dispatch) => {
    return {
        initMatches: (racesArr) => {
            dispatch(listBySportReducers.createActions.initMatches(racesArr))
        },
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(listBySportContainer)




// export default IndexContainer