import { combineReducers ,createStore} from 'redux'
import {homeReducers} from './reducers/homeMatchReducer';
import {listByTimeReducers} from './reducers/listByTimeReducer';
import {listBySportReducers} from './reducers/listBySportReducer';
import betting from './reducers/betting';
import global from './reducers/global';


const store = createStore(combineReducers({
  homeData: homeReducers.createState,
  listByTimeData: listByTimeReducers.createState,
  listBySportData:listBySportReducers.createState,
  // 投注单
  betting,
  // 全局数据
  global
}));

export default store