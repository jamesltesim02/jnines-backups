

    export default {

        lan_zh:'lan_zh',//中文存储标识
        lan_en:'lan_en',//英文存储标识
        lan_active:'lan_active',//当前正在使用的语言存数标识
        diff_plat: 0,//商户索引

        platform_settings:'platform_settings',//平台基础设置
        // errorCode: 500,
        // successCode: 200,
        // user_config: "mobile_config",
        // nb_detailMatch: 'nb_detaiMatch',
        // nb_winner_race: 'nb_winner_race',//
        // nb_table_state: 'nb_table_state',
        // // match_info:'match_info',
        // nodata: 404,
        // nb_time: 'zone_time',
        // server_time: 'server_time',
        // visible_no_bet:'visible_no_bet',//存储可见不可投的数据，当推送state等于1时再变为可投
        // search_querys: 'nb__querys',
        // //投注Id集合 存储的 key名称
        // bet_id_str: "mobile_bet_ids",
        // //投注单数据集合 存储的key名称
        // bet_cart_data: "mobile_bet_cart_data",
        // //假登录成功时存下的session，验证是否登录
        // login_session: 'nb_mobile_user',
        // //推送时用户临时id
        // user_id: 'tp_user',
        // language: (navigator.language || navigator.userLanguage).toLowerCase(), //默认语言
        // file_code: [],
        // merchant_path: NBServer["p_c"], //商户管理服务器路径
        // client_path: '',
        // source_path: '', //资源服务器目录，暂时与当前域名同路径
        // websocket_url:'',  // 推送
        // odd_change_code: [16, 18, 19, 20, 26, 27, 28],   //需要改变赔率的id值
        // odds_style: {   //盘口格式常量
        //     ozp: 1, //欧洲盘
        //     mzp: 2,// 美式盘
        //     xgp: 3, // 港式盘
        //     mlp: 4, //马来盘
        //     ygp: 5,//英式分数盘
        //     ynp: 6,//印尼盘
        //     mdp: 7,//缅甸盘
        //     ydp: 8	 //意大利盘
        // },
        plate_config: {
            nb_language: "zh-cn",
            nb_theme: 0,
            nb_odds_selset: 1,
            nb_odds_size: 0,
            nb_view: 0,
            nb_odds_all: 1,
            nb_odds_max: 1,
            nb_default_bet_toggle: 0,
            nb_default_bet: 100,
            nb_set_fast_bet: 0,
            is_match_tip: 1,
            nb_set_session_time: 30,
            is_play_tip: 1,
            is_match_sound: 1,
            odds_min: "1.40",
            odds_max: "1.96",
            is_sort_type: 'sortByTime',//默认按时间排序
        },
        // odds_format: [], // 盘口格式
    };


