import React, {Component} from 'react';
import './racePannel.css';
import NBBase from '../../../assets/js/base';
import Image from '@/components/common/Image'

import {Commen} from '../../../assets/js/commenFunc';
import {NavLink} from 'react-router-dom';
import HotRaceLogo from './HotRaceLogo/HotRaceLogo'

class RacePannel extends Component {

    constructor() {
        super();
        this.state = {
            hotRaces: [],
            page:1
        };
        this.changeRace=this.changeRace.bind(this);
    }

    /*
    * 获取联赛
    * */

    getData(options) {
        let self=this;
        Commen.ajax({
            url: 'bimportantrace',
            data: {
                nb_sign: '',//商户标记,
                page:options.page,
                limit:5
            },
            success: function (res) {
                if(res.result===200&&res.data&&res.data.length){
                    self.setState({
                        hotRaces:res.data
                    })
                }

            }
        })
    };


    changeRace(data){



        this.getData(data);



    }
    componentDidMount() {
        this.getData({
            page:1
        });
    }

    render() {
        return (
            <div className={'nb_raceTypes'}>
                <div className="nb_iconbox">
                    {this.state.hotRaces.map((item,index)=><NavLink to={'/sssssssssss'} key={item.rid} className="nb_iconitembox">
                            {item.logo?<Image src={item.logo} alt="Iconimg"/>:null}
                        <p className="nb_iconitemp">{item.sn}</p>
                    </NavLink>)}
                    {this.state.hotRaces.length>=3?<HotRaceLogo changeRace={this.changeRace}/>:null}
                </div>
            </div>
        )
    }
}


export default RacePannel
