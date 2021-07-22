import React,{Component} from 'react';
import {ListByTime} from "../components/List/ListByTime";
import {Commen} from "../assets/js/commenFunc";
import NBBase from '../assets/js/base.js';
import {listByTimeReducers} from "@/reducers/listByTimeReducer";
import {SelectLeageContainer} from "@/containers/SelectLeageContainer";
import {connect} from "react-redux";
import querystring from 'querystring'
class ListByTimeContainer extends Component{


    constructor(props){
        super(props);
        console.log(this.props)

        let {location}=this.props;
        let search=location.search.replace('?','');
        console.log(search);
        let searchObj=querystring.parse(search);
        this.handleSelectedRids=this.handleSelectedRids.bind(this);
        this.selectSno=this.selectSno.bind(this);

        this.selectSno=this.selectSno.bind(this);
        /*
        * 初始页面对象
        * */

        this.params={
            sno:10,
            groupNo:'',
            rid:'',
            ttp:searchObj.ttp,
            page:1,
            limit:20,
            sortBy:'sortByTime',
            page_info:{
            }
        };
        let page_info=localStorage.getItem(NBBase.list_pageInfo);
        if(page_info){
            this.params.sno=JSON.parse(page_info).sno
        }
        localStorage.setItem(NBBase.list_pageInfo,JSON.stringify(this.params));
    }



    /*
    * 切换足球、篮球、网球
    * */
    selectSno(sno){
        if(sno!=this.params.sno){
            this.params.sno=sno;
            this.getData({
                sno:sno
            })
        }




    }



    /*
    * 接收rid字符串，并发送action
    * */
    handleSelectedRids(ridStr){
        this.params.rid=ridStr;
        let list_page=localStorage.getItem(NBBase.list_pageInfo);
        let ttp='';
        if(list_page){
            ttp=JSON.parse(list_page).ttp;
        }
        this.params.rid=ridStr;
        this.getData({
            ttp:ttp,
            rid:ridStr
        });
    }

    /*
    * 组件挂载完成
    * */
    componentDidMount(){
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
    * url变化时发送,点击sportPannel里的球类时
    * */
    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        console.log(this.props);

        let self=this;
        if (nextProps.location.pathname != this.props.location.pathname) {
            let {location,match}=nextProps;
            let search=location.search.replace('?','');
            console.log(search)
            let searchObj=querystring.parse(search);
            self.params.ttp=searchObj.ttp
            console.log(searchObj)
            this.getData({
                ttp:searchObj.ttp
            })
        }
    }


    /*
       * 获取标题和ttp的值，参数为页面字符串
       * */
    getPageInfo(){
        let self=this;
        const titleObj=[
            {
                name:'今日',
                ttp:2,
                page:'today'
            },{
                name:'早盘',
                ttp:3,
                page:'early'
            },{
                name:'滚球',
                ttp:1,
                page:'live'
            },
        ];
        let target_tittle=titleObj.filter(function (item,index) {
            if(item.ttp==self.params.ttp){
                return item
            }
        });
        let obj={
            title:target_tittle[0].name,
            ttp:target_tittle[0].ttp,
        };
        return obj
    }


    /*
    * 请求列表页数据
    *
    * */
    getData(options){

        let page_info=this.getPageInfo();
        this.params.page_info=page_info;
        // this.params.page_info.ttp=page_info.ttp;
        this.params.ttp=page_info.ttp;
        console.log(this.params);
        let params={
            sno:options.sno||this.params.sno,
            groupNo:this.params.groupNo,
            rid:options.rid||this.params.rid,
            ttp:options.ttp||page_info.ttp,
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
                        let target_races=res.data.filter((item,index)=>item.sno==that.params.sno);
                        races=target_races[0].races;
                        Commen.handleAddtionData(res.data,'list');
                    }
                    console.log(races);
                    that.props.initMatches({
                        races,
                    });
                    localStorage.setItem(NBBase.list_pageInfo,JSON.stringify(that.params));
                }
            }
        });




    }

    render(){


        let {match,listByTimeData,location,history,time_flag}=this.props;
        return(
            <div>
                <ListByTime history={history} selectSno={this.selectSno} selectSno={this.selectSno} {...this.params.page_info} handleSelectedRids={this.handleSelectedRids}  location={location} sno={this.params.sno} match={match} {...listByTimeData} />
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
            dispatch(listByTimeReducers.createActions.initMatches(racesArr))
        },
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListByTimeContainer)




// export default IndexContainer