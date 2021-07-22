import React,{Component} from 'react';
import './Search.css';
import Searchicon from '@/components/common/icons/Searchicon';
import Closeicon from '@/components/common/icons/Closeicon/Closeicon';
import {Commen} from "../../assets/js/commenFunc";
import BackIncon from '@/components/common/icons/BackIcon/BackIcon'
class HotLeaguage extends Component{
    render(){
        return(
            <div>
                <div className="nb_TopLeaguetit">热门联赛</div>
                <div className="nb_TopLeaguepage">
                    <span className="fl">英格兰超级联赛</span>
                    <span className="fl">墨西哥杯</span>
                    <span className="fl">欧洲联赛</span>
                    <span className="fl">阿拉伯联合酋长国联赛杯</span>
                    <span className="fl">英格兰超级联赛</span>
                    <span className="fl">墨西哥杯</span>
                    <span className="fl">欧洲联赛</span>
                    <span className="fl">阿拉伯联合酋长国联赛杯</span>
                </div>
            </div>
        )
    }
}
class SearchInput extends Component{

    constructor(){
        super();

        this.onInput=this.onInput.bind(this)
        this.clickBack=this.clickBack.bind(this)
    }


    onInput(e){

        console.log(e.target.value)




    }


    /*
    * 后退处理
    * */
    clickBack(){
        let {history}=this.props;
        history.goBack()
    }

    render(){






        return(
            <div className="nb_searchiptbox">
                <div className="nb_searchipt">
                    <span onTouchEnd={this.clickBack}>
                        <BackIncon/>
                    </span>
                    <span className="nb_searchicon"><Searchicon/></span>
                    <input type="text" placeholder="搜索球队或联赛" className="nb_ipt" onInput={this.onInput}/>
                    <Closeicon className="nb_searchclose"/>
                </div>
                <span className="nb_cancel">搜索</span>
            </div>
        )
    }
}
class SearchedRace extends Component{
    render(){
        return(
            <div>
                <div className="nb_TopLeaguetit">联赛</div>

                <div className="nb_TopLeagueruselt">
                    <span className="nb_blue">英格兰</span>冠军联赛
                    <span className="nb_TopLeaguenum fr">11场赛事</span>
                </div>
            </div>
        )
    }
}

class SearchedMatch extends Component{
    render(){
        return(
            <div>
                <div className="nb_TopLeaguetit">赛事</div>
                <div className="nb_TopLeagueruselt">
                    纽约城 vs 新<span className="nb_blue">英格兰</span>革命
                    <span className="nb_TopLeaguenum fr">09/06 07:00</span>
                </div>
            </div>
        )
    }
}
class Search extends Component{


    constructor(){
        super()
    }
    componentDidMount(){
        this.getInitData()
    }

    /*
    * 获取没有输入时的热门联赛
    * /*/
    getInitData(){



        Commen.ajax({
            url:'bimportantrace',
            data:{
                page:1,
                limit:300,
                nb_sign:''
            },
            success:function (res) {
                console.log(res)
            }
        })




    }
    render(){


        let {history}=this.props;

      return(
        <div className="nb_search">
            <SearchInput history={history}/>
            <HotLeaguage/>
            <SearchedRace/>
            <SearchedMatch/>
        </div>
      )
    }
}


export default Search
