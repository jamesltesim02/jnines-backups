import NBBase from './base.js';


const path = require('path');
let loadFiles = [];
let plat_settings = JSON.parse(localStorage.getItem(NBBase.platform_settings));


const Commen = {
    ajax: function (options) {
        let basic_settings = {
            type: 'get',
            async: true,
            dataType: 'json',
            timeout:10000,
            data: {
                lang: plat_settings.nb_language || 'zh-cn'
            },
            complete:function (res) {

            },
            success:function (res) {

            },
            fail:function (status) {

            },
            handleTimeOut:function () {//超时处理
                console.log('ssssssssss')
            }

        };
        let handleData = Object.assign(basic_settings.data, options.data);
        let settings = Object.assign(basic_settings, options);

        let params = this.formatParams(handleData);
        let xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        let requestDone=true;//请求完成标志
        let timer=setTimeout(function(){
            xhr.abort();
            requestDone = false;
            settings.handleTimeOut()
        }, settings.timeout);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4&&requestDone) {
                let status = xhr.status;
                if (status >= 200 && status < 300) {
                    settings.success(JSON.parse(xhr.responseText));
                } else {
                    settings.fail(status);
                }
                clearTimeout(timer)
            }

        };

        if (settings.type.toLowerCase() === "get") {
            xhr.open("GET", NBServer.p_s1 + settings.url + "?" + params, settings.async);
            xhr.send(null);
        } else if (settings.type.toLowerCase() === "post") {
            xhr.open("POST", NBServer.p_s1 + settings.url, settings.async);
            xhr.setRequestHeader("Content-Type", "application/json;chartset=utf-8");
            xhr.send(params);
        }
    },

    loadFileList: function (files, path, version, success, type) {
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
    * 处理以.25和.75类型的ovalue值
    * */
    handleOvalue: function (ovalue) {
        let num_ovalue = Number(ovalue);
        let str_ovalue = num_ovalue.toString();

        let target_ovalue = ovalue;
        if (str_ovalue.indexOf('.25') != -1 || str_ovalue.indexOf('.75') != -1) {
            if (num_ovalue > 0) {
                target_ovalue = (num_ovalue - 0.25) + ',' + (num_ovalue + 0.25);
            }
            else {
                target_ovalue = (num_ovalue - 0.25) + ',' + (num_ovalue + 0.25);
            }
        }
        return target_ovalue;
    },

    /*
    * 处理让球盘ovalue，需要给每个option一个ovalue
    * */

    handleLetBall: function (games) {
        let self = this
        let handle_games = games.map(function (item, index) {
            let odds_arr = [];
            item.options.map(function (item, index) {
                odds_arr.push(item.odds)
            });
            odds_arr.sort(function (a, b) {
                return a - b
            });
            item.options.map(function (x, y) {
                if (/^\-/.test(item.ovalue.toString())) {
                    if (x.on == 2) {
                        x.ovalue = self.handleOvalue('+' + Math.abs(+item.ovalue))
                    }
                    else {
                        x.ovalue = self.handleOvalue(item.ovalue);
                    }
                }
                else if (item.ovalue == 0) {
                    if (x.odds == odds_arr[0]) {
                        x.ovalue = '0';
                    }
                    else {
                        x.ovalue = '';
                    }
                }
                else {
                    if (x.on == 2) {
                        x.ovalue = self.handleOvalue('-' + Math.abs(+item.ovalue));
                    }
                    else {
                        x.ovalue = self.handleOvalue('+' + item.ovalue);
                    }
                }

            });

            return item
        });
        return handle_games
    },


    /*
    * 切换标准盘和香港盘时赔率变化
    * */
    handleOdds: function (odds, gtp) {
        const gtp_static = [16, 18, 26];
        let target_odds = odds;
        let platform_settings = JSON.parse(localStorage.getItem(NBBase.platform_settings));
        /*
        * 如果是属于让球，大小，单双,则需要根据当前是欧洲盘还是标准盘变换赔率，默认接口返回的是标准盘
        * */
        if (gtp_static.indexOf(gtp) != -1) {
            /*
            * 标准盘时的让球、大小、单双
            * */
            if (platform_settings.nb_odds_selset == 1) {
                target_odds = odds + 1
            }
        }
        return target_odds
    },


    /*
    * 获取主要盘口
    * */
    getIndexData(params, callback) {
        let self = this;
        let plate_config = JSON.parse(localStorage.getItem(NBBase.platform_settings));
        this.ajax({
            url: params.url,
            data: {
                gtp: params.gtp,
                bstage: params.bstage,
                optionType: plate_config.nb_viewType,
                page: params.page,
                limit: params.limit,
                sortBy: params.sortBy
            },
            success: function (res) {
                let obj = {};
                if (res.result === 200) {
                    if (res.data && res.data.length) {
                        let data = res.data;
                        let data_len = res.data.length;
                        for (let i = 0; i < data_len; i++) {
                            if (data[i].sno === 10) {

                                obj.football = data[i].races;

                            }
                            else if (data[i].sno === 11) {
                                obj.basketball = data[i].races;

                            }
                            else if (data[i].sno === 12) {
                                obj.tennis = data[i].races;
                            }
                        }
                        callback(obj);
                    }
                }
            }
        });


    },
    /*
        * 请求展开比赛数据
        * */
    initStrechMatch(params) {
        let self = this;
        let plate_config = JSON.parse(localStorage.getItem(NBBase.platform_settings));
        this.ajax({
            url: params.url,
            data: {
                lang: plate_config.nb_language,
                page: params.page,
                limit: params.limit,
                sortBy: params.sortBy
            },
            success: function (res) {
                if (res.result === 200) {
                    if (res.data && res.data.length) {

                        self.handleAddtionData(res.data, params.storeName);
                    }
                }
            }
        });


    },


    /*
    * 处理附加盘口数据,data是数组，storeName是区分首页和列表页附加数据的标志
    * */
    handleAddtionData(data, storeName) {
        let data_len = data.length;
        /*
        * 存储当前页面有可能存在的附加盘
        * */
        let strechMatch_info = [];
        for (let i = 0; i < data_len; i++) {
            let races_len = data[i].races.length;
            for (let j = 0; j < races_len; j++) {
                let matchs_len = data[i].races[j].matchs.length;
                for (let k = 0; k < matchs_len; k++) {
                    let obj = {
                        "all_16": [],//全场让球
                        "half_16": [],//上半场让球
                        "all_18": [],//全场大小
                        "half_18": [],//上半场大小,
                        "1x2": [],
                        "1x2_half": [],
                        "gtp_186": []
                    };
                    let games_len = data[i].races[j].matchs[k].games.length;
                    obj.mid = data[i].races[j].matchs[k].mid;
                    for (let p = 0; p < games_len; p++) {
                        let gtp = data[i].races[j].matchs[k].games[p].gtp;
                        let bstage = data[i].races[j].matchs[k].games[p].bstage.toString();
                        let options_obj = {
                            bstage: data[i].races[j].matchs[k].games[p].bstage,
                            options: data[i].races[j].matchs[k].games[p].options,
                            gtp: data[i].races[j].matchs[k].games[p].gtp,
                            gno: data[i].races[j].matchs[k].games[p].gno,
                            optabs: data[i].races[j].matchs[k].games[p].optabs,
                            ovalue: typeof (data[i].races[j].matchs[k].games[p].ovalue) ? data[i].races[j].matchs[k].games[p].ovalue : null
                        };

                        if (gtp == 1 && /0$/.test(bstage)) {//全场标准盘
                            obj['1x2'].push(options_obj);
                        }
                        else if (gtp == 186 && /0$/.test(bstage)) {//全场标准盘
                            obj['gtp_186'].push(options_obj);
                        }
                        else if (gtp == 1 && /1$/.test(bstage)) {
                            obj['1x2_half'].push(options_obj);
                        }
                        else if (gtp == 16 && /0$/.test(bstage)) {//全场让球
                            obj['all_16'].push(options_obj);
                        }
                        else if (gtp == 16 && /1$/.test(bstage)) {//上半场让球
                            obj['half_16'].push(options_obj);
                        }
                        else if (gtp == 18 && /0$/.test(bstage)) {//全场大小
                            obj['all_18'].push(options_obj);
                        }
                        else if (gtp == 18 && /1$/.test(bstage)) {//上半场大小
                            obj['half_18'].push(options_obj);
                        }
                    }
                    strechMatch_info.push(obj);
                }
            }
        }
        let storeName_str = NBBase.home_addtionBetItems;
        if (storeName === 'list') {
            storeName_str = NBBase.list_addtionBetItems
        }
        localStorage.setItem(storeName_str, JSON.stringify(strechMatch_info));
    },


    /*
    * 附加盘口最多取两个
    * */
    setTwoElement: function (arr) {
        let target_arr = [];

        let sort_arr = arr.sort(function (a, b) {
            return a.optabs - b.optabs
        });


        if (sort_arr.length >= 2) {
            sort_arr.map(function (item, index) {
                if (index < 2) {
                    target_arr.push(item);
                }
            });
            return target_arr
        }
        else {
            let sort_arr_len = sort_arr.length;
            let fill_obj = {
                gno: Math.random(),
                gtp: Math.random(),
                options: [
                    {
                        oid: Math.random()
                    }
                ]
            };
            for (let i = 0; i < 4 - 2 * sort_arr_len; i++) {
                fill_obj.gno = Math.random();
                fill_obj.gtp = Math.random();
                fill_obj.options[0].oid = Math.random();
                sort_arr.push(fill_obj)
            }

            return sort_arr
        }


    },


    /*
    * 对象序列化
    * */
    formatParams: function (data) {
        let arr = [];
        for (let name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".", ""));
        return arr.join("&");
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
    * 获取参数
    * */
    getReq: function (name) {//返回变量不绑定在window上
        var req_str = (location.search + '&').match(new RegExp('[?&]' + name + '=([^&]+)&', 'i'));
        return (location.search.indexOf("?") > -1 && req_str) ? req_str[1] : null;
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


};
export {Commen}



/*
* 对象继承
* */
function extend(obj1, obj2) {
    for (let key in obj2) {
        // if(obj2[key]){
        obj1[key] = obj2[key]
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