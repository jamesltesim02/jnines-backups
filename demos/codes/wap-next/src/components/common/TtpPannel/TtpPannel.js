import React,{Component} from 'react';
import './TtpPannel.css';
import {NavLink} from 'react-router-dom';
import NBBase from '../../../assets/js/base'
class TtpItem extends Component{

    constructor(){
        super();
        this.selectTtp=this.selectTtp.bind(this);

        this.state={
            selected:false
        }
    }

    /*
    *
    * 帅选ttp
    * */
    selectTtp(e){
        let ttp=e.target.getAttribute('data-ttp');
        this.props.selectTtp(ttp)
    }
    render(){
        let {ttp,name,ttpCurrent}=this.props;
        console.log(this.props)
        let class_str='';
        if(ttp==ttpCurrent){
            class_str='nb_underline';
        }
        return(
            <a data-ttp={ttp} className={`nb_titletabitem ${class_str}`} onClick={this.selectTtp}>{name}</a>
        )
    }
}

class TtpPannel extends Component{

    constructor(props){
        super(props);

        this.selectTtp=this.selectTtp.bind(this)
    }

    selectTtp(ttp){
        this.props.selectTtp(ttp);
    }

    /*
    * 选择ttp
    * */

    render(){
        const ttpObj=[
            {
                ttp:'',
                name:'全部'
            },{
                ttp:1,
                name:'滚球'
            },{
                ttp:2,
                name:'今日'
            },{
                ttp:3,
                name:'早盘'
            },
        ];
        let {ttp}=this.props;
        return(
            <div>
                <div className="nb_titletab">
                    {ttpObj.map((item,index)=><TtpItem selectTtp={this.selectTtp} ttpCurrent={ttp} {...item} key={Math.random()}/>)}
                </div>
            </div>
        )
    }
}
export {TtpPannel}