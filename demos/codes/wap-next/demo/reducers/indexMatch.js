import Commen from '../assets/js/commenFunc'
import NBBase from "../assets/js/base";
const indexMatchActions={
    INIT_MATCHES:'INIT_MATCHES',
    ADD_MATCHES:'ADD_MATCHES',
    DELETE_MATCHES:'DELETE_MATCHES',
    changeLanguage:'changeLanguage'
};


const  indexMatchReducers={


    createState:function (state, action) {



        if (!state) {
            let lan_active=JSON.parse(localStorage.getItem(NBBase.lan_active));
            state = {
                live:[],
                today:[],
                early:[],
                language:lan_active
            };

        }
        switch (action.type) {
            case indexMatchActions.INIT_MATCHES:
                // 初始化评论
                return {
                    ...state,...action
                }
                ;
            case indexMatchActions.changeLanguage:
                // 初始化评论
                return {
                    ...state,...action
                };


            default:
                return state
        }
    },

    createActions:{


        initMatches:(matchObj) => {
            return {
                type:'INIT_MATCHES',
                ...matchObj
            }
        },

        changeLanguage:(languageObj) => {
            return {
                type:'changeLanguage',

                ...languageObj
            }
        },




    }
    
    
    

};




export {indexMatchActions,indexMatchReducers}


