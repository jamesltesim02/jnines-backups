import React, {Component} from 'react';
import {SelectLeage} from "@/components/common/SelectLeage/SelectLeage";
import {Commen} from "@/assets/js/commenFunc";
import {connect} from "react-redux";
import {listByTimeReducers} from "@/reducers/listByTimeReducer";
class SelectLeageContainer extends Component {

    constructor(){
        super();
        this.state={
            raceFirstLetter:[],

        };
        this.handleSelectedRids=this.handleSelectedRids.bind(this);
        this.handleHideRace=this.handleHideRace.bind(this);
    }

    componentDidMount() {

        let self=this;
        let {match}=this.props;
        let url='gbtime';
        let time_flag=true;
        if(match.url.indexOf('sport')!=-1){
            url='gbsport';
            time_flag=false;
        }
        Commen.ajax({
            url: url,
            data: {
                sno:self.props.sno,
                ttp: self.props.ttp
            },
            success: function (res) {
                if(res.result===200){
                    if(res.data&&res.data.length){
                        let target_data=res.data.filter(function (item,index) {
                            console.log(time_flag)
                            if(time_flag){
                                return item.sno==self.props.sno;
                            }
                            else{
                                if(self.props.ttp===''){

                                    return item
                                }
                                else{
                                    return item.ttp==self.props.ttp;
                                }
                            }
                        });
                        console.log(target_data);
                        self.handleRaceType(target_data)
                    }
                }
            }
        })
    }


    /*
    * 处理拿到联赛数据并分组
    * */
    handleRaceType(data){
        if(data.length){
            let {groups,sno}=data[0];
            let race_firstLetter=[];
            let race_firstLetter_ascll=[];
            let race_all=[];
            for(let i=0;i<groups.length;i++){
                let races_len=groups[i].races.length;
                for(let j=0;j<races_len;j++){
                    race_firstLetter.push(groups[i].races[j].py.charAt(0).toUpperCase());
                    race_firstLetter_ascll.push(groups[i].races[j].py.charAt(0).toUpperCase().charCodeAt());
                    race_all.push(groups[i].races[j]);
                }
            }
            race_firstLetter_ascll=race_firstLetter_ascll.filter(function (item,index) {
                return !isNaN(item)
            }).sort(function (a,b) {
                return a-b;
            });
            let letter_sort_arr=Array.from(new Set(race_firstLetter_ascll));
            let last_arr=[];
            letter_sort_arr.map(function (item,index) {
                let obj={
                    py:String.fromCharCode(item),
                    races:[]
                };
                race_all.filter(function (x,y) {
                    if(x.py.charAt(0).toUpperCase().charCodeAt()===item){
                        obj.races.push(x)
                    }
                });
                last_arr.push(obj)
            });
            this.setState({
                raceFirstLetter:last_arr
            })
        }
    }



    /*
    * 点击联赛框空白部分隐藏联赛框
    * */

    handleHideRace(){

        this.props.handleHideRace()

    }

    /*
    * 接收选择联赛的rid
    * */
    handleSelectedRids(ridStr){
        this.props.handleSelectedRids(ridStr)
    }

    render() {
        return (
            <SelectLeage handleHideRace={this.handleHideRace} handleSelectedRids={this.handleSelectedRids} raceFirstLetter={this.state.raceFirstLetter} />
        )
    }
}


export {SelectLeageContainer}
