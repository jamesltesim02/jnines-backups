

export default {

    lan_zh:'lan_zh',//中文存储标识
    lan_en:'lan_en',//英文存储标识
    lan_active:'lan_active',//当前正在使用的语言存储标识
    diff_plat: 0,//商户索引

    platform_settings:'platform_settings',//平台基础设置
    home_addtionBetItems:'home_addtionBetItems',//当前页可能存在的附加盘口
    list_addtionBetItems:'list_addtionBetItems',//当前页可能存在的附加盘口
    has_selected_race:'has_selected_race',//已选中的联赛id
    list_pageInfo:'list_pageInfo',//列表页面信息
    // 接口请求超时时间,默认为100秒
    NB_MOBILE_API_TIMEOUT: 1500000,
    // localStorage中的语言数据key
    NB_MOBILE_LOCALES: 'nb_mobile_locales',
    // localStorage中的用户信息key
    NB_MOBILE_USER: 'nb_mobile_user',
    // localstorage中的投注单key
    MOBILE_BETTING_DATA: 'mobile_betting_data',
    // 投注单最大数量
    MOBILE_BETTING_MAX: 15,


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
        nb_viewType:1,//1：标准盘；2：亚洲盘
    },
    // odds_format: [], // 盘口格式
};
