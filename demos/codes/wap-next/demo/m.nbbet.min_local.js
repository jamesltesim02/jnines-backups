﻿(function (w) {
    w.NBServer = {
        p_stm : "http://10.96.52.33:8093/",//静态资源地址
        p_stw : "http://uat.staticpc.nbbets.com",
        p_a : "http://uat.nbweb.nbbets.com",
        p_b : "http://10.96.52.33:8091/",//html模板以及活动地址
        p_c : "http://uat.frontapi.nbbets.com/",
        p_ws0 : "ws://uat.nbapi.nbbets.com/web_push/websck",
        p_s1 : "http://uat.nbapi.nbbets.com/web_pull/",//比赛数据接口地址
        p_s2 : "http://uat.nbapi.nbbets.com/bet/",//投注接口地址
        p_s3 : "http://uat.nbapi.nbbets.com/bet_channel/",//点水接口地址
        p_s4 : "http://uat.nbapi.nbbets.com/nb_video_api/",//视频直播接口地址
        p_s5 : "https://cs.betradar.com/ls/widgets/?/intevalue/$lan$/$t_zone$/widgetloader/widgets",//图文直播地址
        p_s6 : "http://uat.nbactive.nbbets.com/NB_Active/",//活动接口地址
        p_s7 : "http://uat.nbactive.nbbets.com/NB_Active/1",//预留服务器地址
        c_s1 : "http://uat.api.nnbb01.com/cash-web-api/",//现金网登陆地址
        p_m_v : "?v=P201809051037",//平台手机版版本号
        p_w_v : "?v=P201809051035" ,
        c_m_v : "?v=X201809051037",
        c_w_v : "?v=X201809051035",
        p_bt_w : ["http://uat.nbweb.nbbets.com"],
        p_bt_m : ["http://uat.nbm.nbbets.com"],//betradar 开的域名白名单
        tj : "https://s22.cnzz.com/z_stat.php?",//流量统计地址
        p_wh: "14:00-18:00",//平台维护时间
        c_wh:"13:00~16:00",//现金网维护时间
        az_v:"1.1.2",//安卓版本号
        pg_v:"1.0.4",//苹果版本号
        tj_w : "id=1273496760&web_id=1273496760",
        tj_m : "id=1273597856&web_id=1273597856",//流量统计ip
        mark : "nb_nb_cash",//商户标志
        nb_view : 0,
        nb_theme : 0,
        c_index : 0,
        kz1:700,
        kz2:800,
        kz3:900
    };






    setNBBet();
})(window);



function setNBBet() {
    var NBBet=function () {


        this.timer=null;
    };
    NBBet.prototype={
        init:function () {
            var that=this;
            if(!window.NBPlat){
                clearInterval(that.timer);
                that.timer=setInterval(function () {
                    that.init();
                },10)
            }
            else{
                clearInterval(that.timer);
                var d=new window.NBPlat();
                d.initSettings(function () {
                    d.init();
                });
            }
        }
    };
    window['NBBet']=NBBet = NBBet.prototype;
}
