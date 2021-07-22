import React,{Component} from 'react';
import {connect} from 'react-redux'
import './CombinedShape.css';
import {NavLink} from 'react-router-dom'

import Searchicon from '@/components/common/icons/Searchicon';
import Topupicon from '@/components/common/icons/Topupicon';
import Historyicon from '@/components/common/icons/Historyicon';
import Settingicon from '@/components/common/icons/Settingicon'


class CombinedShape extends Component{
    render(){
        let {
            global: {
                isLoged
            }
        } = this.props
        return(
            <div className={'nb_CombinedShapebox'}>
                <ul>
                    <li>
                        <NavLink to="/search"  className="nb_CombinedShapelink">
                            <span className="nb_combinedicon">
                                <Searchicon />
                            </span>       
                            搜索
                        </NavLink>
                   </li>
                   <li>
                        <NavLink to="/settings"  className="nb_CombinedShapelink">
                            <span className="nb_combinedicon">
                                <Topupicon />
                            </span>   
                            充值
                        </NavLink>
                   </li>
                   {
                       isLoged
                        ?   <li>
                                <NavLink to="/bettinghistory"  className="nb_CombinedShapelink">
                                    <span className="nb_combinedicon">
                                        <Historyicon />
                                    </span>
                                    投注历史
                                </NavLink>
                            </li>
                        :   null
                   }
                   <li>
                        <NavLink to="/settings"  className="nb_CombinedShapelink  nb_CombinedShapeactive">
                            <span className="nb_combinedicon">
                                <Settingicon />
                            </span>
                            设置
                        </NavLink>
                   </li>
                </ul>
            </div>
        )
    }
}

export default connect(state => state, null)(CombinedShape)
