import React,{Component} from 'react';

import {Openicon} from '@/components/common/icons/Openicon/Openicon'

import './MatchDetailtit.css'

class MatchDetailtit extends Component{
    render(){
        return(
            <div className="nb_completepagetit">
                标准盘
                <div className="nb_completepageclose">
                    <Openicon/>
                </div>
            </div>
        )
    }
}
export  default MatchDetailtit
