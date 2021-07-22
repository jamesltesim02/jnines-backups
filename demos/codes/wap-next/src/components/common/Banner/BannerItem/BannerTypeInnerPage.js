import React, {Component} from 'react';
import {BannerItem_bet} from "./BannerItem_bet/BannerItem_bet";
import {BannerItem_background} from "./BannerItem_background/BannerItem_background";
import '../banner.css';
import {NavLink} from 'react-router-dom';
import {Commen} from "../../../../assets/js/commenFunc";

class BannerTypeInnerPage extends Component {

    constructor(props) {
        super(props);


    }

    render() {
        let self = this;
        let {url, data} = this.props;
        const pageObj = {
            '10': 'new/list/sport/football',
            '11': 'new/list/sport/basketball',
            '12': 'new/list/sport/tennis',
            'detail': 'new/detail/'
        };
        let search_obj = {
            competitorId: data.tid || '',
            rid: data.rid || '',
            mid: data.mid || ''
        };

        let target_url = 'index/gHotAll';
        if (search_obj.mid) {
            target_url = '/gsinglematch'
        }
        let target_obj = {
            search_url: target_url,
            data_query: search_obj,
            target_url: pageObj[url],
            text: ''
        };
        Commen.ajax({
            async: false,
            url: target_url,
            data: search_obj,
            success: function (res) {
                if (res.result === 200 && res.data && res.data.length) {
                    let target_data = res.data[0].races[0].matchs[0];
                    /*
                    * 按比赛id进入详情
                    * */
                    if (search_obj.mid) {

                    }
                    else {//进入列表
                        if (search_obj.competitorId) {//则按比赛队伍进入列表
                            if (search_obj.competitorId == target_data.aid) {
                                target_obj.text = target_data.atn;
                            }
                            else if (search_obj.competitorId == target_data.hid) {
                                target_obj.text = target_data.htn;
                            }
                        }
                        else {//按联赛id进入列表

                            target_data = res.data[0].races[0];
                            target_obj.text = target_data.rn


                        }
                    }
                    target_obj.data = res.data
                }
            }
        });


        let {backgroundImg, backgroundColor} = this.props;

        let data_query = Commen.formatParams(target_obj.data_query);//跳转的参数
        return (
            <li>
                <NavLink to={`${target_obj.target_url}?${data_query}&text=${target_obj.text}`}>
                    <BannerItem_background backgroundColor={backgroundColor} backgroundImg={backgroundImg}/>
                </NavLink>
            </li>
        )
    }
}

export {BannerTypeInnerPage}
