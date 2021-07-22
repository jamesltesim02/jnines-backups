import React,{Component} from 'react';
import './Live.css';

import {Theader} from '@/components/common/Theader/Theader';
import {Tfooter} from '@/components/common/Tfooter/Tfooter';
import {SelectLeage} from '@/components/common/SelectLeage/SelectLeage';
import {SportsPannel} from "../common/SportsPannel/SportsPannel";

class Live extends Component{
    render(){
        return(
            <div>
                这里是滚球
                <Theader/>
                <Tfooter/>

                {/*<SportsPannel/>*/}
                <SelectLeage/>
            </div>  
        )
    }
}
export {Live}
