/**
 * <h2>Commons</h2>
 * 
 * Toast,Loading,Pop
 * 
 * @author Ivi
 * @version 1.0
 */
;(function (w,$) {
	"use strict";
	// 网页body对象,用于全局添加元素
	var b = $('body');
	
	/**
	 * <h3>Toast</h3>
	 * <p>弹出提示消息:</p>
	 * <code>
	 * 		// 显示成功消息
	 * 		$.toast.success('hehe'[, 2000, callback]);
	 * 		// 显示失败消息
	 * 		$.toast.fail('hehe'[, 2000, callback]);
	 * 		
	 * 		参数1: 消息内容
	 * 		参数2: 持续时间.默认2秒  非必须
	 * 		参数3: 关闭时的回调函数  非必须
	 * </code>
	 */
	;(function () {
		
		// toast默认显示时间
		var defaultDuration = 1500,
		// toast显示内容模板
		toastTmpl = ''
			+'<div class="toast">'
			+'<div class="toast-content">'
			+	'<img class="toast-icon" src="">'
			+	'<div class="toast-message">提示信息</div>'
			+'</div>'
			+'</div>',
		// 全局toast对象(单例)
		ct,
		// toast的图标
		ctIcon,
		// toast的消息对象
		ctMsg,
		// 关闭toast的Timer
		ctTimer,
		toastImages = {
			success: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTJENTZDQjVDRUY0MTFFNjgzODdGOTcxRDNCMTM2NUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTJENTZDQjZDRUY0MTFFNjgzODdGOTcxRDNCMTM2NUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMkJGQzE1MENFRjQxMUU2ODM4N0Y5NzFEM0IxMzY1RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMkQ1NkNCNENFRjQxMUU2ODM4N0Y5NzFEM0IxMzY1RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pnlga4IAAAAGUExURf///////1V89WwAAAACdFJOU/8A5bcwSgAAARJJREFUeNrs2UEOwjAMRNHf+18aIYGE2tqxYxMoTNaevAUSmaRsCxZChAj5ZoT7Sm9lhrCms4wXwhnPKG4Ibzyu+CHc8agyCH0EYQahiDCDIESIECFCLoS85Tz5neN3TVtZ07vWNMhHIl+rzZDuJ0KECBEiRIiQqyBTNSjWj9iVsz7iZTMqrTHaJg8IjcZzM46tvNGwEfoMB6HNwPpNasrpPlRucdF7HVunYmxC7XIdu2mztSl2nuprRCSMO8g0gf1XDz1vK7sYw3EmCJKvRAMnNE8sdf7QEJ1MZKMr+ezRQ7ifANsMs600Ek4l6iPc3tVmDMpdhxBokA1EqKbWgEQXLgjpwj15oul+IkTIPyE3AQYAGbIf0DhPX+AAAAAASUVORK5CYII=",
			fail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTJCRkMxNDZDRUY0MTFFNjgzODdGOTcxRDNCMTM2NUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTJCRkMxNDdDRUY0MTFFNjgzODdGOTcxRDNCMTM2NUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMkE0RTU5RkNFRjQxMUU2ODM4N0Y5NzFEM0IxMzY1RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMkE0RTVBMENFRjQxMUU2ODM4N0Y5NzFEM0IxMzY1RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ps5KEcwAAAAGUExURf///////1V89WwAAAACdFJOU/8A5bcwSgAAANpJREFUeNrs2NEKAjEMRNHZ//9pwTdt0jbNsIrevDadA4IlG103lEBAQEBAvgXRs9qRQ4qG064SpGg87SlRCggICAgICMgnkVsGiXtGIsZUEBAQEBCQ/0MUlg/RovqItqqDqFCHiIpVR3RUNURyKnISGSMvETNyExGjsrHXM0OKv/Vmt3YunfxhM+T4aVrd06K38UZHSOMpX93WpOv023oIUNrS+YR/y1By3t0UvMQkSH8fsUQ8a4854ll7zBHP2mOOGMasBLmMxhgm74YoTmPgBgEBAfl55CHAALvOIS877IYQAAAAAElFTkSuQmCC"
		};
		
		/**
		 * 显示toast
		 */
		function toast(type,msg,duration,callback) {
			
			// duration参数位置可以为空,但如果不为空必须为number类型的时间或回调函数(function)
			if(duration && typeof(duration) != 'number' && typeof(duration) != 'function') {
				throw new Error('second argument must be number of duration or function of callback.');
			}
			
			// 构造Toast
			if(!ct) {
				ct = $(toastTmpl);
				ctIcon = ct.find('img.toast-icon');
				ctMsg = ct.find('div.toast-message');
				ct.appendTo(b);
			}
			
			// 清除以前的关闭Timer
			if(ctTimer) {
				clearTimeout(ctTimer);
			}
			
			// 设置对应的图标和消息内容
			ctIcon.attr('src', toastImages[type]);
			ctMsg.html(msg||'&nbsp;');
			ct.hide().fadeIn('fast');
			
			/*
			 *  duration为function,则表示该参数位为回调函数
			 *	则赋值给callback,并让duration为默认的关闭时间
			 */
			if(typeof(duration) == 'function') {
				callback = duration;
				duration = null;
			}
			
			if(!duration) {
				duration = defaultDuration;
			}
			
			// 定时关闭toast,并触发关闭事件
			ctTimer = setTimeout(function () {
				ctTimer = null;
				ct.fadeOut('fast', callback);
			}, duration);
		}
		
		/*
		 * 为jQuery添加toast的静态方法
		 */
		$.extend({
			'toast': {
				// 成功消息
				'success': function (msg,duration,callback){
					toast('success', msg, duration, callback);
				},
				// 失败消息
				'fail': function (msg,duration,callback) {
					toast('fail', msg, duration, callback);
				}
			}
		});
	})();
	
	
	/**
	 * <h3>Loading</h3>
	 * <p>加载进度条:</p>
	 * <code>
	 * 		// 显示加载进度条
	 * 		$.loading.show();
	 *		// 隐藏加载进度条
	 * 		$.loading.hide();
	 * </code>
	 */
	;(function () {
		// 加载进度控件
		var loading,
		// 加载进度模版
		loadingTmpl = '<div class="loading container">'
			+ 	'<div class="common-cover center">'
			+ 		'<section class="range">'
			+ 		    '<span></span>'
			+ 		    '<span></span>'
			+ 		'</section>'
			+ 	'</div>'
			+ '</div>',
		_;
		
		/**
		 * 显示进度条
		 */
		function show() {
			if(!loading) {
				loading = $(loadingTmpl);
				b.append(loading);
			}
			loading.hide().fadeIn('fast');
			b.addClass('covered');
		}
		
		/**
		 * 隐藏进度条
		 */
		function hide() {
			loading && loading.fadeOut('fast', function () {
				b.removeClass('covered');
			});
		}
		
		// 为jQuery添加loading的静态方法
		$.extend({
			loading: {
				'show': function () {show();},
				'hide': function () {hide();}
			}
		});
		
		$(function() {
			// 为全局a标签绑定加载进度效果
			//$('a.loading,.click-loading').click(function () {$.loading.show();return true;});
			// 为全局的form表单绑定加载进度效果
			//$('form.loading').on("submit", function () {$.loading.show();return true;});
		});
	})();
	
	/**
	 * 获取表单输入内容为对象
	 */
	$.fn.extend({
		getFields: function () {
			var i,data = {}, input,
				name, value, currValue,
				inputs = this.find(':input:not([disabled],.disabled)');
			
			for(i=0;i<inputs.length;i++) {
				input = inputs.eq(i);
				name = input.attr('name');
				
				if(!name) {continue;}
				
				value = input.val();
				
				if(input.is(':radio,:checkbox')) {
					if(!input[0].checked) { continue; }
					
					value = value || 'on';
				}
				
				currValue = data[name];
				
				if(!currValue) {
					data[name] = value;
					continue;
				}
				
				if($.isArray(currValue)) {
					currValue.push(value);
					continue;
				}
				
				data[name] = [value];
			}
			
			return data;
		}
	});
	
	
	/**
	 * <h3>Pop</h3>
	 * <p>弹出对话框:</p>
	 * <code>
	 * 
	 * 	 $.pop.msg 弹出对话框
	 * 
	 * 			close: 是否需要关闭按钮 [可选]
	 * 			title: 标题 [可选]
	 * 			content: 内容 [必须]
	 * 			operation: 操作按钮 [可选]
	 * 				[
	 * 					{
	 * 						text: "确定",  // 按钮文字
	 * 						event: function(event) {...} // 按钮事件 [可选]
	 * 						close: false // 是否关闭对话框,默认按钮都会关闭对话框,如果不想关闭必须设置为false [可选]
	 * 									    可在回调时间中使用this.close 或 通过回调中的event.target.close来关闭对话框
	 * 					}
	 * 					...
	 * 				]
	 * 		$.pop.msg(close,title,content,operations);
	 * 
	 * 	$.pop.alert 弹出提示对话框,只有一个确定按钮
	 * 			title 标题 [可选]
	 * 			content: 内容 [必须]
	 * 			callback: 事件 [可选]
	 * 		$.pop.alert(title,content,callback);
	 * 
	 * 	$.pop.confirm 弹出确认对话框,包含确定和取消两个按钮
	 * 			title 标题 [可选]
	 * 			content: 内容 [必须]
	 * 			y: 确认按钮事件 [可选]
	 * 			n: 取消按钮事件 [可选]
	 * 				*** 回调是按顺序进行匹配, 第一个参数是y,第二个是n,如果想只设置n,则也必须为y设置一个空(null或undefined)参数
	 * 					$.pop.confirm("标题","内容",null,function () { 回调 });
	 * 		$.pop.confirm(title,content,y,n);
	 * </code>
	 */
	;(function () {
		var Pop,
		popTmpl = ''
			+ '<div class="pop container">'
			+ 	'<div class="common-cover center">'
			+ 		'<div class="dialog">'
			+ 			'<a class="btn-close close-operate button"></a>'
			+ 			'<section>'
			+ 				'<h3></h3>'
			+ 				'<div class="content"></div>'
			+ 			'</section>'
			+ 			'<div class="d-footer"></div>'
			+ 		'</div>'
			+ 	'</div>'
			+ '</div>',
		_;
		
		function Pop(settings) {
			if(!settings.content) {
				throw new Error('The pop must have content.');
			}
			
			this.settings = settings;
			this.init();
		}
		
		Pop.prototype = {
			init: function () {
				var _this = this,comp,cb,t,cott,ft,s = this.settings, oprtsHtml = '', ek, oms = {};
				
				comp = this.comp = $(popTmpl);
				cb = this.closeBtn = comp.find('.btn-close');
				t = this.title = comp.find('h3');
				cott = this.content = comp.find('.content');
				ft = this.footer = comp.find('.d-footer');
				
				if(!s.close) {
					cb.hide();
				}
				
				if(s.title) {
					t.html(s.title);
				} else {
					t.hide();
				}
				
				if(s.content.indexOf(':') != -1) {
					cott.css('text-align', 'left');
					cott.html("<p>" + decodeURIComponent(s.content.replace(':', ':<br><br></p><p>')) + '</p>');
				} else {
					cott.html(decodeURIComponent(s.content));
				}
				
				
				if(!s.operations || !s.operations.length) {
					s.operations = [{text: '确定'}];
				}
				
				$.each(s.operations, function (i, v) {
					ek = 'opt-' + i;
					oms[ek] = v.event;
					oprtsHtml += '<a' + (v.close !== false ? ' class="close-operate"' : '') + ' data-event="' + ek + '" herf="javascript: void(0);">' + v.text + '</a>';
				});
				
				ft.append(oprtsHtml).addClass("cols-" + s.operations.length);
				
				comp.on('click', 'a', function (e) {
					var t = $(this),et = oms[t.data('event')];
					if(et) {
						et.call(_this, {target: _this});
					}
					if(t.is('.close-operate')) {
						_this.close();
					}
				});
				
				comp.on("click", "img.captcha_img", function () {
					this.src = "genCaptcha.htm?t=" + new Date().getTime();
				});
				
				b.append(this.comp);
				this.comp.hide();
			},
			show: function () {
				this.comp.fadeIn('fast', function () {
					b.addClass('covered');
				});
			},
			close: function () {
				var c = this.comp;
				b.removeClass('covered');
				c.fadeOut('fast', function () {
					c.remove();
				});
			},
			getComponent: function () {
				return this.comp;
			}
		}
		
		$.extend({
			pop: {
				alert: function () {
					if(typeof(arguments[1]) != "string") {
						Array.prototype.unshift.call(arguments, undefined);
					}
					$.pop.msg(arguments[0],arguments[1],[{text: '确定',event: arguments[2]}])
				},
				confirm: function () {
					if(typeof(arguments[1]) != "string") {
						Array.prototype.unshift.call(arguments, undefined);
					}
					$.pop.msg(arguments[0],arguments[1],[{text: '确定',event: arguments[2]},{text: '取消',event: arguments[3]}])
				},
				msg: function () {
					var args = arguments,close = false, title, content, operations;
					
					if(typeof args[0] == 'boolean') {
						close = args[0];
						Array.prototype.shift.call(args);
					}
					
					if(typeof args[1] != 'string') {
						title = undefined;
						content = args[0];
						operations = args[1];
					} else {
						title = args[0];
						content = args[1];
						operations = args[2];
					}
					
					return new Pop({
						close: close,
						title: title,
						content: content,
						operations: operations
					}).show();
				}
			}
		});
	})();
	
	;(function () {
		var _w = $(w),
		direction,
		lastPosition = 0,
		areadyIn = false,
		callback,
		_;
		
		$.fn.extend({
			"upIn": function (fn) {
				var _this = $(this),
				timer;
				
				if(fn && typeof(fn) == "function") {
					callback = fn;
				} else {
					callback && callback.call(_this, {target: _this, srcElement: _this});
				}
				
				$(document).scroll(function(e) {
					var wt = _w.scrollTop(),
					wb = wt + _w.height(),
					et = !_this.offset() ? 0 : _this.offset().top,
					eb = et + _this.height(),
					lt = lastPosition;
					
					direction = lt < wt ? "up" : "down";
					lastPosition = wt;
					
					if(et > wt && et < wb) {
						clearTimeout(timer);
						timer = setTimeout(function () {
							areadyIn = true;
							e.target = e.srcElement =  _this[0];
							fn.call(_this, e);
						},100);
					} else {
						areadyIn = false;
					}
				});
				
				return _this;
			}
		});
	})();


	;(function () {
		var params = {};
		location.search && (function () {
			location.search
			.replace(/^\?/, "")
			.split("&")
			.forEach(function (p,i) {
				var kv = p.split("=");
				params[kv[0]] = kv[1];
			});
		})();
		$.extend({
			"getParam": function(key, val) {
				if (params.hasOwnProperty(key)) {
					return params[key];
				}
				
				return val;
			},
            "toParam": function(data) {
                var res ='';
                if(data){
                    res = $.param(data);
                }

                return res;
            },
			"once":(function(){
				var  oneTime = true;
				return function(fn){
					if (oneTime) {
						oneTime = false;
						return fn();
					}
				};
			})()
		});
	})();

	;(function () {
		var ua = navigator.userAgent,
		isApp = /great\-winner/gi.test(ua),
		version = {
			isApp: isApp
		},
		vss,
		vsn,
		type;

		if(isApp) {
			type = /great\-winner,Mobile$/.test(ua) ? "Android" : "iOS";
			vss = ua.replace(/(.*app_version=)|(\s*great\-winner.*)/, '');
			vss.split("\.").forEach(function (v, i) {
				vsn += ("000"+v).substr(-3);
			});

			Object.assign(version, {
				platform: type,
				isAndroid: type == "Android",
				isIOS: type == "iOS",
				version: vss,
				versionCode: vsn
			});
		}

		$.extend({
			"appVersion": function () {
				return version;
			}
		});		
	})();

	// 时间工具 yyyy-MM-dd hh:mm:ss
	;(function(){

		function format() {
			var e=arguments[0],
			t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "yyyy-MM-dd HH:mm:ss";
            if (!e)
                return "";
            if (!(e instanceof Date) && "number" != typeof e)
                throw new TypeError("Parameter source:" + e + " is not a Date or Number.");
            if (!t || "string" != typeof t)
                throw new Error("Parameter pattern:" + t + " is not a valid date format pattern.");
            "number" == typeof e && (e = new Date(e));
            var n = {
                yy: e.getFullYear() % 100,
                yyyy: e.getFullYear(),
                MM: e.getMonth() + 1,
                dd: e.getDate(),
                hh: e.getHours() % 12,
                HH: e.getHours(),
                mm: e.getMinutes(),
                ss: e.getSeconds()
            };
            return t.replace(/yyyy|yy|MM|dd|HH|hh|mm|ss/g, function(e) {
                var t = "0000" + n[e];
                return t.substr(- e.length)
            })
		}

		Date.format = format;
		Date.prototype.Format = function (fmt) {
		    return format(this, fmt);
		};

		if($.appVersion().isIOS) {
			var dp = (function () {
			var dproto = Date.prototype,
				setMethods = [
		              dproto.setFullYear,
		              dproto.setMonth,
		              dproto.setDate,
		              dproto.setHours,
		              dproto.setMinutes,
		              dproto.setSeconds,
		              dproto.setMilliseconds
		        ];
				
				return function () {
					var valueDate = new Date();
					var args = arguments;
					$.map(args, function (v,i) {
                        if(1 == i) { 
                            v -= 1;
                            // 适配ios
                            setMethods[i].call(valueDate, v||0, args[i+1]);
                            return;
                        }
                        setMethods[i].call(valueDate, v||0);
                    });
					return valueDate.getTime();
				};
			})();
		
			Date.parse = function () {
				var dt = arguments;
				if(!dt || !dt.length) {
					return 0;
				}
				if(typeof dt[0] == "string") {
					dt = dt[0].split(/[\s\-\:T\.]/gi);
				}
				console.log(Array.prototype.join.call(dt, ","));
				return dp.apply(Date, dt);
			}
		}

		w.dateTool = {
			day:24*60*60*1000,
			week:7,
			getBetweenByDays: function(days) {
				var d = new Date(), start, end;
				end = d.Format('yyyy-MM-dd HH:mm:ss');
				d.setTime(d.getTime()-days*this.day);
				start = d.Format('yyyy-MM-dd 00:00:00')
			
				return new Array(start, end);
			},
			getBetweenByWeeks: function(weeks) {
				var d = new Date(), start, end;
				end = d.Format('yyyy-MM-dd HH:mm:ss');
				d.setTime(d.getTime()-weeks*this.week*this.day);
				start = d.Format('yyyy-MM-dd 00:00:00')
			
				return new Array(start, end);
			}
		}
	})();
})(window,jQuery);