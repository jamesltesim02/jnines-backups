import NBBase from './base.js';
const path=require('path');
let loadFiles=[];
export default {
    ajax: function (options) {
        let basic_settings = {
            type: 'get',
            async: true,
            dataType: 'json'
        };
        let settings = Object.assign(basic_settings, options);
        let params = formatParams(settings.data);
        let xhr = null;
        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let status = xhr.status;
                if (status >= 200 && status < 300) {
                    if (settings.success) {
                        settings.success(JSON.parse(xhr.responseText));
                    }
                } else {
                    settings.fail && settings.fail(status);
                }
            }
        };
        if (settings.type.toLowerCase() === "get") {
            xhr.open("GET", settings.url + "?" + params, settings.async);
            xhr.send(null);
        } else if (settings.type.toLowerCase() === "post") {
            xhr.open("POST", settings.url, settings.async);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/json;chartset=utf-8");
            xhr.send(params);
        }
    },
    formatLongTime: function (option) {
        if (!option.long_time) {
            return "";
        }
        option = extend({
            long_time: 0, //时间戳 (必需填写)
            is_year: 1,  //是否显示年
            is_second: 1, //是否显示秒
            is_y_m_d: 0, //是否显示文字格式
            y_m_d: {
                year: "年",
                month: "月",
                day: "日"
            },
            formart: "-" // 间隔符号
        }, option);

        function minTen(num) {
            if (num < 10) {
                return "0" + num;
            } else {
                return num;
            }
        }

        var my_date = new Date(option.long_time);
        var year_str = "", second_str = "";
        if (option.is_year) {
            year_str = my_date.getFullYear() + option.formart;
            if (option.is_y_m_d) {
                year_str = my_date.getFullYear() + option.y_m_d.year;
            }
        }
        if (option.is_second) {
            second_str = ":" + minTen(my_date.getSeconds());
        }

        return year_str + minTen((my_date.getMonth() + 1))
            + (option.is_y_m_d ? option.y_m_d.month : option.formart)
            + minTen(my_date.getDate()) + (option.is_y_m_d ? option.y_m_d.day : "")
            + " " + minTen(my_date.getHours()) + ":" + minTen(my_date.getMinutes()) + second_str;
    },
    loadFileList:function (files, path, version, success, type) {
        var file_arr = [];
        if (typeof files === "object" && files.constructor == Array) {
            file_arr = files;
        } else if (typeof files === "string") {
            file_arr = files.split(",");
        }
        var loaded_count = 0;
        for (var i = 0; i < file_arr.length; i++) {
            loadFile(path + file_arr[i] + version, function () {
                loaded_count++;
                if (loaded_count == file_arr.length) {
                    success && typeof success == 'function' && success();
                }
            }, type)
        }

        /*加载JS文件,url:文件路径,success:加载成功回调函数*/
        function loadFile(url, s, type) {
            if (!fileIsExt(loadFiles, url)) {
                var this_type = type ? type : getFileType(url);
                var file_obj = null;
                if (["script", ".js"].indexOf(this_type) > -1) {
                    file_obj = document.createElement('script');
                    file_obj.src = url;
                } else if ([".css", ".less"].indexOf(this_type) > -1) {
                    file_obj = document.createElement('link');
                    file_obj.href = url;

                    // file_obj.contentType='text/css'
                    // file_obj.type = "text/css";
                    // // file_obj.type = "text/css";
                    file_obj.rel = "stylesheet" + (this_type == ".less" ? "/less" : "");

                }
                if (!file_obj) {
                    s && typeof s == 'function' && s();
                    return;
                }
                file_obj.onload = file_obj.onreadystatechange = function () {
                    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                        s && typeof s == 'function' && s();
                        loadFiles.push(url);
                    }
                };
                document.getElementsByTagName('head')[0].appendChild(file_obj);
            } else {
                s && typeof s == 'function' && s();
            }
        }

        /*获取文件类型,后缀名，小写*/
        function getFileType(url) {
            var urlArr = (url + '?').match(/(\.[a-z]+)\?/i);
            return urlArr ? urlArr[1] : '';
        }

        /*文件是否已加载*/
        function fileIsExt(arr, _url) {
            return (arr && typeof arr === "object" && arr.constructor == Array && arr.indexOf(_url) > -1) ? true : false;
        }
    },

    /*
 * 设置语言，参数为值为“zh-ch”,"en-us"等
 * */

    setFont: function (designWidth, diyFontSize) {
        let dpr = window.devicePixelRatio;
        let scale = 1 / dpr;
        let metaEle = document.createElement('meta');
        metaEle.name = "viewport";
        metaEle.content = "width=device-width,initial-scale=" + scale + ",maximum-scale=" + scale + ",user-scalable=no";
        document.firstElementChild.appendChild(metaEle);
        let html = document.getElementsByTagName('html')[0];
        html.style.fontSize = diyFontSize * document.documentElement.clientWidth / designWidth + 'px'
    },
    /*
       * 数组去重
       *	pitter
       * */
    uniqueArr: function (arr) {
        var obj = {}, unique = [];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (typeof obj[arr[i]] === 'undefined') {
                unique.push(arr[i]);
                obj[arr[i]] = arr[i];
            }
        }
        return unique;
    },

    /*
    * 赔率截取n位小数,num数值，n需要保留几位小数
    * */
    save_float: function (num, n) {
        var numStr = (Math.abs(num) + 5 * Math.pow(10, -(n + 2))).toString();
        return (+num < 0 ? '-' : '') + numStr.slice(0, numStr.indexOf('.') + n + 1);
    },

    /*
    * 根据对象中的某个属性去重数组
    *	pitter
    * */
    arr_obj_unique: function (arr, params) {
        var obj = {}, unique = [];
        var len = arr.length;
        for (var n = 0; n < len; n++) {
            if (typeof obj[arr[n][params]] === 'undefined') {
                unique.push(arr[n]);
                obj[arr[n][params]] = arr[n][params];
            }
        }
        return unique;
    },
    getReq: function (name) {//返回变量不绑定在window上
        var req_str = (location.search + '&').match(new RegExp('[?&]' + name + '=([^&]+)&', 'i'));
        return (location.search.indexOf("?") > -1 && req_str) ? req_str[1] : null;
    },
    /*
         * 格式化时间戳，转换成自定义的格式
         * 调用 NBBase.formatLongTime({long_time:150000000})
         *  abraham.l
         */
    /*
    * 判断对象是空对象
    * pitter
    * */
    isOwnEmpty: function (obj) {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
    },
    /*
           * 设置cookie
           * name:cookie名，value:cookie值，time:cookie过期时间，单位秒，指的是距离设置cookie这个时间点，如果不传即为session，关闭浏览器cookie就消失，负数表示删除，0表示仅在本窗口及子窗口有效
               pitter
           * */
    setCookie_maxAge: function (name, value, time) {
        var cookie_Time = time || '';
        document.cookie = name + "=" + value + ";max-age=" + cookie_Time + "; path=/";
    },


    /*
         *获取cookie
         * abraham.l
         * */
    getCookie: function (cookie_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(cookie_name + "=");
            var c_end;
            if (c_start != -1) {
                c_start = c_start + cookie_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    },


    formatDate: function (source, pattern) {
        pattern = pattern || 'yyyy-MM-dd HH:mm:ss';

        if (!source) {
            return '';
        }
        if (!(source instanceof Date) && 'number' != typeof source) {
            throw new TypeError('Parameter source:' + source + ' is not a Date or Number.');
        }
        if (!pattern || 'string' != typeof pattern) {
            throw new Error('Parameter pattern:' + pattern + ' is not a valid date format pattern.');
        }

        'number' == typeof source && (source = new Date(source));

        var pattrenMap = {
            yy: source.getFullYear() % 100,
            yyyy: source.getFullYear(),
            MM: source.getMonth() + 1,
            dd: source.getDate(),
            hh: source.getHours() % 12,
            HH: source.getHours(),
            mm: source.getMinutes(),
            ss: source.getSeconds()
        };

        return pattern.replace(/yyyy|yy|MM|dd|HH|hh|mm|ss/g, function (v) {
            return ('0000' + pattrenMap[v]).substr(-v.length);
        })
    },



}
/*
* 对象序列化
* */
function formatParams(data) {
    let arr = [];
    for (let name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".",""));
    return arr.join("&");
}

/*
* 对象继承
* */
function extend(obj1,obj2) {
    for(let key in obj2){
        // if(obj2[key]){
            obj1[key]=obj2[key]
        // }

    }
    return obj1
}



function loadFileList(files, path, version, success, type) {
    var file_arr = [];
    if (typeof files === "object" && files.constructor == Array) {
        file_arr = files;
    } else if (typeof files === "string") {
        file_arr = files.split(",");
    }
    var loaded_count = 0;
    for (var i = 0; i < file_arr.length; i++) {
        loadFile(path + file_arr[i] + version, function () {
            loaded_count++;
            if (loaded_count == file_arr.length) {
                success && typeof success == 'function' && success();
            }
        }, type)
    }

    /*加载JS文件,url:文件路径,success:加载成功回调函数*/
    function loadFile(url, s, type) {
        if (!fileIsExt(loadFiles, url)) {
            var this_type = type ? type : getFileType(url);
            var file_obj = null;
            if (["script", ".js"].indexOf(this_type) > -1) {
                file_obj = document.createElement('script');
                file_obj.src = url;
            } else if ([".css", ".less"].indexOf(this_type) > -1) {
                file_obj = document.createElement('link');
                file_obj.href = url;

                // file_obj.contentType='text/css'
                // file_obj.type = "text/css";
                // // file_obj.type = "text/css";
                file_obj.rel = "stylesheet" + (this_type == ".less" ? "/less" : "");
            }
            if (!file_obj) {
                s && typeof s == 'function' && s();
                return;
            }
            file_obj.onload = file_obj.onreadystatechange = function () {
                if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                    s && typeof s == 'function' && s();
                    loadFiles.push(url);
                }
            };
            document.getElementsByTagName('head')[0].appendChild(file_obj);
        } else {
            s && typeof s == 'function' && s();
        }
    }

    /*获取文件类型,后缀名，小写*/
    function getFileType(url) {
        var urlArr = (url + '?').match(/(\.[a-z]+)\?/i);
        return urlArr ? urlArr[1] : '';
    }

    /*文件是否已加载*/
    function fileIsExt(arr, _url) {
        return (arr && typeof arr === "object" && arr.constructor == Array && arr.indexOf(_url) > -1) ? true : false;
    }
}