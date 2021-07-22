;(function (w){
	var newView;

	w.ENV_MODEL = "dev";
	
	function invokePhpBridge(params, async) {
		var requestId = params.requestId,
		result;
		params.data = params.data ? encodeURIComponent(JSON.stringify(params.data)) : "";
		$.ajax({
			url: "/gateway",
			type: "POST",
			async: async,
			data: params,
			dataType: "json",
			success: function (res) {
				if(!res) {
					return undefined;
				}
				if(async) {
					JSCallback(JSON.stringify({
						requestId: requestId,
						method: "callback",
						data: JSON.stringify(res)
					}));
				} else {
					result = JSON.stringify({
						requestId: requestId,
						data: res,
						status: true
					})
				}
			},
			error: function (e) {
				var errorMessage = JSON.stringify({
					requestId: requestId,
					method: "callback",
					code_http: 500,
					message: "访问接口失败",
					status: false,
					data: JSON.stringify({
						code_http: 500,
						message: "访问接口失败",
						status: false
					})
				});
				if(async) {
					JSCallback(errorMessage);
				} else {
					result = errorMessage;
				}
			}
		});
		return result;
	}

	var services = {
		net: function (params) {
			return invokePhpBridge(params, true);
		},
		cache: function(params) {
			return invokePhpBridge(params, false);
		},
		ui: function (params) {
			if(params.method == "loading") {
				$.loading[params.data.state]();
			}
		},
		driver:function (params) {
			function resultData(data) {
				return {
					status: true,
					requestId: params.requestId,
					data: JSON.stringify(data)
				};
			}
			return JSON.stringify(({
				live800: function () {
					window.open('https://www.lecheng5288.com/chat/chatClient/chatbox.jsp?companyID=9001&configID=15&k=1');
				},
				toggleGesture: function() {
					JSCallback({"method": "notifyToggleGesture", data: {isShow: params.data.isShow}});			
				},
				toggleGesture: function () {
					JSCallback({"method": "notifyToggleGesture", data: {isShow: params.data.isShow}});
				},
				resetGesture: function (){
					$.toast.success("弹出手势密码修改");
				},
				getSessionId: function () {
					return resultData({
						sessionId: "12345"
					});
				},
				deviceInfo: function () {
					return resultData({
						drice_id: "12345",
						drice_type: "android"
					});
				}

			})[params.method]());
		},
		forward: function (params) {
			var url = params.data.url,
			urlSplits,
			anchor,
			customer = CustomerUtils.getCustomer();
			if(params.method === "inside") {
				url = "/" + url;
			} else if(CustomerUtils.isLoged()){
				urlSplits = url.split("#");
				urlSplits[0] += urlSplits[0].indexOf("?") > -1 ? "&" : "?";
				urlSplits[0] += "appToken=" + JSBridge.cache.get("appToken");
				urlSplits[0] += "&userToken=" + customer.user_token;
				urlSplits[0] += "&accountName=" + customer.login_name;
				if(urlSplits.length > 1) {

					urlSplits[0] += "#" + urlSplits[1];
				}

				url = urlSplits[0];
			}

			if(params.data.browser) {
				window.open(url);
				return;
			}

			if(params.data.newView) {
				if(opener) {
					location = url;
					return;
				}

				if(newView && !newView.closed)  {
					newView.location = url;
					return
				}

				newView = window.open(url);
				return;
			}
			
			// if(opener) {
			// 	opener.location = url;
			// 	//setTimeout(close,1000);
			// 	return;
			// }
			location = url;
		}

	};

	w.appClient = {
		appInvoke: function (params) {
			var reqParam = JSON.parse(params);
			return services[reqParam.service](reqParam);
		}
	};

	w.onBridgeFinished = function () {
		setTimeout(function () {
			// if(document.domain == "hybrid.a01.net") {
			JSBridge.cache.save("domain", "http://m.918.com/");
			JSBridge.cache.save("cdnurl", "http://m.918.com/");
			JSBridge.cache.save("appToken", "jrutx92l1a33jjbi68rcel2951toxjvt5me7gsbcqa2t9rqcd33mbhq8ln2nhq63");
			// } else {
			// 	JSBridge.cache.save("domain", "http://hybrid.a01.net/");
			// 	JSBridge.cache.save("cdnurl", "http://hybrid.a01.net/");
			// 	JSBridge.cache.save("appToken", "y9gimyesg6xid0k8opnu90yu6615g88o2b5kl6uykn68vqyldakie77ikdmfqkhf");
			// }
			
			JSCallback({method: "loadFinish"});
		}, 200);
	};
})(window);