import React,{Component} from 'react'
import ReactDOM from 'react-dom';
import { combineReducers ,createStore} from 'redux'
import { Provider } from 'react-redux';

import './assets/js/rem';
import './assets/css/reset.css';
import './assets/css/index.css';
import IndexMatchContainer from './containers/IndexMatchContainer';
import {indexMatchReducers} from './reducers/indexMatch';
import {indexRaceReducers} from './reducers/indexRace';
import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom';
import NBBase from './assets/js/base.js';
import Footer from './components/footer/Footer'




class NBPlat{

    constructor(){

    }

    /*
* 初始化基础设置，参数为值为“zh-ch”,"en-us"等
* */
    initSettings(callback){
        let plate_config=localStorage.getItem(NBBase.platform_settings);
        if(!plate_config){
            localStorage.setItem(NBBase.platform_settings,JSON.stringify(NBBase.plate_config));
            plate_config=NBBase.plate_config;
        }
        else{
            plate_config=JSON.parse(plate_config);
        }
        let nb_language=plate_config.nb_language;
        /*
        * 当前正在使用的语言存储在NBBase的language属性上，切换语言时只需要取NBBase上的language值
        * */
        if(nb_language==='zh-cn'){
            let lannuage_zh=localStorage.getItem(NBBase.lan_zh);
            if(!lannuage_zh){
                loadFileList('language-' + nb_language + '.js', NBServer.p_stm, NBServer.p_m_v, function () {
                    localStorage.setItem(NBBase.lan_zh,JSON.stringify(lan_zh));
                    localStorage.setItem(NBBase.lan_active,JSON.stringify(lan_zh));
                    callback()
                });
            }
            else{
                localStorage.setItem(NBBase.lan_active,lannuage_zh);
                callback()
            }
        }
        if(nb_language==='en-us'){
            let lannuage_en=localStorage.getItem(NBBase.lan_en);
            if(!lannuage_en){
                loadFileList('language-' + nb_language + '.js', NBServer.p_stm, NBServer.p_m_v, function () {
                    localStorage.setItem(NBBase.lan_en,JSON.stringify(lan_en));
                    localStorage.setItem(NBBase.lan_active,JSON.stringify(lan_en));
                    callback()
                });
            }
            else{
                localStorage.setItem(NBBase.lan_active,lannuage_en);
                callback();
            }
        }

    }
    init(opt){

        const rootReducer = combineReducers({
            raceReducers:indexRaceReducers.createState,
            indexReducers:indexMatchReducers.createState,
        });
        const store = createStore(rootReducer);
        ReactDOM.render(

            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/' component={IndexMatchContainer}></Route>
                        <Route  path='/footer' component={Footer}></Route>
                        <Redirect to="/" />
                    </Switch>
                </BrowserRouter>
            </Provider>,
            document.getElementById('root')
        );
    }

}
window['NBPlat']=NBPlat;







