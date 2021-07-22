/**
 * 针对WMS Game的核心查询组件
 * WMS-GAME
 *
 * 1. 初始化游戏数据
 *	  1.1 如果使用script标签在本js之前引入了wms配置的游戏js,则无需任何初始化代码即可直接使用
 *    1.2 如果未引入script而是通过接口获取游戏列表,则需要通过initGames来初始化游戏列表
 *			// 初始化游戏列表,games为接口返回的游戏列表数组
 *			WG.initGames(games);
 *		
 * 
 * 2. 查询游戏列表,所有参数都非必须.按需添加
 * 		WG.search({
 *			provider: "All",			// 游戏平台, 设置对应的游戏平台,如需匹配多个,则设置为数组(["TTG", "MG"])
 *			gameType: "All",			// 游戏类型, 设置对应的游戏类型,如需匹配多个,则设置为数组(["1", "2"])
 *			line: "All",				// 赔付线 , 设置对应的赔付线,如需匹配多个,则设置为数组(["1-4", "5-9"])
 *			keyword: null,				// 关键字,默认情况下如果有关键字则不使用其他条件
 *			strongWord: false,			// 强关键字匹配,开启之后关键字将和其他条件同时起作用
 *			isPool: "All",				// 是否奖池游戏: All 查询所有, true 查奖池游戏, false 查非奖池游戏
 *			isNew: "All",				// 是否最新游戏: All 查询所有, true 查询最新游戏, false 查询非最新游戏
 *			isRecommend: "All",			// 是否推荐游戏: All 查询所有, true 查询推荐游戏, false 查询非推荐游戏
 *			isSpecial: "All", 			// 是否特色游戏: All 查询所有, true 查询特色游戏, false 查询非特色游戏  (熱門遊戲依據)
 *			canTry: "All", 				// 是否支持试玩: All 查询所有, true 查询可试玩游戏, false 查询不可试玩游戏
 *			orderMaxPrize: null,		// 根据派奖排序: null 不排序, asc 升序, desc 降序 (爆机游戏排序, 取指定条数,如果有派奖排序,则不会执行点赞、人气和星级排序)
 *			orderPraise: null,			// 根据点赞排序: null 不排序, asc 升序, desc 降序(点赞,人气,星级同时出现的优先级为 点赞>人气>星级)
 *			orderPopularity: null,		// 根据人气排序: null 不排序, asc 升序, desc 降序(点赞,人气,星级同时出现的优先级为 点赞>人气>星级)
 *			orderStar: null,			// 根据星级排序: null 不排序, asc 升序, desc 降序(点赞,人气,星级同时出现的优先级为 点赞>人气>星级)
 *			page: 1,					// 当前页码
 *			pageItems: 12,				// 每页显示个数
 *			range: null					// 搜寻范围: null 不指定范围, 通常用于限定查询搜藏的游戏,为ProviderGameId格式的数组(["TTG445", "TTG326" ..])
 *		})
 *
 *  查询返回结果
 * 		{
 *			"data": [     // 查询到的游戏列表
 *				{
 *			"gameId":"XG01",
 *			"provider":"AG",
 *			"enName":"Dragons Pearl",
 *			"cnName":"龙珠",
 *			"gameType":1,
 *			"gameStyle":1,
 *			"line":20,
 *			"playerType":1,
 *			"isPool":0,
 *			"canTry":1,
 *			"popularity":0,
 *			"maxMultiple":0,
 *			"betTimes":0,
 *			"maxPrize":0,
 *			"star":0,
 *			"grade":"0.0",
 *			"icon":"ag/XG01.png",
 *			"poolUrl":"",
 *			"isNew":0,
 *			"isRecommend":0,
 *			"special":0,
 *			"specialJackpot":"",
 *			"praise":0,
 *			"remark":"是是zh",
 *			"phone":1,
 *			"language":"en",
 *			"isHot":0,
 *			"isPromotion":0,
 *			"loginId":"XG01",
 *   		"icon2":"", 
 *          "icon3":"",
 *          "icon4":"",
 *          "serverID":"",
 *          "freegame":0 
 *		},
 *				...
 *			],
 *			"totalPage": 30,	// 当前条件下总页数
 *			"totalRecord": 356, // 当前条件下总条数
 *			"page": 1,			// 当前第几页
 *			"pageItems": 12,	// 每页记录数
 *			"condition":  {		// 本次查询条件
 *				...
 *			}
 *		}
 *
 *
 * 3. 获取指定游戏信息
 *		WG.getGame(provider, gameId)
 *
 *    获取返回结果
 *		{
 *			"gameId":"XG01",
 *			"provider":"AG",
 *			"enName":"Dragons Pearl",
 *			"cnName":"龙珠",
 *			"gameType":1,
 *			"gameStyle":1,
 *			"line":20,
 *			"playerType":1,
 *			"isPool":0,
 *			"canTry":1,
 *			"popularity":0,
 *			"maxMultiple":0,
 *			"betTimes":0,
 *			"maxPrize":0,
 *			"star":0,
 *			"grade":"0.0",
 *			"icon":"ag/XG01.png",
 *			"poolUrl":"",
 *			"isNew":0,
 *			"isRecommend":0,
 *			"special":0,
 *			"specialJackpot":"",
 *			"praise":0,
 *			"remark":"是是zh",
 *			"phone":1,
 *			"language":"en",
 *			"isHot":0,
 *			"isPromotion":0,
 *			"loginId":"XG01",
 *   		"icon2":"", 
 *          "icon3":"",
 *          "icon4":"",
 *          "serverID":"",
 *          "freegame":0 
 *		}
 */
;
(function(w) {
    "use strict";
    // 列索引到列名映射
    var i2n = {
            0: "gameId", //游戏ID
            1: "provider", //游戏供应商
            2: "enName", //英文名
            3: "cnName", //中文名
            4: "gameType", //游戏类型（老虎机、桌面等）
            5: "gameStyle", //游戏风格
            6: "line", //赔付线
            7: "playerType", //玩家类型
            8: "isPool", //是否奖池 (0/1)
            9: "canTry", //是否支持试玩 (0/1)
            10: "popularity", //人气值
            11: "maxMultiple", //最大赢钱倍数
            12: "betTimes", //投注笔数
            13: "maxPrize", //最高派奖
            14: "star", //星级
            15: "grade", //分数（B06:洗码比例）
            16: "icon", //图片
            17: "poolUrl", //奖池地址 (是否彩金池 Flash)
            18: "isNew", //最新
            19: "isRecommend", //推荐 (凱時推薦依據)
            20: "special", //特色 (熱門遊戲依據)
            21: "specialJackpot", //漫威奖金池地址
            22: "praise", //点赞数
            23: "remark", //描述
            24: "phone", //手机
            25: "language", //游戏语言
            26: "isHot", // 最热
            27: "isPromotion", // 特惠
            28: "icon2", //游戏图片2路径
            29: "icon3", //游戏图片3路径
            30: "icon4", //游戏图片4路径
            31: "serverID", //服务器游戏ID
            32: "freegame" //免费游戏
        },
        // 当前操作系统信息 android:0, ios:1, other: 2
        platform = { "android": 0, "ios": 1, "other": 2 }[(function() {
            var navVersion = navigator.appVersion.toLowerCase();

            if (navVersion.indexOf("android") > -1) {
                return "android";
            }

            if (navVersion.indexOf("mac") > -1) {
                return "ios";
            }

            return "other";
        })()],
        // 将数组值转为对象值的游戏列表
        namedGameList = [],
        // 按照平台和GameId对游戏进行映射,key为ProviderGameId
        keyedGameMap = {},
        // WMS 游戏处理全局对象
        WG,
        // 提供通用的条件选项
        CONSTANT = {
            // 平台
            provider: [
                { key: "All", text: "全平台" },
                { key: "MG", text: "MG" },
                { key: "AG", text: "AG" },
                { key: "PT", text: "PT" },
                { key: "TTG", text: "TTG" },
                { key: "PNG", text: "PNG" },
            ],
            // 游戏类型
            gameType: [
                { key: "All", text: "All" },
                { key: 1, text: "老虎机" },
                { key: 2, text: "桌面游戏" },
                { key: 3, text: "纸牌" },
                { key: 4, text: "街机游戏" },
                { key: 5, text: "其他" },
                { key: 6, text: "赛车" },
                { key: 7, text: "刮刮乐" },
                { key: 8, text: "视频扑克" },
                { key: 9, text: "拉霸" },
                { key: 10, text: "消消乐" },
                { key: 11, text: "转轮游戏" },
                { key: 12, text: "3D老虎机" },
            ],
            // 赔付线
            line: [
                { key: "All", text: "全赔付" },
                { key: "1-4", text: "1-4线" },
                { key: "5-9", text: "5-9线" },
                { key: "15-25", text: "15-25线" },
                { key: "30-50", text: "30-50线" },
                { key: "51-243", text: "51-243线" }
            ],
            // 玩家类型3
            playerType: [
                { key: "All", text: "All" },
                { key: "1", text: "小额玩家" },
                { key: "2", text: "中级玩家" },
                { key: "3", text: "高富帅玩家" }
            ],
            // 洗码比例
            grade: [
                { key: "All", text: "全比例" },
                { key: "0.0-1.0", text: "0.0%-1.0%" },
                { key: "1.1-1.5", text: "1.1%-1.5%" },
                { key: "1.6-2.0", text: "1.6%-2.0%" },
                { key: "2.1-2.5", text: "2.1%-2.5%" },
                { key: "2.6-3.0", text: "2.6%-3.0%" }
            ],
        },
        // 默认查询条件
        defaultCondition = {
            provider: "All", // 游戏平台, 设置对应的游戏平台,如需匹配多个,则设置为数组(["TTG", "MG"])
            gameType: "All", // 游戏类型, 设置对应的游戏类型,如需匹配多个,则设置为数组(["1", "2"])
            line: "All", // 赔付线 , 设置对应的赔付线,如需匹配多个,则设置为数组(["1-4", "5-9"])
            grade: "All", // 分数 { B06： 洗码比例 , 设置对应的洗码比例,如需匹配多个,则设置为数组(["2.6-3.0", "1.6-2.0","1.1-1.5","0.0-1.0","2.1-2.5"])}
            keyword: null, // 关键字,默认情况下如果有关键字则不使用其他条件
            strongWord: false, // 强关键字匹配,开启之后关键字将和其他条件同时起作用
            isPool: "All", // 是否奖池游戏: All 查询所有, true 查奖池游戏, false 查非奖池游戏
            isNew: "All", // 是否最新游戏: All 查询所有, true 查询最新游戏, false 查询非最新游戏
            isRecommend: "All", // 是否推荐游戏: All 查询所有, true 查询推荐游戏, false 查询非推荐游戏
            isSpecial: "All", // 是否特色游戏: All 查询所有, true 查询特色游戏, false 查询非特色游戏  (熱門遊戲依據)
            canTry: "All", // 是否支持试玩: All 查询所有, true 查询可试玩游戏, false 查询不可试玩游戏
            orderMaxPrize: null, // 根据派奖排序: null 不排序, asc 升序, desc 降序 (爆机游戏排序, 取指定条数,如果有派奖排序,则不会执行点赞、人气和星级排序)
            orderPraise: null, //热门 根据点赞排序: null 不排序, asc 升序, desc 降序(点赞,人气,星级同时出现的优先级为 点赞>人气>星级)
            orderPopularity: null, // 根据人气排序: null 不排序, asc 升序, desc 降序(点赞,人气,星级同时出现的优先级为 点赞>人气>星级)
            orderStar: null, // 根据星级排序: null 不排序, asc 升序, desc 降序(点赞,人气,星级同时出现的优先级为 点赞>人气>星级)
            page: 1, // 当前页码
            pageItems: 12, // 每页显示个数
            range: null // 搜寻范围: null 不指定范围, 通常用于限定查询搜藏的游戏,为ProviderGameId格式的数组(["TTG445", "TTG326" ..])
        },
        // 各个查询条件匹配规则
        matcher = {
            /**
             * 匹配游戏平台
             */
            provider: function(value, matchTo) {
                if (!matchTo || matchTo == "All") {
                    return true;
                }

                return Array.isArray(matchTo) ? matchTo.includes(value) : value == matchTo;
            },
            /**
             * 匹配游戏类型
             */
            gameType: function(value, matchTo) {
                if (!matchTo || matchTo == "All") {
                    return true;
                }

                return Array.isArray(matchTo) ? matchTo.includes(value) : value == matchTo;
            },
            /**
             * 匹配赔付线
             */
            line: function(value, matchTo) {
                var la, lineMin, lineMax, currLine, i;

                if (!matchTo || matchTo == "All") {
                    return true
                }

                currLine = parseIntStrong(value);

                if (!Array.isArray(matchTo)) {
                    matchTo = [matchTo];
                }

                for (i = 0; i < matchTo.length; i++) {
                    la = matchTo[i].split("\-");
                    lineMin = parseIntStrong(la[0]);
                    lineMax = parseIntStrong(la[la.length - 1]);
                    if (currLine >= lineMin && currLine <= lineMax) {
                        return true;
                    }
                }

                return false;
            },
            /**
             * 匹配分数（B06：洗码比例）
             */
            grade: function(value, matchTo) {
                var la, lineMin, lineMax, currLine, i;

                if (!matchTo || matchTo == "All") {
                    return true
                }

                currLine = parseFloat(value) || 0;

                if (!Array.isArray(matchTo)) {
                    matchTo = [matchTo];
                }

                for (i = 0; i < matchTo.length; i++) {
                    la = matchTo[i].split("\-");
                    lineMin = parseFloat(la[0]) || 0;
                    lineMax = parseFloat(la[la.length - 1]) || 0;
                    if (currLine >= lineMin && currLine <= lineMax) {
                        return false;
                    }
                }

                return true;
            },
            /**
             * 匹配范围
             */
            range: function(value, matchTo) {

                if (!matchTo || !Array.isArray(matchTo)) {
                    return true;
                }

                if (!matchTo.length) {
                    return false;
                }

                return matchTo.includes(value);
            },
            /**
             * 匹配isXxx情况
             */
            isMatch: function(value, matchTo) {
                if (matchTo == "All") {
                    return true;
                }

                if (!matchTo && matchTo != false) {
                    return true;
                }

                if (matchTo == true) {
                    if (value == "1") {
                        return true;
                    }
                } else {
                    if (value != "1") {
                        return true;
                    }
                }

                return false;
            }
        },
        _;

    /**
     * 转换整型,如果转换为非数字强制为0
     * @param val 被转换的值
     * @returns 转换后的值
     */
    function parseIntStrong(val) {
        return parseInt(val) || 0;
    }

    /**
     * 将一条数组数据转成object对象
     * 
     * @param row 被转换的数组数据
     * 
     * @return 转换后的对象
     */
    function toObject(row) {
        var result, ids;
        if (!row || !row.length) {
            return undefined;
        }

        result = {};

        row.forEach(function(value, index) {
            result[i2n[index]] = value;
        });

        result.loginId = result.gameId;

        // BSG游戏id分为Android,IOS,Others,根据当前平台拆分出对应的数组
        if (result.provider == "BS") {
            result.provider = "BSG";
            ids = result.loginId.split("_");
            if (ids.length == 3) {
                result.loginId = ids[platform];
            }

        }

        return result;
    }

    /**
     * 将以数组保存游戏记录的列表转为对象类型的游戏
     */
    function toNamedGameList(games) {
        var index = 0;
        namedGameList = [];
        if (!games || !games.length) {
            return;
        }
        // 循环转换成对象
        games.forEach(function(arrayGame, i) {
            var namedGame = toObject(arrayGame);
            // 添加到对象列表中
            namedGameList.push(namedGame);
            // 构造ProviderGameId格式的key到列表索引映射
            keyedGameMap[namedGame.provider + namedGame.gameId] = index++;
        });
    }

    /**
     * 匹配数据是否满足条件
     * 
     * @param obj 被匹配的数据
     * @param cons 用于匹配的条件
     * 
     * @return true: 匹配, false: 不匹配
     */
    function matching(obj, cons) {

        if (!obj) {
            return false;
        }

        if (!cons) {
            return true;
        }

        // 匹配关键字
        if (cons.keyword) {
            // 如果关键字不匹配则返回false
            //if(obj.enName.indexOf(cons.keyword) == -1 && obj.cnName.indexOf(cons.keyword) == -1) {
            cons.keyword = decodeURIComponent(cons.keyword);
            if (obj.cnName.indexOf(cons.keyword) == -1) {
                return false;
            }
            // 如果关键字匹配,并且没有设置强关键字匹配,则直接返回true
            if (cons.strongWord != true) {
                return true;
            }
        }

        // 匹配搜索范围
        if (!matcher.range(obj.provider + obj.gameId, cons.range)) {
            return false;
        }

        // 匹配平台
        if (!matcher.provider(obj.provider, cons.provider)) {
            return false
        }

        // 匹配游戏类型
        if (!matcher.gameType(obj.gameType, cons.gameType)) {
            return false
        }

        // 匹配赔付线
        if (!matcher.line(obj.line, cons.line)) {
            return false;
        }

        // 洗码
        if (!matcher.grade(obj.grade, cons.grade)) {
            return false;
        }

        // 匹配奖金池
        if (!matcher.isMatch(obj.isPool, cons.isPool)) {
            return false;
        }
        // 匹配新游戏
        if (!matcher.isMatch(obj.isNew, cons.isNew)) {
            return false;
        }
        // 匹配推荐游戏
        if (!matcher.isMatch(obj.isRecommend, cons.isRecommend)) {
            return false;
        }
        // 匹配特色游戏(熱門遊戲依據)
        if (!matcher.isMatch(obj.isSpecial, cons.isSpecial)) {
            return false;
        }
        // 匹配试玩游戏
        if (!matcher.isMatch(obj.canTry, cons.canTry)) {
            return false;
        }

        return true;
    }

    /**
     * 根据条件对游戏列表进行排序
     * 
     * @param games 游戏列表
     * @param cons 包含排序规则的条件信息
     * 
     * @return 排序后的结果
     */
    function sortBy(games, cons) {
        // 如果排序字段中没有包含asc和desc则视为不需要排序,则直接返回
        if (!["asc", "desc"].includes(cons.orderMaxPrize) &&
            !["asc", "desc"].includes(cons.orderPraise) &&
            !["asc", "desc"].includes(cons.orderPopularity) &&
            !["asc", "desc"].includes(cons.orderStar)) {
            return games;
        }

        return games.sort(function(game1, game2) {
            // 按派奖金额排序,查询爆机游戏
            var mo = 0,
                // 按点赞排序
                oo = 0,
                // 按人气排序
                po = 0,
                // 星级排序
                so = 0,
                c1, c2;

            // 按派奖金额排序,用于查询爆机游戏
            if (["asc", "desc"].includes(cons.orderMaxPrize)) {
                c1 = parseIntStrong(game1.maxPrize);
                c2 = parseIntStrong(game2.maxPrize);
                if (cons.orderMaxPrize == "asc") {
                    mo = c1 - c2;
                } else if (cons.orderMaxPrize == "desc") {
                    mo = c2 - c1;
                }

                return mo || -1;
            }

            // 按点赞排序
            c1 = parseIntStrong(game1.praise);
            c2 = parseIntStrong(game2.praise);
            if (cons.orderPraise == "asc") {
                oo = c1 - c2;
            } else if (cons.orderPraise == "desc") {
                oo = c2 - c1;
            }
            if (oo != 0) {
                return oo;
            }

            // 按人气排序
            c1 = parseIntStrong(game1.popularity);
            c2 = parseIntStrong(game2.popularity);
            if (cons.orderPopularity == "asc") {
                po = c1 - c2;
            } else if (cons.orderPopularity == "desc") {
                po = c2 - c1;
            }

            if (po != 0) { // 如果按人气已经比较出大小,则直接返回排序值
                return po;
            }

            // 按星级排序
            c1 = parseIntStrong(game1.star);
            c2 = parseIntStrong(game2.star);
            if (cons.orderStar == "asc") {
                so = c1 - c2;
            } else if (cons.orderStar == "desc") {
                so = c2 - c1;
            }

            // 若so为0,则按默认顺序排列, 默认game1 比game2 小,按原顺序排列
            return so || -1;
        });
    }

    /**
     * 获取游戏列表分页数据
     * 
     * @param games 游戏列表
     * @param page 当前页
     * @param pageItems 每页显示数据条数
     *  
     * @return 分页后的数据
     * 		{
     * 			data: [...], // 当前页数据
     * 			totalPage: 5, // 总共页数
     * 			totalRecord: 212, // 数据总条数
     * 			page: 1, // 当前页数
     * 			pageItems: 12 // 每页显示数据条数
     * 		}
     */
    function getPage(games, page, pageItems) {
        var data, totalPage, totalRecord, start, end;

        // 初始化页数和条数
        page = page || defaultCondition.page;
        pageItems = pageItems || defaultCondition.pageItems;

        // 获取数据条数
        totalRecord = games ? games.length : 0;
        // 计算页数
        totalPage = Math.ceil(totalRecord / pageItems);

        // 计算获取页面数据的下标
        start = pageItems * (page - 1);
        end = start + pageItems;

        // 获取当前页数据
        data = games ? games.slice(start, end) : [];

        return {
            data: data,
            totalPage: totalPage,
            totalRecord: totalRecord,
            page: page,
            pageItems: pageItems
        };
    }

    /**
     * 根据条件搜索游戏
     * 
     * @param cons 查询条件
     * 
     * @return 查询结果
     * 		{
     * 			data: [...], // 当前页数据
     * 			totalPage: 5, // 总共页数
     * 			totalRecord: 212, // 数据总条数
     * 			page: 1, // 当前页数
     * 			pageItems: 12, // 每页显示数据条数
     * 			condition: {...} // 当前查询条件
     * 		}
     * 	
     */
    function searchGames(cons) {
        // 构造搜索条件
        var condition = Object.assign({}, defaultCondition, cons),
            // 搜索到的有效游戏
            validGames = [],
            // 分页信息
            pageInfo,
            _;
        // console.log("conditions:", cons);
        if (!namedGameList || !namedGameList.length) {
            return undefined;
        }

        // 遍历所有游戏,并根据条件过滤
        namedGameList.forEach(function(game, index) {
            if (matching(game, condition)) {
                validGames.push(game);
            }
        });

        // 排序
        validGames = sortBy(validGames, condition);


        // 分页
        pageInfo = getPage(validGames, condition.page, condition.pageItems);
        pageInfo.condition = condition;

        // console.log(pageInfo);

        return pageInfo;
    }

    /**
     * 根据游戏平台,游戏id获取游戏信息对象
     * 
     * @param provider 游戏平台
     * @param gameId 游戏id
     * 
     * @return 游戏信息
     */
    function getGame(provider, gameId) {
        var key, gameIndex;
        if (!namedGameList || !provider || !gameId) {
            return undefined;
        }

        // console.log(keyedGameMap);

        key = provider + gameId;
        gameIndex = keyedGameMap[key];

        if (typeof(gameIndex) != "number") {
            return undefined;
        }

        return namedGameList[gameIndex]
    }

    // 初始化named游戏列表
    toNamedGameList(w.games);

    // 通过WG全局变量对外暴露search函数和CONSTANT常量
    WG = w.WG = {
        /**
         * 根据条件查询游戏
         */
        //search:searchGames,
        search: function(cons) {
            var l = Date.now();

            var gs = searchGames(cons);
            // console.log("查询耗时:" + (Date.now() - l));

            return gs;
        },
        /**
         * 根据游戏平台,游戏id获取游戏信息对象
         */
        getGame: getGame,
        initGames: function(games) {

            if (typeof games === "string") {
                try {
                    games = JSON.parse(games);
                } catch (e) {
                    console.log("初始化游戏出错:", e);
                }
            }

            toNamedGameList(games);

        },
        CONSTANT: CONSTANT
    };
})(window);