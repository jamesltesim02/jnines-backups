const indexRaceActions={
    HAS_MATCHES:'HAS_MATCHES',

};


const  indexRaceReducers={


    createState:function (state, action) {
        if (!state) {
            state = {
                showRace:true
            }
        }
        switch (action.type) {
            case indexRaceActions.HAS_MATCHES:
                // 初始化评论
                return {
                    showRace:true,
                    ...action
                };
            default:
                return state
        }
    },

    createActions:{
        hasMatches:(matchObj) => {
            return {
                type:'HAS_MATCHES',
                ...matchObj
            }
        },
    }

};




export {indexRaceActions,indexRaceReducers}


