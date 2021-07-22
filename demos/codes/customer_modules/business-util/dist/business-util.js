; (function (w) {

    var businessUrls = APP_CONSTANTS.businessUrls

    // 当调用网络出现405错误时,表示登录失效,则转到登录界面
    JSBridge.registerFunction("netErrorEvent", function (error) {
        // 登录失效
        if (error && error.httpCode == 405) {
            CustomerUtils.clear();
            JSBridge.forward.inside({url: businessUrls.login, newView: true});
            return false;
        }
    });

    /**
     * 校验工具对象
     *
     */
    w.CheckUtil = (function () {

        /**
         * 判断是否已经完善个人信息
         * 		y: 已经完善触发事件
         *		n: 未完善触发事件
         *
         *		** 如果未传入n,则会直接跳转到完善个人信息页面
         */
        function infoCompleted(y, n) {
            function noIC(error) {
                if (n) {
                    n(error);
                    return;
                }
                JSBridge.forward.inside({
                    url: businessUrls.completeInfo + "?from=" + OtherUtils.getPath(), 
                    newView: true 
                });
            }

            var customer = JSBridge.cache.get("customer");
            if (customer && customer.real_name && customer.verify_code) {
                y(customer);
                return;
            }

            JSBridge.net.invoke({
                loading: false,
                url: "users/userInfo",
                success: function (result) {
                    if (!result || !result.WSCustomers) {
                        noIC();
                        return;
                    }

                    customer = Object.assign(customer, result.WSCustomers);
                    JSBridge.cache.update("customer", customer);

                    if (!customer.real_name || !customer.verify_code) {
                        noIC();
                        return;
                    }

                    y(customer);
                },
                error: noIC
            });
        }

        /**
         * 判断是否已经绑定手机号码
         * 		y: 已经绑定
         *		n: 未绑定
            *
            *		** 如果未传入n,则会直接跳转到绑定手机号码页面
            */
        function mobileBinded(y, n) {
            function noIC(error) {
                if (n) {
                    n(error);
                    return;
                }

                JSBridge.forward.inside({
                    url: businessUrls.bindMobile + "?from=" + OtherUtils.getPath(), 
                    newView: true 
                });
            }
            JSBridge.net.invoke({
                loading: false,
                url: "verify/isBind",
                data: {
                    "type": "1"
                },
                success: y,
                error: noIC
            })
        }

        /**
         * 判断是否已经绑定邮箱
         * 		y: 已经绑定
         *		n: 未绑定
            *
            *		** 如果未传入n,则会直接跳转到绑定邮箱页面
            */
        function emailBinded(y, n) {
            function noIC(error) {
                if (n) {
                    n(error);
                    return;
                }

                JSBridge.forward.inside({
                    url: businessUrls.bindEmail + "?from=" + OtherUtils.getPath(), 
                    newView: true
                });
            }
            JSBridge.net.invoke({
                loading: false,
                url: "verify/isBind",
                data: {
                    "type": "2"
                },
                success: y,
                error: noIC
            });
        }

        /**
         * 判断是否已经添加银行卡
         * 		y: 已经绑定
         *		n: 未绑定
            *
            *		** 如果未传入n,则会直接跳转到绑定邮箱页面
            */
        function cardBinded(y, n) {
            function noIC(error) {
                if (n) {
                    n(error);
                    return;
                }

                JSBridge.forward.inside({ url:  businessUrls.bindCard + "?from=" + OtherUtils.getPath(), newView: true });
            }
            JSBridge.net.invoke({
                loading: false,
                url: "bankcard/getList",
                data: {
                    "flag": "1",
                    'order': 'PRIORITY_ORDER',
                    'delete_flag': '0'
                },
                success: function (result) {
                    if (!result || !result.length) {
                        noIC();
                        return;
                    }
                    y(result);
                },
                error: noIC
            });
        }

        /*
        是否有未审核的银行提案
        */
        function isPendingBankApply(notFn, isFn) {
            JSBridge.net.invoke({
                loading: false,
                url: "bankcard/isApplied",
                success: function (result) {
                    if (typeof isFn != 'function') {
                        isFn = function () { };
                    }

                    if (parseInt(result) > 0) {
                        isFn();
                    } else {
                        notFn();
                    }
                },
                error: notFn
            });
        }

        return {
            infoCompleted: infoCompleted,
            mobileBinded: mobileBinded,
            emailBinded: emailBinded,
            cardBinded: cardBinded,
            isPendingBankApply: isPendingBankApply,
        };
    })();

    w.Request = {
        /*
        提案审核
        */
        approve: function (reqId, reqType, sucFn, fairFn) {
            JSBridge.net.invoke({
                url: "apply/approve",
                data: {
                    'request_id': reqId,
                    'request_type': reqType
                },
                success: function (result) {
                    if (typeof fairFn != 'Function') {
                        fairFn = function () { };
                    }

                    if (result) {
                        sucFn();
                    } else {
                        fairFn();
                    }
                },
                error: fairFn
            });
        },
        /*
        用户总余额 必须有balance属性
        */
        totalBalance: function (object) {
            if (object.balance === undefined) {
                console.log('对象必须有balance属性');
                return;
            }

            JSBridge.net.invoke({
                loading: false,
                url: "credits/total",
                data: {
                    'withAP': 0
                },
                success: function (result) {
                    object.balance = result;
                },
                error: function () {
                    object.balance = 0;
                }
            });
        },
        /**
        用户信息 s成功函数，f failed函数
        */
        userInfo: function (s, f) {
            JSBridge.net.invoke({
                loading: false,
                url: "users/userInfo",
                success: function (result) {
                    if (!result || !result.WSCustomers) {
                        f();
                    }

                    s(result.WSCustomers);
                },
                error: f
            });
        }
    };

    w.CustomerUtils = (function () {

        var storage = localStorage;
        var cookie = (function () {
            return {
                set: function (key, value, expires) {
					document.cookie = key+"=" + value+";path=/;expires=" + expires;
				},
                delete: function (key) {
                    document.cookie = key + "=" + ";path=/";
                },
                get: function (key) {
                    var cs = document.cookie.split(";");
                    var map = cs ? (function () {
                        var m = {};
                        cs.forEach(function (v, i) {
                            var kv = v.split("=");
                            m[kv[0]] = kv[1];
                        });
                        return m;
                    })() : {};

                    return map[key];
                }
            };
        })();

        function save(customer) {
            JSBridge.driver.clearCookie();
            storage.setItem("isLoged", true);
            cookie.set("isLoged", "1", 31536000000);
            JSBridge.cache.save("customer", customer, 1);
        }

        function isLoged() {
            if ($.appVersion().isAndroid) {
                return !!CustomerUtils.getCustomer()
            }

            var isLoged = storage.getItem("isLoged");
            if (!isLoged) {
                isLoged = cookie.get("isLoged") === "1";
            }
            return isLoged;
        }

        function clear() {
            storage.removeItem("isLoged");
            JSBridge.cache.delete("customer");
            cookie.delete("isLoged");
            JSBridge.driver.clearCookie();
        }

        function getCustomer() {
            return JSBridge.cache.get("customer");
        }

        function loadCustomer(fn) {
            JSBridge.net.invoke({ //调用用户信息接口
                loading: false,
                url: "users/userInfo",
                success: function (result) {
                    var customer = result.WSCustomers;
                    JSBridge.cache.save("customer", Object.assign(getCustomer(), customer), 1);
                    fn(customer);
                },
                error: function (error) {
                    error && $.toast.fail(error.message);
                    fn();
                }
            });
        }

        return {
            save: save,
            isLoged: isLoged,
            clear: clear,
            getCustomer: getCustomer,
            loadCustomer: loadCustomer
        };
    })();

    function fillurl(url) {
        if (!url) {
            return "";
        }

        if (!/^https?:\/\//.test(url)) {
            url = "http://" + url;
        }

        if (!/\/$/.test(url)) {
            url += "/";
        }

        return url;
    }

    w.OtherUtils = {
        /* 手机号中间4位加星号 */
        mixPhone: function (phone) {
            return phone.substring(0, 3) + '****' + phone.substring(7);
        },
        mixBankCardNo: function (bankCardNo) {
            return bankCardNo.substring(0, 4) + '***********' + bankCardNo.substring(15);
        },
        getPath: function () {
            var from = location.href.split("\/").slice(-2).join("\/");
            return encodeURIComponent(from);
        },
        formatOutsideUrl: function (url) {
            return url.match(/^http/) || !url.match(/^[\w]+\.htm/) ? url : OtherUtils.getDomain() + url;
        },
        getStaticurl: (function () {
            var staticurl;

            return function () {
                if (!staticurl) {
                    staticurl = JSBridge.cache.get("staticurl");

                    if (!staticurl) {
                        staticurl = JSBridge.cache.get("cdnurl");
                        if (!staticurl) {
                            staticurl = OtherUtils.getDomain();
                        }
                    }

                    if (staticurl) {
                        staticurl = fillurl(staticurl);
                        JSBridge.cache.save("staticurl", staticurl);
                    } else {
                        staticurl = fillurl(location.host);
                    }
                }
                return staticurl;
            };
        })(),
        getDomain: (function () {
            var domain;
            return function () {
                if (!domain) {
                    domain = JSBridge.cache.get("domain");
                    domain = fillurl(domain);
                }
                return domain;
            };
        })()
    };

    
    // 添加拦截器，如果是tabbar页面的网络请求，则不允许显示loading效果
    ;(function (stealthys) {
        if(!stealthys || !stealthys.length) {
            return;
        }

        var currentUrl = decodeURIComponent(OtherUtils.getPath());

        if(!stealthys.includes(currentUrl)) {
            return;
        }

        JSBridge.registerFunction("invoke.net.invoke", function (settings) {
            settings.data.loading = false;
        });
    })(APP_CONSTANTS.stealthyNetUrls);

    //  function IpREAL() {
    //     var isIp = JSBridge.cache.get("IPReal");
    //     var oneday = 24 * 60 * 60 * 1000;

    //     if (isIp) {
    //         JSBridge.cache.delete("IPReal");
    //         return
    //     }

    //     JSBridge.net.invoke({
    //         loading: false,
    //         url: "host/app/areaLimit",
    //         data: {
    //             "doamin": OtherUtils.getDomain()
    //         },
    //         success: function(data) {
    //             console.log(2)
    //             console.log(data)
    //             JSBridge.cache.save("IPReal", true, oneday);
    //             JSBridge.forward.inside({
    //                 url: 'common/403.htm',
    //                 newView: true
    //             });
    //         },
    //         error: function(data) {
    //             console.log(1)
    //             console.log(data)
    //             if (!data.status) {
    //                 $.toast.fail(data.message);
    //             }
    //             if (data.status && data.data) {
    //                 JSBridge.cache.save("IPReal", true, oneday);
    //                 JSBridge.forward.inside({
    //                     url: 'common/403.htm',
    //                     newView: true
    //                 });
    //             }
    //         }
    //     });
    // }
    // JSBridge.onReady(function() {
    //     IpREAL()
    // });
    /**
     * 上报用户行为信息
     */
    (function () {
        if (!$.appVersion().isApp) {
            return;
        }
        /**
             * 调用接口,上报信息
            */
        function reportDynatrace(settings) {
            var sessionId,
                deviceId,
                login_name,
                url,
                urlSplit,
                customer,
                params = [];

            sessionId = (JSBridge.driver.getSessionId() || {}).sessionId;
            deviceId = (JSBridge.driver.deviceInfo() || {}).drice_id;

            urlSplit = settings.url.split("?");
            url = urlSplit[0];
            if (urlSplit.length > 1) {
                urlSplit[1].split("&").forEach(function (v, i) {
                    if (v && (!/^((user|app)Token|accountName)=.*/.test(v))) {
                        params.push(v);
                    }
                })

                if (params.length) {
                    url += "?" + params.join("&");
                }
            }

            if (CustomerUtils.isLoged()) {
                customer = CustomerUtils.getCustomer();
                if (customer) {
                    login_name = customer.login_name;
                }
            }

            JSBridge.net.invokeSync(
                "app/dynatrace",
                {
                    loading: false,
                    app_sess_id: sessionId,
                    page_name: url,
                    device_id: deviceId,
                    click_time: Date.format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    action_data: settings.remark || "APP原生跳转",
                    login_name: login_name
                }
            );
        }

        /**
         * 当内部页面被加载时出发上报用户行为信息
         */
        JSBridge.loadFinish(function () {
            reportDynatrace({
                url: decodeURIComponent(OtherUtils.getPath()),
                remark: ""
            });
        });

        /**
         * 当调用外部跳转时触发上报用户行为信息
         */
        JSBridge.registerFunction("invoke.forward", function (fData) {
            if (fData.type != "forward.outside") {
                return;
            }

            var remark = "外部页面";

            if (fData.data.gameType) {
                remark = "进入游戏: " + fData.data.gameType;
                if (/(gameType|gameId)\=(fish|6)/.test(fData.data.url)) {
                    remark = "进入游戏: 捕鱼王2";
                }
            }

            reportDynatrace({
                url: fData.data.url,
                remark: remark
            });
        });

        /**
         * 当调用本地化AGQJ游戏时,上报用户行为
             */
        JSBridge.registerFunction("invoke.driver.game", function (fData) {
            reportDynatrace({
                url: "local AGQJ",
                remark: "进入游戏: AGQJ"
            });
        });
    })();
})(window);