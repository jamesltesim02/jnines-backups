
import NBBase from "../assets/js/base";
const listByTimeActions={
    INIT_MATCHES:'INIT_MATCHES',
};


const  listByTimeReducers={
    createState:function (state, action) {
        if (!state) {
            let lan_active=JSON.parse(localStorage.getItem(NBBase.lan_active));
            state = {
                races:[],
            };
        }
        switch (action.type) {
            case listByTimeActions.INIT_MATCHES:
                // 初始化评论
                return {
                    ...state,...action
                };
            default:
                return state
        }
    },
    createActions:{
        initMatches:(racesObj) => {
            return {
                type:'INIT_MATCHES',
                races:racesObj.races
            }
        },

    }




};




export {listByTimeActions,listByTimeReducers}


