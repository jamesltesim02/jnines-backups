
;(function (w) {
    // if($.appVersion().isApp) {
    //     return;
    // }

    /**
     * 全局提取调用PHPBridge的函数
     *
     * @param params    请求参数
     * @param callback  执行结果回调
     * @param async     是否异步执行，默认为true
     */
    w.invokeContainerBridge = function (params,callback, async) {
        var returnResult;

        params.data = params.data ? encodeURIComponent(JSON.stringify(params.data)) : "";
        async = !(async === false);

        // TODO 菊花控制

        // ajax请求bridge
        $.ajax({
            url: "/gateway",
            type: "POST",
            data: params,
            dataType: "json",
            async: async,
            success: function(result) {
                // 如果为异步,则通过回调函数返回,否则通过return的方式返回
                if (async) {
                    callback && callback(null, result);
                } else {
                    returnResult = result
                }
            },
            error: function() {
                returnResult = {
                    code_http: 500,
                    message: "访问接口失败"
                };
                if (async) {
                    callback && callback(returnResult);
                }
            },
            complete: function() {
                // TODO 关闭菊花显示
            }
        });
        
        return returnResult;
    }


    /**
     * 针对特殊缓存值处理
     *
     * 对应app上需要用app外壳写入到缓存中的值
     */

    var cacheShims = {
        alreadys: {},
        /**
         * 获取domain
         */
        domain: function() {
            return location.protocol + "//" + location.host + "/";
        },

        /**
         * 获取cdn地址
         */
        cdnurl: function() {
            var result = JSBridge.net.invoke({
                url: "app/getCDNHostDns",
                data: {
                    async: false
                }
            });
            if (!result) {
                return "";
            }
            result = JSON.parse(result);

            return result.data.cdnHost;
        }
    };


    // 针对domain和cdnurl单独处理，在get之前先保存
    JSBridge.on("beforeGetCahce", function (event) {

        if(!cacheShims[event.key]) {
            return;
        }

        if(cacheShims.alreadys[event.key]) {
            return;
        }

        var value = cacheShims[event.key]();
        JSBridge.cache.save(event.key, value);
        cacheShims.alreadys[event.key] = true;
    });


    /**
     * 提取操作PHPBridge中的缓存接口函数
     */ 
    function invokeBridgeCache(method,data,fn) {
        return invokeContainerBridge({
            service: "cache",
            method: method,
            data: data
        }, fn);

    }
    
    // 保存user_token给phpbridge使用
    JSBridge.on("afterSaveCahce", function (data) {
        var value;
        if(data.key != "customer") {
            return;
        }

        value = JSON.parse(data.value).cacheValue;

        if(!value.user_token) {
            return;
        }

        invokeBridgeCache(
            "save",
            {
                key: data.key,
                value: JSON.stringify({
                    cacheValue: {
                        login_name: value.login_name,
                        user_token: value.user_token
                    }
                })
            },
            function () {
                //JSBridge.cache.save("token_saved_to_bridge", true);
            }
        )
    });

    // 删除customer时删除bridge中的token
    JSBridge.on("afterDeleteCahce", function (data) {
        var value;
        if(data.key != "customer") {
            return;
        }

        invokeBridgeCache(
            "delete", 
            {key: data.key},
            function () {
                JSBridge.cache.save("token_saved_to_bridge", false);
            }
        )
    });

    // 清空时也删除token
    JSBridge.on("afterClearCahce", function (data) {
        if(data.key != "customer") {
            return;
        }

        if(!JSBridge.cache.get("token_saved_to_bridge")) {
            return;
        }

        invokeBridgeCache(
            "delete", 
            {key: "customer"},
            function () {
                JSBridge.cache.save("token_saved_to_bridge", true);
            }
        )
    });

    /**
     * JSBridge Website Shim
     *
     * 底层用js实现app端实现的业务
     * 包含appClient对象service服务对象(cache, net, ui, forward, driver)
     * 页面加载完成后触发loadFinish事件
     *
     * Versoin: 0.0.1
     * Date: 2017-11-17 13:16:56
     * Author: WRD.APP.Mobile
     */
    // 所有实现的service服务注册表
    var services,
        // 缓存服务
        cache,
        // 网络服务
        net,
        // ui服务
        ui,
        // 跳转服务
        forward,
        // 内部驱动服务
        driver;

    /**
     * 缓存服务模块
     */
    cache = {

        /**
         * 存储数据到缓存
         *
         * @param data 请求参数数据
         *		{
         *			key: 键
         *			value: 值
         *		}
         */
        save: function(data) {
            if (!data || !data.key) {
                return;
            }

            // 前置事件
            JSBridge.dispatch("beforeSaveCahce", data);

            store.set(data.key, data.value);

            // 后置事件
            JSBridge.dispatch("afterSaveCahce", data);
        },

        /**
         * 修改缓存中的数据
         *
         * @param data 请求参数数据
         *		{
         *			key: 键
         *			value: 值
         *		}
         */
        update: function(data) {
            // 前置事件
            if(JSBridge.dispatch("beforeUpdateCahce", data) === false) {
                return;
            };
            
            store.set(data.key, data.value);

            // 后置事件
            JSBridge.dispatch("afterUpdateCahce", data);
        },

        /**
         * 从缓存中获取数据
         *
         * @param data 请求参数数据
         *       {
         *           key: 键
         *       }
         *
         * @return 值
         */
        get: function (data) {
            var cacheValue,
            realValue;

            // 前置事件
            JSBridge.dispatch("beforeGetCahce", data)

            cacheValue = store.get(data.key),

            // 后置事件
            JSBridge.dispatch("beforeAfterCahce", data)

            return cacheValue;
        },

        /**
         * 从缓存中删除数据
         *
         * @param data 请求参数数据
         *		{
         *			key: 键
         *		}
         */
        delete: function(data) {
            var r;

            if(JSBridge.dispatch("beforeDeleteCahce", data) === false) {
                return;
            }
            
            r = store.remove(data.key);

            JSBridge.dispatch("afterDeleteCahce", data)

            return r;
        },

        /**
         * 清空缓存中的数据
         *
         */
        clear: function() {
            var r;
            
            if(JSBridge.dispatch("beforeClearCahce", data) === false) {
                return;
            }
            
            r = store.clearAll();

            JSBridge.dispatch("afterClearCahce", data)
            return r;
        }
    };

    /**
     * 网络服务模块
     */
    net = {
        /**
         * 调用网络
         * 
         * @param data 请求参数数据
         *			{
		 * 				
         * 			}
         * @param callback 执行完后的回调函数,用于返回接口的数据
         */
        invoke: function(data, callback) {
            var async = !(data && data.params && data.params.async === false);
            return invokeContainerBridge({
                    service: "net",
                    method: "invoke",
                    data: data
            }, callback,async);
        }
    };

    /**
     * UI服务模块
     */
    ui = {

        /**
         * 显示loading效果
         *
         * @param data 请求参数数据
         *
         */
        loading: function(data) {
            console.log("菊花显示隐藏控制:" + JSON.stringify(data));
        }
    };

    /**
     * 跳转服务模块
     */
    forward = (function() {
        /**
         * 跳转到对应地址
         *
         * @param data 请求参数数据
         *
         */
        function forwardTo(data) {
			var url = data.url;
			// 如果不是全地址,则补全为当前域名地址	
			if(/^\w+?\/\w+?\.htm/gi.test(url)) {
				url = OtherUtils.getDomain() + url;
			}

			// 只有登录游戏时才用newView打开
			if(data.gameType){
                window.open(url);
                return
			}
			
			if(data.newViewWeb){
                window.open(url);
                return
            }

			// 否则在当前页面中打开
			location = url;
        }

        return {
            outside: forwardTo,
            inside: forwardTo
        };
    })();

    /**
     * 内部驱动服务模块
     */
    driver = {
        /**
         * 清除cookie
         */
        clearCookie: function(data) {
            Object.getOwnPropertyNames(Cookies.get()).forEach(function(v, i) {
                Cookies.remove(v);
            });
        },
        /**
         * 复制内容到剪贴板
         * @param data 请求参数数据
         * 			{ 
         * 				value: 被复制的内容 
         * 			}
         */
        copy: (function() {
            var cliper, clipdom;
            return function(data) {

                if (!data || !data.value) {
                    return;
                }

                if (!cliper) {
                    clipdom = document.createElement("button");
                    clipdom.className = "clip-button";
                    clipdom.style.display = "none";
                    document.body.appendChild(clipdom);

                    cliper = new Clipboard(".clip-button", {
                        text: function(target) {
                            return data.value;
                        }
                    });

                    cliper.on("success", function(e) {
                        $.toast.success("复制成功");
                    });

                    cliper.on("error", function(e) {
                        $.toast.success("复制失败,请重试");
                        console.error(e);
                    })
                }
                clipdom.click();
            };
        })(),
        game: function(data) {},
        deviceInfo: function(data) {return {}},
        IPSUnread: function(data) {},
        live800: function(data) {},
        toggleGesture: function(data) {},
        resetGesture: function(data) {},
        getVersion: function(data) {},
        checkUpdate: function(data) {},
        log: function(data) {},
        getSessionId: function (data){return {}},
        getParentId: function (data){return {}},
        getPalCode: function (data){return {}},
        getCookiedPalCode: function (data){return {}}
    };

    /**
     * 将实现的服务添加到注册表中,以便按请求获取对应服务调用
     */
    services = {
        cache: cache,
        net: net,
        ui: ui,
        forward: forward,
        driver: driver
    };

    /**
     * 全局注册appClient对象,模拟iOS端提供js接口
     * 调用入口
     *
     * @param appInvoke 调用
     */
    w.appInvoke = function(params) {
        // 解析请求参数
        var reqParam = JSON.parse(params),
            // 服务对象
            service = services[reqParam.service],
            // 请求id
            requestId = reqParam.requestId,
            // 请求参数
            reqData = reqParam.data,
            // 处理结果
            result;


        // 没找到对应的服务
        if (!service) {
            throw new Error("Service '" + reqParam.service + "' not found.");
        }

        // 没找到对应的方法
        if (!service[reqParam.method]) {
            throw new Error("Method '" + reqParam.method + "' not found in service '" + reqParam.service + "'.");
        }

        // 分发调用对应模块
        result = service[reqParam.method](
            // 请求参数
            reqData,
            /**
             * 异步处理回调,当调用异步处理服务时需要通过JSCallback回调jsbridge
             * 目前只有net模块是异步回调的方式
             */
            function(error, result) {

                // 如果error参数不为空,则表示调用过程中遇到错误
                var callbackData = error ? {
                    status: false,
                    code_http: error.code_http,
                    message: error.message,
                    data: error
                } : {
                    status: true,
                    data: JSON.stringify(result)
                };

                // 设置回调对应request id
                callbackData.requestId = requestId;
                callbackData.method = "callback";

                // 回调jsbridge
                JSCallback(callbackData);
            }
        );

        if (!result) {
            return;
        }

        // 默认设置为执行成功
        if (typeof(result.status) === "undefined") {
            result = {
                status: true,
                data: result
            };
        }

        // 设置requestId，请求和响应对应
        result.requestId = requestId;

        // 返回执行结果
        return JSON.stringify(result);
    };


   // 页面加载完成触发loadFinish事件
   JSCallback({ method: "loadFinish" });

})(window);