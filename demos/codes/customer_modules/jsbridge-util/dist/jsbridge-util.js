/**
 * JSBridge Util v0.0.1
 * 
 * 1. 提取与app定制的模块协议
 *     包含net,cache,ui,forward,driver等模块
 *
 * 2. 添加对a标签的forward功能支持,方便跳转操作
 * 3. 同步网页加载和app加载完成事件到onReady中
 * Versoin: 0.0.1
 * Date: 2017-5-16 9:43:58
 * Author: WRD.APP.Mobile
 */
;(function(w, i) {
    var d = w.document,
        b = w.JSBridge;
    i(w, d, b);
})(window, function(w, d,b) {
    var body = d.body;
    /*
     * app提供模块封装 
     */
    ;(function () {
        // 网络模块
        var net,
        // 缓存模块
        cache,
        // 跳转模块
        forward,
        // ui模块
        ui,
        // 内部驱动
        driver;

        /**
         * 网络模块实现,包含invoke函数调用网络
         */
        net = {
            invoke: function (settings) {
                var loading = true,
                invokeData,
                result;

                if(!settings) {
                    settings = {};
                }

                settings.type = "net.invoke";

                if(settings.loading === false) {
                    loading = false;
                }

                if(settings.data) {
                    invokeData = settings.data;
                    if(invokeData.loading === false) {
                        loading = false;
                    }
                }

                settings.data = {
                    apiUrl: settings.url,
                    loading: loading,
                    params: invokeData
                };

                delete settings.url;

                result = JSBridge.invoke(settings);

                return result;
            },
            invokeSync: function (url, data) {
                return new Promise(function (resolve, reject) {
                    JSBridge.net.invoke({
                        url: url,
                        data: data,
                        success: resolve,
                        error: reject
                    });
                });
            },
            invokeAll: function () {
                var args = arguments;
                
                if(arguments.length == 1) {
                    if(Array.isArray(arguments[0])) {
                        args = arguments[0];
                    } else {
                        args = [arguments[0]];
                    }
                }

                return Promise.all(Array.prototype.map.call(args, function (v,i) {
                    return JSBridge.net.invokeSync(v.url, v.data);
                }));
            }
        };
        

        /**
         * 缓存模块实现,包含save,update,get,delete
         */
        cache = {
            save: function (key, value, expire) {
                var cachePackage = {"cacheValue": value};
                if(typeof(expire) == "undefined") {
                    expire = 0;
                }
                if(expire > 1) {
                    cachePackage.expire = Date.now() + expire;
                }
                JSBridge.invoke({
                    type: "cache.save",
                    data: {
                        key: key,
                        value: JSON.stringify(cachePackage),
                        expire: expire
                    }
                });
            },
            update: function (key, value, expire) {
                JSBridge.invoke({
                    type: "cache.update",
                    data: {
                        key: key,
                        value:JSON.stringify({"cacheValue": value}),
                        expire: expire
                    }
                });
            },
            get: function (key) {
                var result = JSBridge.invoke({
                    type: "cache.get",
                    data: {
                        key: key
                    }
                }),
                data;

                if(!result) {return undefined;}
                data = JSON.parse(result).data;

                if(!data) {return undefined;}
                data = JSON.parse(data);
                if(data.expire) {
                    if(Date.now() > data.expire) {
                        cache.delete(key);
                        return undefined;
                    }
                }

                return data.cacheValue;
            },
            delete: function (key) {
                JSBridge.invoke({
                    type: "cache.delete",
                    data: {
                        key: key
                    }
                });
            },
            clear: function () {
                JSBridge.invoke({type: "cache.clear"});
            }
        };

        /**
         * 跳转模块实现,包含inside,outside
         */
        forward = (function () {
            function inside(settings) {
                JSBridge.invoke({
                    type: "forward.inside",
                    data: settings
                });
            }
            function outside(settings) {
                JSBridge.invoke({
                    type: "forward.outside",
                    data: settings
                });
            }

            return {
                inside: inside, 
                outside: outside
            };
        })();

        /** 
         * 内部驱动服务调用
         */
        driver = (function(){
            function returnData(result) {
                if(!result) {
                    return ;
                }

                if(typeof result === "string") {
                    try {
                        result = JSON.parse(result);
                    } catch(e) {
                        console.warn(e);
                    }
                }

                if(result.data) {
                    result = result.data;
                    if(typeof result === "string") {
                        try {
                            result = JSON.parse(result);
                        } catch(e) {
                            console.warn(e);
                        }
                    }
                }

                return result;
            }
            function IPSUnread(num) {
                JSBridge.invoke({
                    type: "driver.IPSUnread",
                    data: {
                        num:num
                    }
                });
            }
            function live800(customerId) {
                JSBridge.invoke({
                    type: "driver.live800",
                    data: {
                        customer_id:customerId
                    }
                });
            }

            function live800ol() {
                JSBridge.invoke({
                    type: "driver.live800ol",
                    data: {}
                });
            }

            function clearCookie() {
                JSBridge.invoke({type: "driver.clearCookie"});
            }

            function game(gameCode, obj) {
                var params = {}, key;
                params.gameCode = gameCode;
                if (typeof obj === "object") {
                    for (key in obj) {
                        params[key] = obj[key];
                    }
                }

                JSBridge.invoke({
                    type:"driver.game",
                    data:params
                });
            }

            function getSessionId() {
                return returnData(JSBridge.invoke({
                    type:"driver.getSessionId"
                }));
            }

            /**
             * 获取设备信息
             * return {
             *      drice_id 设备id
             *      drice_type 设备类型
             * }
             */
            function deviceInfo() {
                return returnData(JSBridge.invoke({
                    type:"driver.deviceInfo"
                }));
            }

            /*
            复制到剪贴板
            **/
            function copy(str) {
                JSBridge.invoke({
                    type: "driver.copy",
                    data: {
                        value:str
                    }
                });
            }
            /*
            * 开启手势密码
            * */
            function toggleGesture(bol,callbackfun) {
                JSBridge.invoke({
                    type: "driver.toggleGesture",
                    data: {
                        isShow:bol
                    },
                    success:callbackfun
                });
            }
            /*
            * 修改手势密码
            * */
            function resetGesture(callbackfun) {
                JSBridge.invoke({
                    type: "driver.resetGesture",
                    data: {},
                    success: callbackfun

                });
            }

            /*
             * 获取当前app版本
             */
            function getVersion(callbackfun) {
                var versionResult = JSBridge.invoke({
                    type: "driver.getVersion",
                    data: {},
                    success: callbackfun
                });
                
                if(!callbackfun) {
                    return returnData(versionResult);
                }
            }

            /** 
             * 更新当前app版本
             */
            function checkUpdate() {
                JSBridge.invoke({
                    type: "driver.checkUpdate",
                    data: {}
                });
            }

            function getParentId() {
                return returnData(JSBridge.invoke({type:"driver.getParentId"}));
            }

            function getPalCode() {
                return returnData(JSBridge.invoke({
                    type:"driver.getPalCode"
                }));
            }
            function getCookiedPalCode() {
                return returnData(JSBridge.invoke({
                    
                    
                }));
            }

            function log() {
                JSBridge.invoke({ type: "driver.log", data: {}});
            }

            return {
                IPSUnread: IPSUnread,
                live800: live800,
                live800ol: live800ol,
                copy:copy,
                game: game,
                log: log,
                clearCookie: clearCookie,
                deviceInfo: deviceInfo,
                toggleGesture:toggleGesture,
                resetGesture:resetGesture,
                getVersion:getVersion,
                checkUpdate:checkUpdate,
                getSessionId:getSessionId,
                getParentId:getParentId,
                getPalCode:getPalCode,
                getCookiedPalCode: getCookiedPalCode
            };
        })();

        /**
         * ui模块实现,包含loading,toast
         */
        ui = (function () {
            var loading,toast,loadingVisited;

            // loading
            loading = function (state) {

                if((state === "hide" && !loadingVisited)
                    ||(state === "show" && loadingVisited)) {
                    return;
                }

                loadingVisited = state == "show";
                JSBridge.invoke({
                    type: "ui.loading",
                    loading: false,
                    data: {
                        state: state
                    }
                });
            };
            
            loading.show = function(delay) {
                loading("show");

                if(delay && !Number.isNaN(delay)) {
                    setTimeout(function () {
                        loading.hide();
                    },delay)
                }
            }

            loading.hide = function () {
                loading("hide");
            };

            // toast
            toast = function (msg, delay) {
                JSBridge.invoke({
                    type: "ui.toast",
                    data: {
                        msg: msg,
                        delay: delay
                    }
                });
            };

            return {
                loading: loading,
                toast: toast
            };
        })();

        Object.assign(JSBridge, {
            net: net,
            cache: cache,
            forward: forward,
            driver:driver,
            ui: ui
        });
    })();


    function findForwardNode(node) {
        var forwardNode = undefined;
        while (node && node !== body) {
            if (node.getAttribute("forward")) {
                forwardNode = node;
                break;
            }
            node = node.parentNode;
        }

        return forwardNode;
    }

    // 为全局超链接绑定点击发起跳转请求
    body.addEventListener("click", function(event) {
        var target = event.target,
            t,
            url,
            method,
            title,
            backUrl,
            newView,
            browser,
            orientation,
            theme,
            _;

        t = findForwardNode(target);

        if (!t) {
            return;
        }

        url = t.getAttribute("href");

        if (/^javascript:.*/i.test(url)) {
            return;
        }

        event.stopPropagation();
        event.cancelBubble = false;
        event.preventDefault();

        method = t.getAttribute("method") || "inside";
        theme = t.getAttribute("theme") || "0";
        newView = !!t.getAttribute("newview");
        browser = !!t.getAttribute("browser");

        b.forward[method]({
            url: url,
            newView: newView,
            browser: browser,
            theme: theme
        });

        return false;
    });

    ;(function () {
        var bridgeAlready = false,
            pageAlready = false;
            
        function alreadyFn() {
            if(bridgeAlready && pageAlready) {
                setTimeout(function() {
                    JSCallback({method: "onReady"});
                },0);
            }
        }

        b.loadFinish(function () {
            bridgeAlready = true;
            alreadyFn();
        });

        w.onload = function () {
            pageAlready = true;
            alreadyFn();
        };
    })();
});