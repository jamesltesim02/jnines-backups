import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import store from './store'
import {setClientConfig} from '@/utils/ClientAdapter'
import {getLanguage} from '@/utils/LanguageUtils'
import {globalActions} from '@/reducers/global'

import HomeContainer from './containers/homeContainer';
import ListByTimeContainer from './containers/listByTimeContainer';
import listBySportContainer from './containers/listBySportContainer';
import MatchDetail from './components/MatchDetail';

import {Live} from "@/components/Live/Live";

import Search from './components/Search/Search';
import Settings from './components/Settings/Settings';
import BettingHistory from './components/Bet/BettingHistory';
import BettingPanel from '@/components/Bet/BettingPanel'
import Bet from '@/components/Bet'

// 引入api的默认配置信息,用于设置axios的拦截器
import '@/api'

import './assets/js/rem';
import './assets/css/reset.css';
import './index.css';
import '@/components/common/icons/icons.css'

// 投注相关功能测试入口 (投注, 弹出新窗口)
import BetTest from '@/components/BetTest'

class NBPlat {
    /*
    * 初始化基础设置，参数为值为“zh-ch”,"en-us"等
    */
    async initSettings(callback) {
        // 获取当前语言对应的资源配置
        let localeInfo = await getLanguage();
        // 设置语言到store中
        store.dispatch(globalActions.updateLanguage(localeInfo));
        callback()
    }
    init(opt) {
        // 设置客户端配置信息
        setClientConfig(opt);
        console.log(opt)
        ReactDOM.render(
            <Provider store={store}>
                <div className="nb-app-container">
                    <HashRouter>
                        <Switch>
                            <Route exact path='/' component={HomeContainer}></Route>
                            <Route exact path='/' component={Live}></Route>
                            <Route path='/list/time/:page' component={ListByTimeContainer}></Route>
                            <Route path='/new/list/sport/:page' component={listBySportContainer}></Route>
                            <Route path='/new/matchDetail/:mid' component={MatchDetail}></Route>
                            <Route path='/bet' component={Bet}></Route>
                            <Route path='/search' component={Search}></Route>
                            <Route path='/settings' component={Settings}></Route>
                            <Route path='/bettinghistory' component={BettingHistory}></Route>
                            {/* 投注相关功能测试入口 */}
                            <Route path='/new/bettest' component={BetTest}></Route>
                            <Redirect to="/"/>
                        </Switch>
                    </HashRouter>
                    <BettingPanel/>
                </div>
            </Provider>,
            document.getElementById('root')
        );
    }

}

window['NBPlat'] = NBPlat;
