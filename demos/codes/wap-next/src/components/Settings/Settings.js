import React,{Component} from 'react';
import './Settings.css';
import Chooseicon from '@/components/common/icons/Chooseicon/Chooseicon';
import Header from '../common/Header/Header'
import ScorllBottom from './ScorllBottom/ScorllBottom'
class SettingItem extends Component{
    constructor(props){
        super(props);
        let {title,allValue,scrollBottom}=this.props;
        this.itemClick=this.itemClick.bind(this,allValue,title,scrollBottom)
    }

    itemClick(allValue,title,scrollBottom){
        if(scrollBottom){
            this.props.itemClick(allValue,title)
        }

    }
    render(){
        let {title,showTitle,scrollBottom}=this.props;
        return(
            <div>
                <div className="nb_Settingsipt">
                    {title}
                    <p className="fr nb_Settingsp"  onClick={this.itemClick}>{showTitle}
                        <Chooseicon/>
                    </p>
                </div>

            </div>

        )
    }
}

class Settings extends Component{
    constructor(){
        super();
        this.state={
            items:[],
            showBottom:false,
            allValue:[]
        };
        this.itemClick=this.itemClick.bind(this)
    }

    componentDidMount(){
        let items=[
            {
                scrollBottom:true,
                title:'语言',
                showValue:'zh-cn',
                showTitle:'简体中文',
                allValue:[
                    {

                        isSelect:true,
                        value:'zh-cn',
                        name:'简体中文'
                    },{
                        isSelect:false,
                        value:'zh-tw',
                        name:'繁体中文'
                    },{
                        isSelect:false,
                        value:'en-us',
                        name:'ENGLISH'
                    },
                ]
            },
            {
                scrollBottom:true,
                title:'赔率',
                showValue:1,
                showTitle:'标准盘',
                allValue:[
                    {
                        isSelect:true,
                        value:1,
                        name:'标准盘'
                    },{
                        isSelect:false,
                        value:3,
                        name:'香港盘'
                    },
                ]
            },
            {
                scrollBottom:true,
                title:'排序',
                showValue:'sortByTime',
                showTitle:'时间排序',
                allValue:[
                    {
                        isSelect:true,
                        value:'sortByTime',
                        name:'时间排序'
                    },{
                        isSelect:true,
                        value:'',
                        name:'联赛排序'
                    },
                ]
            },
            {
                title:'投注本金设置',
                showValue:'100RMB',
                showTitle:'100RMB',
                allValue:[

                ]
            },
            {
                scrollBottom:true,
                title:'水位',
                showValue:0,
                showTitle:'默认',
                allValue:[
                    {
                        isSelect:true,
                        value:0,
                        name:'默认'
                    },{
                        isSelect:true,
                        value:1,
                        name:'高水位'
                    },{
                        isSelect:true,
                        value:2,
                        name:'低水位'
                    },
                ]
            },
            {
                scrollBottom:false,
                title:'高水位',
                showValue:'1.96',
                showTitle:'1.96',
                allValue:[

                ]
            },
            {
                scrollBottom:false,
                title:'低水位',
                showValue:'1.40',
                showTitle:'1.40',
                allValue:[

                ]
            },
        ];
        this.setState({
            items
        })

    }



    /*
    * 接收底部弹出框的值，渲染底部弹出框
    * */
    itemClick(allValue,title){

        this.setState({
            showBottom:true,
            allValue,
            title
        });
        // console.log(allValue)
    }

    render(){

        let title='偏好设置';

        let showMore=false;
        let more_flag=false;
      return(
        <div className="nb_search">

            <Header title={title} showMore={showMore} more_flag={more_flag}/>
            <div className={'items_wrap'}>
                {this.state.items.map((item,index)=><SettingItem key={Math.random()} itemClick={this.itemClick} {...item}/>)}
            </div>
            {this.state.showBottom?<ScorllBottom title={this.state.title} allValue={this.state.allValue}/>:null}
        </div>
      )
    }
}


export default Settings
