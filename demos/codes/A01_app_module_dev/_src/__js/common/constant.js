;(function (w) {

    /**
     * APP的全局配置信息
     */
    w.APP_CONSTANTS = {
        /**
         * 业务跳转地址,主要用于给business模块提供跳转业务
         */
        businessUrls: {
            // 登录页面
            login: "common/login.htm",
            // 完善个人信息
            completeInfo: "customer/personal_info.htm",
            // 绑定手机
            bindMobile: "customer/bind_mobile.htm",
            // 绑定邮箱
            bindEmail: "customer/bind_email.htm",
            // 绑定银行卡
            bindCard: "customer/bank_add.htm"
        },
        stealthyNetUrls: [
            "common/index.htm",
            "promotions/promotion_list.htm",
            "customer/history.htm",
            "customer/member_center.htm"
        ]
    };
})(window);