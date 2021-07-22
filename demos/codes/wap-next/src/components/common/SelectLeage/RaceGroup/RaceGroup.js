import React,{Component} from 'react';
import Chosenicon from '@/components/common/icons/Chosenicon/Chosenicon';
import NBBase from '../../../../assets/js/base'
class RaceTittle extends Component{

    render(){
        let {py}=this.props;
        return(
            <h3>{py}</h3>
        )
    }
}
class RaceItem extends Component{

    constructor(props){
        super(props);


        let hasSelectedrid=JSON.parse(localStorage.getItem(NBBase.has_selected_race));

        let select_flag=false;
        if(hasSelectedrid){
            if(hasSelectedrid.indexOf(this.props.rid)!=-1){
                select_flag=true;
            }
        }

        this.state={
            hasSelected:select_flag
        }
    }
    choseRace(rid,e){

        console.log('这是时间对象')
        console.log(e)
        this.props.getSelectedRid(rid);
        this.setState({
            hasSelected:!this.state.hasSelected
        });
        e.stopPropagation();
    }
    render(){
        let {rn,rid}=this.props;
        return(
            <div className="nb_propupspagectlp" onClick={this.choseRace.bind(this,rid)}>
                <p>{rn}
                    {this.state.hasSelected?<Chosenicon/>:null}
                </p>
            </div>
        )
    }
}
class RaceGroupWrap extends Component{

    constructor(){
        super();
        this.getSelectedRid=this.getSelectedRid.bind(this)
    }
    getSelectedRid(rid){

        this.props.handleSelectedRids(rid);
        console.log(rid)
    }

    render(){
        let {py,races}=this.props;
        return(
            <div className={'nb_same_leaguge'}>
                <RaceTittle py={py}/>
                {races.map((item,index)=><RaceItem {...item} getSelectedRid={this.getSelectedRid} key={item.rid} />)}
            </div>

        )
    }
}
export {RaceGroupWrap}