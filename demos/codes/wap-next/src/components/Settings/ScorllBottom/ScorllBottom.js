import React,{Component} from 'react'
class ScorllBottom extends Component{


    render(){
        console.log(this.props);
        let {allValue,title}=this.props;
        return(
            <div className="nb_Settingsprops">
                <div className="nb_Settingspropsbt">
                    <div className="nb_Settingsproptit">
                        <span className="fl">取消</span>{title}<span className="fr">确定</span>
                    </div>
                    {allValue.map((item,index)=><div className="nb_Settingsproppage" data-val={item.value} key={Math.random()}>{item.name}</div>)}
                </div>
            </div>
        )


    }
}
export default ScorllBottom