/**
 * JSBridge v0.0.1
 * 
 * 用于HybridApp中JS对App进行调用的桥接模块
 * 对业务层提供JSBridge.invoke函数用于调用App的服务api
 * 内部包含JSBridge(Facade), HandlerMapping, AppInvoke, JSCallback块
 *
 * Versoin: 0.0.1
 * Date: 2017-5-16 9:43:58
 * Author: WRD.APP.Mobile
 */
;(function(g, builder) {
	/*-----------------------------------------------
	 * 判断当前被执行环境是否符合实现了桥接协议的app-
	 *-----------------------------------------------
	 */

	 // 环境所需常量
	var CONSTANT = {
		androidInstance: "appClient",		// android桥接对象名称
		androidMethod: "appInvoke",			// android桥接方法名称
		iosMethod: "appInvoke",				// ios桥接方法名称
		localCaller: "appInvoke"
	},
	// 实现js桥接协议的调用实例对象
	ai,
	// 初始化JSBridge的函数
	initialBridge;

	// 判断当前是否在浏览器或webview环境中执行
	if(!g.document) {
		throw new Error("You are not in Browser or Webview environment.");
	}

	// 如果是Android
	if(typeof g[CONSTANT.androidInstance] === "object" 
		&& typeof g[CONSTANT.androidInstance][CONSTANT.androidMethod] === "function") {

		ai = g[CONSTANT.androidInstance];
		
		if(!ai[CONSTANT.localCaller] || ai[CONSTANT.localCaller] !== g[CONSTANT.androidInstance][CONSTANT.androidMethod]) {
			ai[CONSTANT.localCaller] = g[CONSTANT.androidInstance][CONSTANT.androidMethod];
		}
	} else {
		ai = {};
		ai[CONSTANT.localCaller] = function (message) {
			if(!g[CONSTANT.iosMethod]) {
				throw new Error("You are not in App environment.");
			}
			return g[CONSTANT.iosMethod](message);
		};
	}

	// 绑定到全局作用域下
	g.JSBridge = builder(g,ai);

	// 如果当前环境支持CommonJS模块化,则添加到模块系统中
	if(typeof module === "object" && typeof module.exports === "object") {
		module.exports = {JSBridge: g.JSBridge};
		return;
	}

	// 触发js bridge完成事件
	g.onBridgeFinished && g.onBridgeFinished(g.JSBridge);
})(typeof window !== "undefined" ? window : this,function (g,AppInvoke) {
	// 全局回调函数注册表
	var globalFunctions,
		// 调用app时的回调注册表
		handlerMapping,
		// 调用app的函数封装
		invoke,
		// 创建requestId的函数
		createRequestId,
		// 当前是否正在显示loading
		loadingVisited = false,
		// JSBridge的事件系统
		event;

	/**
	 * globalFunctions,全局回调函数注册表
	 * 包含 add,get,clear
	 */
	globalFunctions = (function () {
		var mapper = {};
		return {
			/**
			 * 添加
			 */
			add: function (name, callback) {
				if(!name) {
					throw new Error("Global function name is empty.");
				}
				if(typeof callback !== "function") {
					throw new Error("Global function must be a function");
				}

				if(mapper[name]) {
					throw new Error("Global function name(" + name + ") is already used. Global function name muse be unique.");
				}

				mapper[name] = callback;
			},
			/**
			 * 获取
			 */
			get: function (name) {
				return mapper[name];
			},
			/**
			 * 清空
			 */
			clear: function () {
				mapper = {};
			}
		};
	})();

	/**
	 * HandlerMapping,app回调注册表
	 * 用于保存业务调用App时传入的回调函数
	 * 
	 * JS调用App流程:
	 * 每次被调用时,JSBridge会为本次调用执行创建一个唯一的requestId,
	 * 随后会将业务请求过来的回调函数以requestId作为key保存到HandlerMapping,
	 * 然后调用AppInvoke将requestId传递到App端,App端执行完成调用JSCallback时回传requestId,t
	 * JSCallback根据requestId从HandlerMapping中获取回调函数并执行
	 *
	 * handler可以是一个已经注册到全局回调函数的函数名 
	 *
	 * 提供api:
	 * add,get,clear
	 *
	 */
	handlerMapping = (function () {

		// 普通回调函数注册容器
		var mapper = {};

		/**
		 * 注册回调,使用requestId,
		 */
		function add(requestId, handler) {

			if(!requestId || !handler) {
				throw new Error("Handler can not be null.");
			}

			// 如果handler不是函数,则判断是否是已注册的全局回调函数
			if(typeof handler === "string") {
				if(!globalFunctions(handler)) {
					throw new Eorror("Handler [" + handler + "] is not defined in gloabal functions.");
				}
			}

			// requestId唯一性校验
			if(typeof mapper[requestId] !== "undefined") {
				throw new Error("Your requestId(" + requestId + ") is already used,requestId must be unique.");
			}

			mapper[requestId] = handler;
		}

		/**
		 *  获取回调,每次获取到回调函数后从注册表中删除
		 */
		function get(requestId) {
			var handler = mapper[requestId];

			if(!handler) {
				return undefined;
			}

			// 从回调列表中删除本次注册
			delete mapper[requestId];
			
			// 如果获取到的handler是字符串,则证明是需要调用全局回调函数
			if(typeof handler === "string") {
				handler = globalFunctions.get(handler);
			}

			return handler;
		}

		/**
		 * 清空所有回调函数
		 */
		function clear() {
			mapper = {};
		}

		return {add: add,get: get,clear: clear};
	})();

	/**
	 * JSCallback,提供给app调用的函数
	 */
	g.JSCallback =  (function() {
		function getCallbackFunction(method, requestId) {
		    var handler;
			if(!method) {
				console.warn("Invalid callback, Result must have a method field.");
				return;
			}

			// 如果不是callback,表示app调用js全局函数,则从全局函数注册表中获取对应函数并执行
			if(method !== "callback") {
				handler = globalFunctions.get(method);

				if(!handler) {
					console.warn("Missing callback, Can not find handler with '" + method + "' in gloabal functions.");
				}

				return handler;

			} 

			// 如果是callback,表示为js调用app的响应,从回调注册表中获取对应的回调并执行
			if(!requestId) {
				console.warn("Invalid callback, 'requestId' must be not empty when method is 'callback'.");
				return;
			}

			// 获取回调
			handler = handlerMapping.get(requestId);

			if(!handler) {
				console.warn("Missing callback, Can not find handler with '" + requestId + "'.");
				return;
			}

			return handler;
		}

		/**
		 * 处理app到js的调用
		 */
		function process(result) {
			// 本次调用对应的回调
			var handler,
				// 本次result中的主体内容
				resultBody,
				// 响应状态类型(success,error)默认error
				resultType = "error",
				// 响应中的业务数据
				resultData,
				// 从global functions中获取到的回调函数
				handlerFunction,
				// 网络执行错误事件
				netErrorEvent;

			if(typeof result === "string") {
				result = JSON.parse(result);
			}

			handler = getCallbackFunction(result.method, result.requestId);

			if(!handler) {
				if(!event.has(result.method)) {
                	return;
				}

				handler = function (data) {
					event.dispatch(result.method, data);
				};
            }

            if(!result.data) {
				console.log("Empty result body.");
			} else {
				try {
	                resultBody = result.data;
	                if(typeof resultBody === "string") {
	                	resultBody = JSON.parse(resultBody);
	                }

	                // 根据响应结果设置成功或失败的类型,以及需要回调的参数值
	                // 默认响应类型为失败,必须result结果中有
	                if(resultBody.status || result.method != "callback") {
	                    resultType = "success";
	                    // 如果成功直接响应result中的data内容
	                    resultData = resultBody.data;
	                } else {
	                	// 如果是失败,则获取对应的失败信息
	                    resultData = {
	                        status: resultBody.status,
	                        message: resultBody.message,
	                        httpCode: resultBody.code_http,
	                        errorCode: resultBody.code_system
	                    };

	                    // 判断是否有绑定网络调用错误事件,有则执行
	                	netErrorEvent = globalFunctions.get("netErrorEvent");
	                	if(netErrorEvent) {
	                		// 如果事件中返回false,则表示需要中断当前执行
	                		if(netErrorEvent(resultData) === false) {
	                			handlerMapping.clear();
	                			return;
	                		}
	                	}
	                }

	            } catch(e) {
	                console.warn("Invalid result body." + e.stack);
	            }
			}

			// 如果获取到的回调是函数,则直接执行,并且不用考虑complete情况
			if(typeof handler === "function") {
				handler(resultBody);
				return;
			}

			// 如果获取到的回调是对象,则需要从中获取对应的succes或error,并需要调用complete
			if(typeof handler === "object") {
				// 如果对应的类型是函数则直接执行
				if(typeof handler[resultType] === "function") {
					handler[resultType](resultData);
				} 
				// 如果是字符串,则在全局回调函数中寻找是否有对应的函数,如果有,则执行
				else if(typeof handler[resultType] === "string") {
					handlerFunction = globalFunctions.get(handler[resultType]);
					if(typeof handlerFunction === "function") {
						handlerFunction(resultData);
					} else {
						console.warn("Missing callback, Can not find function '" + handler[resultType] + "' in global callbacks: " + JSON.stringify(handler));
					}
				} else {
					console.warn("Missing callback, Handler do not have method '" + resultType + "'. handler: " + JSON.stringify(handler));
				}

				// 无论执行成功或失败,只要有complete都会执行
				handler["complete"] && handler["complete"]();

				return;
			}

			// console.log("Invalid handler." + handler);
		}

		return function (result) {
			// console.log("Handle app call js. result: " + JSON.stringify(result));

			if(!result) {
				console.warn("Empty callback result, Something wrong in app?");
			} else {
				process(result);
			}
		};
	})();

	/**
	 * 创建requestId
	 */
	createRequestId = (function () {
		var i = 0;
		return function(invokeCommand) {
			return (invokeCommand || "anonymous") + "_" + Date.now() + "_" + (++i);
		};
	})();

	/**
	 * 调用app的函数
	 */
	invoke = function (settings) {
		var json,
			result,
			requestId,
			command,
			invokeEvent,
			invokeServiceEvent,
			invokeServiceMethodEvent,
			tempResult;

		if(!settings) {
			throw new Error("Invoke argument settings can not be empty.");
		}

		if(typeof settings.type !== "string" || settings.type.indexOf(".") == -1) {
			throw new Error("Invoke argument type is not valid.");
		}

		// 创建requestId
		requestId = createRequestId(settings.type);

		// 拆分命令成serviceName 和 methodName
		command = settings.type.split(".");

		// invoke事件
		invokeEvent = globalFunctions.get("invoke")
		if(invokeEvent) {
			invokeEvent(settings);
		}

		// 调用模块事件
		invokeServiceEvent = globalFunctions.get("invoke."+command[0])
		if(invokeServiceEvent) {
			invokeServiceEvent(settings);
		}

		// 调用模块中的动作事件
		invokeServiceMethodEvent = globalFunctions.get("invoke."+settings.type)
		if(invokeServiceMethodEvent) {
			invokeServiceMethodEvent(settings);
		}

		// 如果传入了任意回调处理函数,则需要添加到回调函数中
		if(settings.success || settings.error || settings.complete) {
			// 保存调用完成回调
			handlerMapping.add(requestId, {
				success: settings.success,
				error: settings.error,
				complete: settings.complete
			});
		}

		// 构造请求数据,并转为json字符串
		json = JSON.stringify({
			requestId: requestId,
			service: command[0],
			method: command[1],
			data: settings.data
		});

		try {
			console.log("invoke api, param:" + json);

			// 调用app服务
			result = AppInvoke.appInvoke(json);

			// console.log("invoke api, return[" + typeof(result) + "] :" + result);

			return result;
		} catch(e) {
			console.error("AppInvoke has some problem." + e.stack);
			settings.error && settings.error(e);
			settings.complete && settings.complete();
		} finally {
			// console.groupEnd("Invoke " + settings.type);
		}
	}

	function makeEvent(eventName) {
		var trigged = false,
			callbacks = [];

		globalFunctions.add(eventName, function () {
			trigged = true;
			if(!callbacks || !callbacks.length) {
				return;
			}

			for(var i=0;i<callbacks.length;i++) {
				callbacks[i]();
			}
		});

		return function (fn) {
			callbacks.push(fn);
			if(trigged) {
				fn();
				return ;
			}
			
		};
	}

	/**
	 * 新的事件系统
	 */
	event = (function () {
		var events = {};

		/**
		 * 绑定事件
		 * @param ename 
		 * 			事件名
		 * @param fn 
		 * 			回调函数
		 * @param times 
		 * 			事件可触发次数，默认为无限次（Infinity）
		 */
		function on(ename, fn, times) {
			if(!ename) {
				throw new Error("Event name is require.");
			}

			if(!fn) {
				throw new Error("Event callback is require.")
			}

			// 如果没有指定事件次数，则表示无限次数
			if(!times) {
				times = Infinity;
			}

			// 如果首次绑定，为其创建一个数组，作为事件列表容器
			if(!events[ename]) {
				events[ename] = [];
			}

			// 将事件添加到列表中
			events[ename].push({
				callback: fn,
				triggedTimes: 0,
				lifeTimes: times
			})

		}

		/**
		 * 绑定单次事件，触发一次之后就会删除不再被触发
		 * @param ename 
		 * 			事件名
		 * @param fn 
		 * 			回调函数
		 */
		function one(ename, fn) {
			on(ename, fn, 1);
		}

		/**
		 * 触发指定事件
		 * @param ename 
		 * 			事件名称
		 * @param event 
		 * 			事件信息对象
		 */
		function dispatch(ename, event) {
			var elist = events[ename],
			pass = true,
			lifeIndexes = [];

			// 如果没有绑定该事件，则直接返回
			if(!elist || !elist.length) {
				return;
			}

			// 遍历事件回调函数列表并执行
			elist.forEach(function (e, i) {
				// 如果触发次数已经达到预定次数则不触发
				if(e.triggedTimes >= e.lifeTimes) {
					return;
				}

				// 触发事件，如果事件返回为false，则表示不继续往下执行
				pass = (!(e.callback(event) === false)) && pass;
				// 触发次数累计
				e.triggedTimes ++;
				// 触发后如果依然有效，则记录该索引
				if(e.triggedTimes < e.lifeTimes) {
					lifeIndexes.push(i);				
				}
			});

			// 重新获取依然有效的事件列表
			if(lifeIndexes.length) {
				events[ename] = lifeIndexes.map(function (v,i) {
					return elist[v];
				})
			
			// 如果没有有效列表，则删除该事件
			} else {
				delete events[ename];
			}

			return pass;

		}

		/**
		 * 清空所有事件
		 */
		function clear() {
			events = {};
		}

		/**
		 * 删除指定事件
		 * @param ename 
		 * 			事件名
		 * @param fn 
		 * 			事件回调函数，如果传入了回调则只删除传入的函数，否则删除所有
		 */
		function remove(ename, fn) {
			var elist = events[ename],
				fnIndex;

			// 未绑定事件则返回
			if(!elist) {
				return;
			}

			// 如果fn为空，则为删除所有
			if(!fn) {
				delete events[ename];
				return;
			}

			// 否则获取fn位置并删除
			fnIndex = elist.indexOf(fn);
			if(fnIndex == -1) {
				return;
			}

			// 删除该函数
			elist.splice(fnIndex,1)
		}

		/**
		 * 判断是否已经绑定了某个事件
		 * @param ename 
		 * 			事件名
		 * @param fn
		 * 			指定回调函数，如果传入了函数参数，则只判断事件列表中是否包含该参数函数，否则只要绑定过该事件则为true
		 */
		function has(ename,fn) {
			var elist = events[ename];
			return fn ? elist.includes(fn) : (elist && elist.length)
		}

		return {
			on: on,
			one: one,
			clear: clear,
			remove: remove,
			has: has,
			dispatch: dispatch
		};
	})();

	return {
		invoke: invoke,
		registerFunction: globalFunctions.add.bind(globalFunctions),
		/**
		 * JSBridge加载完成事件,当webview加载完成后会触发网页的loadFinish事件
		 * 将需要依赖bridge请求的操作放到loadFinish中
		 */
		loadFinish: makeEvent("loadFinish"),
		onReady: makeEvent("onReady"),
		event: event,
		on: event.on.bind(event),
		one: event.one.bind(event),
		dispatch: event.dispatch.bind(event)
	};
});