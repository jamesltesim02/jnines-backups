import React,{Component} from 'react';

import FootballIcon from '@/components/common/icons/FootballIcon/FootballIcon';
import BasketballIcon from '@/components/common/icons/BasketballIcon/BasketballIcon';
import TennisIcon from '@/components/common/icons/TennisIcon/TennisIcon';
import NBBase from '../../../assets/js/base'
class SportItem extends Component{

    constructor(){
        super();
        this.selectSno=this.selectSno.bind(this);
    }
    selectSno(e){
        let sno=e.target.parentNode.getAttribute('data-sno');
        this.props.selectSno(sno)
    }
    render(){
        let {sno,component,currentSno}=this.props;

        let class_str='';
        if(sno==currentSno){
            class_str='nb_curretbd'
        }
        return(
            <a className={class_str} data-sno={sno} onClick={this.selectSno}>{component}</a>
        )
    }



}
class TtpSportPannel extends Component{


    constructor(){
        super();
        this.selectSno=this.selectSno.bind(this);
        this.snoArr=[
            {
                sno:10,
                component:<FootballIcon/>
            }, {
                sno:11,
                component:<BasketballIcon/>
            }, {
                sno:12,
                component:<TennisIcon/>
            },
        ];
        this.state={
            currentSno:this.snoArr[0].sno
        }
    }

    selectSno(sno){
        this.props.selectSno(sno);
        this.setState({
            currentSno:sno
        })
    }
    render(){



        return(
            <div className={'nb_fixed_sport'}>
                {this.snoArr.map((item,index)=><SportItem currentSno={this.state.currentSno} selectSno={this.selectSno} key={Math.random()} {...item}/>)}
            </div>
        )
    }
}
export {TtpSportPannel}