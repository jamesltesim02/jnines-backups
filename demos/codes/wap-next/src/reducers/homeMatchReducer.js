
import NBBase from "../assets/js/base";
const homeActions={
    INIT_MATCHES:'INIT_MATCHES',
    changeLanguage:'changeLanguage',
    INIT_STRECH_MATCH:'INIT_STRECH_MATCH',
};


const  homeReducers={


    createState:function (state, action) {



        if (!state) {
            let lan_active=JSON.parse(localStorage.getItem(NBBase.lan_active));
            state = {
                football:[],
                basketball:[],
                tennis:[],
                language:lan_active,
            };

        }
        switch (action.type) {
            case homeActions.INIT_MATCHES:
                // 初始化评论
                return {
                    ...state,...action
                }
                ;
            case homeActions.INIT_STRECH_MATCH:
                // 初始化评论
                return {
                    ...state,...action
                };
            case homeActions.changeLanguage:
                // 初始化评论
                return {
                    ...state,...action
                };
            case homeActions.changeNextRaces:
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
        initStrechMatch:(data)=>{
            return {
                type:'INIT_STRECH_MATCH',
                ...data
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




export {homeActions,homeReducers}


