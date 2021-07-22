import React, {Component} from 'react';
import './SelectLeage.css';
import NBBase from '../../../assets/js/base'
import {NavLink} from 'react-router-dom'


import {RaceGroupWrap} from "@/components/common/SelectLeage/RaceGroup/RaceGroup";


class RaceLetter extends Component {
    render() {
        let {py}=this.props;
        return (
            <p>{py}</p>
        )
    }
}


class SelectLeage extends Component {


    constructor(){
        super();
        this.selectedRids=[];//选中的联赛
        this.completeSelectRace=this.completeSelectRace.bind(this);
        this.resetSelectRace=this.resetSelectRace.bind(this);
        this.hideSelectRace=this.hideSelectRace.bind(this);
    }


    /*
    * 点击重置
    * */
    resetSelectRace(e){
        this.selectedRids=[];
        this.props.handleSelectedRids(this.selectedRids.join(','));
        localStorage.setItem(NBBase.has_selected_race,JSON.stringify(this.selectedRids));
        e.stopPropagation();
    }

    /*
    * 点击完成
    * */

    completeSelectRace(e){
        if(!this.selectedRids.length){
            console.log('请选择联赛');
            e.stopPropagation();
            return
        }
        this.props.handleSelectedRids(this.selectedRids.join(','));
        localStorage.setItem(NBBase.has_selected_race,JSON.stringify(this.selectedRids));
        e.stopPropagation();
    }


    /*
    * 接收选中的rid
    *
    * */
    handleSelectedRids(rid){
        this.selectedRids.push(rid);
    }



    /*
    * 点击空白处隐藏选择联赛框
    * */
    hideSelectRace(e){

        console.log(e.target.className)
        if(e.target.className==='nb_two_propupsbox'){
            this.props.handleHideRace();
            console.log('隐藏联赛框')
        }



    }
    render() {
        let {raceFirstLetter}=this.props;
        return (
            <div className={'nb_two_propupsbox'} onClick={this.hideSelectRace}>
                <div className={'nb_two_propupspage'}>
                    <div className={'nb_two_propupspagehd'}>
                        选择联赛
                    </div>
                    <div className={'nb_two_propupspagect'}>
                        <div className={'nb_two_propupspagectl'}>

                            {raceFirstLetter.map((item,index)=><RaceGroupWrap selectedRids={this.selectedRids} handleSelectedRids={this.handleSelectedRids.bind(this)} {...item} key={Math.random()}/>)}


                        </div>
                        <div className={'nb_two_propupspagectr'}>
                            <div className='nb_two_propupspagep'>
                                {raceFirstLetter.map((item,index)=><RaceLetter {...item} key={Math.random()}/>)}
                            </div>
                        </div>
                    </div>
                    <div className={'nb_two_propupspageft'}>
                        <span className="active" onClick={this.resetSelectRace} >重置</span>
                        <span onClick={this.completeSelectRace}>完成</span>
                    </div>
                </div>
            </div>
        )
    }
}

export {SelectLeage}
