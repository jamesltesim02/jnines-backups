import React,{Component} from 'react';
import commen from '../../../../assets/js/commenFunc';
import '../css/raceTittle.css'
export default class RaceTittle extends Component{
    constructor(props){

        super(props);
        this.state={


        };

    }

    render(){


        return(
                <div className={'nb_race_wrap'}>
                    <div className="nb_race_name_wrap">
                        <a>
                            <span className={'nb_fa_10'}></span><span className={'nb_race_name'}>{this.props.rn}</span>
                        </a>
                    </div>
                    <div className="nb_betName">
                        <span>让球盘</span>
                        <span>大小盘</span>
                    </div>
                </div>
        )
    }
}