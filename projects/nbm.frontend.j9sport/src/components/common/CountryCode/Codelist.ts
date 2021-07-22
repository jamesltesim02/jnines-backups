const codelist = [
  {
    name_ch: "阿富汗",
    name_en: "Afghanistan",
    code: "AF",
    num: "+93"
  },
  {
    name_ch: "阿尔巴尼亚",
    name_en: "Albania",
    code: "AL",
    num: "+355"
  },
  {
    name_ch: "阿尔及利亚",
    name_en: "Algeria",
    code: "DZ",
    num: "+213"
  },
  {
    name_ch: "安道尔共和国",
    name_en: "Andorra",
    code: "AD",
    num: "+376"
  },
  {
    name_ch: "安圭拉岛",
    name_en: "Anguilla",
    code: "AI",
    num: "+1264"
  },
  {
    name_ch: "安提瓜和巴布达",
    name_en: "Antigua and Barbuda",
    code: "AG",
    num: "+1268"
  },
  {
    name_ch: "阿根廷",
    name_en: "Argentina",
    code: "AR",
    num: "+54"
  },
  {
    name_ch: "亚美尼亚",
    name_en: "Armenia",
    code: "AM",
    num: "+374"
  },
  {
    name_ch: "澳大利亚",
    name_en: "Australia",
    code: "AU",
    num: "+61"
  },
  {
    name_ch: "奥地利",
    name_en: "Austria",
    code: "AT",
    num: "+43"
  },
  {
    name_ch: "阿塞拜疆",
    name_en: "Azerbaijan",
    code: "AZ",
    num: "+994"
  },
  {
    name_ch: "巴哈马",
    name_en: "Bahamas",
    code: "BS",
    num: "+1242"
  },
  {
    name_ch: "巴林",
    name_en: "Bahrain",
    code: "BH",
    num: "+973"
  },
  {
    name_ch: "孟加拉国",
    name_en: "Bangladesh",
    code: "BD",
    num: "+880"
  },
  {
    name_ch: "巴巴多斯",
    name_en: "Barbados",
    code: "BB",
    num: "+1246"
  },
  {
    name_ch: "白俄罗斯",
    name_en: "Belarus",
    code: "BY",
    num: "+375"
  },
  {
    name_ch: "比利时",
    name_en: "Belgium",
    code: "BE",
    num: "+32"
  },
  {
    name_ch: "伯利兹",
    name_en: "Belize",
    code: "BZ",
    num: "+501"
  },
  {
    name_ch: "贝宁",
    name_en: "Benin",
    code: "BJ",
    num: "+229"
  },
  {
    name_ch: "百慕大群岛",
    name_en: "Bermuda Is.",
    code: "BM",
    num: "+1441"
  },
  {
    name_ch: "玻利维亚",
    name_en: "Bolivia",
    code: "BO",
    num: "+591"
  },
  {
    name_ch: "博茨瓦纳",
    name_en: "Botswana",
    code: "BW",
    num: "+267"
  },
  {
    name_ch: "巴西",
    name_en: "Brazil",
    code: "BR",
    num: "+55"
  },
  {
    name_ch: "文莱",
    name_en: "Brunei",
    code: "BN",
    num: "+673"
  },
  {
    name_ch: "保加利亚",
    name_en: "Bulgaria",
    code: "BG",
    num: "+359"
  },
  {
    name_ch: "布基纳法索",
    name_en: "Burkina-faso",
    code: "BF",
    num: "+226"
  },
  {
    name_ch: "缅甸",
    name_en: "Burma",
    code: "MM",
    num: "+95"
  },
  {
    name_ch: "布隆迪",
    name_en: "Burundi",
    code: "BI",
    num: "+257"
  },
  {
    name_ch: "喀麦隆",
    name_en: "Cameroon",
    code: "CM",
    num: "+237"
  },
  {
    name_ch: "加拿大",
    name_en: "Canada",
    code: "CA",
    num: "+1"
  },
  {
    name_ch: "中非共和国",
    name_en: "Central African Republic",
    code: "CF",
    num: "+236"
  },
  {
    name_ch: "乍得",
    name_en: "Chad",
    code: "TD",
    num: "+235"
  },
  {
    name_ch: "智利",
    name_en: "Chile",
    code: "CL",
    num: "+56"
  },
  {
    name_ch: "中国",
    name_en: "China",
    code: "CN",
    num: "+86"
  },
  {
    name_ch: "哥伦比亚",
    name_en: "Colombia",
    code: "CO",
    num: "+57"
  },
  {
    name_ch: "刚果",
    name_en: "Congo",
    code: "CG",
    num: "+242"
  },
  {
    name_ch: "库克群岛",
    name_en: "Cook Is.",
    code: "CK",
    num: "+682"
  },
  {
    name_ch: "哥斯达黎加",
    name_en: "Costa Rica",
    code: "CR",
    num: "+506"
  },
  {
    name_ch: "古巴",
    name_en: "Cuba",
    code: "CU",
    num: "+53"
  },
  {
    name_ch: "塞浦路斯",
    name_en: "Cyprus",
    code: "CY",
    num: "+357"
  },
  {
    name_ch: "捷克",
    name_en: "Czech Republic",
    code: "CZ",
    num: "+420"
  },
  {
    name_ch: "丹麦",
    name_en: "Denmark",
    code: "DK",
    num: "+45"
  },
  {
    name_ch: "吉布提",
    name_en: "Djibouti",
    code: "DJ",
    num: "+253"
  },
  {
    name_ch: "多米尼加共和国",
    name_en: "Dominica Rep.",
    code: "DO",
    num: "+1890"
  },
  {
    name_ch: "厄瓜多尔",
    name_en: "Ecuador",
    code: "EC",
    num: "+593"
  },
  {
    name_ch: "埃及",
    name_en: "Egypt",
    code: "EG",
    num: "+20"
  },
  {
    name_ch: "萨尔瓦多",
    name_en: "EI Salvador",
    code: "SV",
    num: "+503"
  },
  {
    name_ch: "爱沙尼亚",
    name_en: "Estonia",
    code: "EE",
    num: "+372"
  },
  {
    name_ch: "埃塞俄比亚",
    name_en: "Ethiopia",
    code: "ET",
    num: "+251"
  },
  {
    name_ch: "斐济",
    name_en: "Fiji",
    code: "FJ",
    num: "+679"
  },
  {
    name_ch: "芬兰",
    name_en: "Finland",
    code: "FI",
    num: "+358"
  },
  {
    name_ch: "法国",
    name_en: "France",
    code: "FR",
    num: "+33"
  },
  {
    name_ch: "法属圭亚那",
    name_en: "French Guiana",
    code: "GF",
    num: "+594"
  },
  {
    name_ch: "加蓬",
    name_en: "Gabon",
    code: "GA",
    num: "+241"
  },
  {
    name_ch: "冈比亚",
    name_en: "Gambia",
    code: "GM",
    num: "+220"
  },
  {
    name_ch: "格鲁吉亚",
    name_en: "Georgia",
    code: "GE",
    num: "+995"
  },
  {
    name_ch: "德国",
    name_en: "Germany",
    code: "DE",
    num: "+49"
  },
  {
    name_ch: "加纳",
    name_en: "Ghana",
    code: "GH",
    num: "+233"
  },
  {
    name_ch: "直布罗陀",
    name_en: "Gibraltar",
    code: "GI",
    num: "+350"
  },
  {
    name_ch: "希腊",
    name_en: "Greece",
    code: "GR",
    num: "+30"
  },
  {
    name_ch: "格林纳达",
    name_en: "Grenada",
    code: "GD",
    num: "+1809"
  },
  {
    name_ch: "关岛",
    name_en: "Guam",
    code: "GU",
    num: "+1671"
  },
  {
    name_ch: "危地马拉",
    name_en: "Guatemala",
    code: "GT",
    num: "+502"
  },
  {
    name_ch: "几内亚",
    name_en: "Guinea",
    code: "GN",
    num: "+224"
  },
  {
    name_ch: "圭亚那",
    name_en: "Guyana",
    code: "GY",
    num: "+592"
  },
  {
    name_ch: "海地",
    name_en: "Haiti",
    code: "HT",
    num: "+509"
  },
  {
    name_ch: "洪都拉斯",
    name_en: "Honduras",
    code: "HN",
    num: "+504"
  },
  {
    name_ch: "香港",
    name_en: "Hongkong",
    code: "HK",
    num: "+852"
  },
  {
    name_ch: "匈牙利",
    name_en: "Hungary",
    code: "HU",
    num: "+36"
  },
  {
    name_ch: "冰岛",
    name_en: "Iceland",
    code: "IS",
    num: "+354"
  },
  {
    name_ch: "印度",
    name_en: "India",
    code: "IN",
    num: "+91"
  },
  {
    name_ch: "印度尼西亚",
    name_en: "Indonesia",
    code: "ID",
    num: "+62"
  },
  {
    name_ch: "伊朗",
    name_en: "Iran",
    code: "IR",
    num: "+98"
  },
  {
    name_ch: "伊拉克",
    name_en: "Iraq",
    code: "IQ",
    num: "+964"
  },
  {
    name_ch: "爱尔兰",
    name_en: "Ireland",
    code: "IE",
    num: "+353"
  },
  {
    name_ch: "以色列",
    name_en: "Israel",
    code: "IL",
    num: "+972"
  },
  {
    name_ch: "意大利",
    name_en: "Italy",
    code: "IT",
    num: "+39"
  },
  {
    name_ch: "牙买加",
    name_en: "Jamaica",
    code: "JM",
    num: "+1876"
  },
  {
    name_ch: "日本",
    name_en: "Japan",
    code: "JP",
    num: "+81"
  },
  {
    name_ch: "约旦",
    name_en: "Jordan",
    code: "JO",
    num: "+962"
  },
  {
    name_ch: "柬埔寨",
    name_en: "Kampuchea (Cambodia )",
    code: "KH",
    num: "+855"
  },
  {
    name_ch: "哈萨克斯坦",
    name_en: "Kazakstan",
    code: "KZ",
    num: "+327"
  },
  {
    name_ch: "肯尼亚",
    name_en: "Kenya",
    code: "KE",
    num: "+254"
  },
  {
    name_ch: "韩国",
    name_en: "Korea",
    code: "KR",
    num: "+82"
  },
  {
    name_ch: "科威特",
    name_en: "Kuwait",
    code: "KW",
    num: "+965"
  },
  {
    name_ch: "吉尔吉斯坦",
    name_en: "Kyrgyzstan",
    code: "KG",
    num: "+331"
  },
  {
    name_ch: "老挝",
    name_en: "Laos",
    code: "LA",
    num: "+856"
  },
  {
    name_ch: "拉脱维亚",
    name_en: "Latvia",
    code: "LV",
    num: "+371"
  },
  {
    name_ch: "黎巴嫩",
    name_en: "Lebanon",
    code: "LB",
    num: "+961"
  },
  {
    name_ch: "莱索托",
    name_en: "Lesotho",
    code: "LS",
    num: "+266"
  },
  {
    name_ch: "利比里亚",
    name_en: "Liberia",
    code: "LR",
    num: "+231"
  },
  {
    name_ch: "利比亚",
    name_en: "Libya",
    code: "LY",
    num: "+218"
  },
  {
    name_ch: "列支敦士登",
    name_en: "Liechtenstein",
    code: "LI",
    num: "+423"
  },
  {
    name_ch: "立陶宛",
    name_en: "Lithuania",
    code: "LT",
    num: "+370"
  },
  {
    name_ch: "卢森堡",
    name_en: "Luxembourg",
    code: "LU",
    num: "+352"
  },
  {
    name_ch: "澳门",
    name_en: "Macao",
    code: "MO",
    num: "+853"
  },
  {
    name_ch: "马达加斯加",
    name_en: "Madagascar",
    code: "MG",
    num: "+261"
  },
  {
    name_ch: "马拉维",
    name_en: "Malawi",
    code: "MW",
    num: "+265"
  },
  {
    name_ch: "马来西亚",
    name_en: "Malaysia",
    code: "MY",
    num: "+60"
  },
  {
    name_ch: "马尔代夫",
    name_en: "Maldives",
    code: "MV",
    num: "+960"
  },
  {
    name_ch: "马里",
    name_en: "Mali",
    code: "ML",
    num: "+223"
  },
  {
    name_ch: "马耳他",
    name_en: "Malta",
    code: "MT",
    num: "+356"
  },
  {
    name_ch: "毛里求斯",
    name_en: "Mauritius",
    code: "MU",
    num: "+230"
  },
  {
    name_ch: "墨西哥",
    name_en: "Mexico",
    code: "MX",
    num: "+52"
  },
  {
    name_ch: "摩尔多瓦",
    name_en: "Moldova, Republic of",
    code: "MD",
    num: "+373"
  },
  {
    name_ch: "摩纳哥",
    name_en: "Monaco",
    code: "MC",
    num: "+377"
  },
  {
    name_ch: "蒙古",
    name_en: "Mongolia",
    code: "MN",
    num: "+976"
  },
  {
    name_ch: "蒙特塞拉特岛",
    name_en: "Montserrat Is",
    code: "MS",
    num: "+1664"
  },
  {
    name_ch: "摩洛哥",
    name_en: "Morocco",
    code: "MA",
    num: "+212"
  },
  {
    name_ch: "莫桑比克",
    name_en: "Mozambique",
    code: "MZ",
    num: "+258"
  },
  {
    name_ch: "纳米比亚",
    name_en: "Namibia",
    code: "NA",
    num: "+264"
  },
  {
    name_ch: "瑙鲁",
    name_en: "Nauru",
    code: "NR",
    num: "+674"
  },
  {
    name_ch: "尼泊尔",
    name_en: "Nepal",
    code: "NP",
    num: "+977"
  },
  {
    name_ch: "荷兰",
    name_en: "Netherlands",
    code: "NL",
    num: "+31"
  },
  {
    name_ch: "新西兰",
    name_en: "New Zealand",
    code: "NZ",
    num: "+64"
  },
  {
    name_ch: "尼加拉瓜",
    name_en: "Nicaragua",
    code: "NI",
    num: "+505"
  },
  {
    name_ch: "尼日尔",
    name_en: "Niger",
    code: "NE",
    num: "+227"
  },
  {
    name_ch: "尼日利亚",
    name_en: "Nigeria",
    code: "NG",
    num: "+234"
  },
  {
    name_ch: "朝鲜",
    name_en: "North Korea",
    code: "KP",
    num: "+850"
  },
  {
    name_ch: "挪威",
    name_en: "Norway",
    code: "NO",
    num: "+47"
  },
  {
    name_ch: "阿曼",
    name_en: "Oman",
    code: "OM",
    num: "+968"
  },
  {
    name_ch: "巴基斯坦",
    name_en: "Pakistan",
    code: "PK",
    num: "+92"
  },
  {
    name_ch: "巴拿马",
    name_en: "Panama",
    code: "PA",
    num: "+507"
  },
  {
    name_ch: "巴布亚新几内亚",
    name_en: "Papua New Cuinea",
    code: "PG",
    num: "+675"
  },
  {
    name_ch: "巴拉圭",
    name_en: "Paraguay",
    code: "PY",
    num: "+595"
  },
  {
    name_ch: "秘鲁",
    name_en: "Peru",
    code: "PE",
    num: "+51"
  },
  {
    name_ch: "菲律宾",
    name_en: "Philippines",
    code: "PH",
    num: "+63"
  },
  {
    name_ch: "波兰",
    name_en: "Poland",
    code: "PL",
    num: "+48"
  },
  {
    name_ch: "法属玻利尼西亚",
    name_en: "French Polynesia",
    code: "PF",
    num: "+689"
  },
  {
    name_ch: "葡萄牙",
    name_en: "Portugal",
    code: "PT",
    num: "+351"
  },
  {
    name_ch: "波多黎各",
    name_en: "Puerto Rico",
    code: "PR",
    num: "+1787"
  },
  {
    name_ch: "卡塔尔",
    name_en: "Qatar",
    code: "QA",
    num: "+974"
  },
  {
    name_ch: "罗马尼亚",
    name_en: "Romania",
    code: "RO",
    num: "+40"
  },
  {
    name_ch: "俄罗斯",
    name_en: "Russia",
    code: "RU",
    num: "+7"
  },
  {
    name_ch: "圣马力诺",
    name_en: "San Marino",
    code: "LC",
    num: "+378"
  },
  {
    name_ch: "圣多美和普林西比",
    name_en: "Sao Tome and Principe",
    code: "VC",
    num: "+239"
  },
  {
    name_ch: "沙特阿拉伯",
    name_en: "Saudi Arabia",
    code: "SM",
    num: "+966"
  },
  {
    name_ch: "塞内加尔",
    name_en: "Senegal",
    code: "ST",
    num: "+221"
  },
  {
    name_ch: "塞舌尔",
    name_en: "Seychelles",
    code: "SA",
    num: "+248"
  },
  {
    name_ch: "塞拉利昂",
    name_en: "Sierra Leone",
    code: "SN",
    num: "+232"
  },
  {
    name_ch: "新加坡",
    name_en: "Singapore",
    code: "SC",
    num: "+65"
  },
  {
    name_ch: "斯洛伐克",
    name_en: "Slovakia",
    code: "SL",
    num: "+421"
  },
  {
    name_ch: "斯洛文尼亚",
    name_en: "Slovenia",
    code: "SG",
    num: "+386"
  },
  {
    name_ch: "所罗门群岛",
    name_en: "Solomon Is",
    code: "SK",
    num: "+677"
  },
  {
    name_ch: "索马里",
    name_en: "Somali",
    code: "SI",
    num: "+252"
  },
  {
    name_ch: "南非",
    name_en: "South Africa",
    code: "SB",
    num: "+27"
  },
  {
    name_ch: "西班牙",
    name_en: "Spain",
    code: "SO",
    num: "+34"
  },
  {
    name_ch: "斯里兰卡",
    name_en: "Sri Lanka",
    code: "ZA",
    num: "+94"
  },
  {
    name_ch: "圣卢西亚",
    name_en: "St.Lucia",
    code: "ES",
    num: "+1758"
  },
  {
    name_ch: "圣文森特",
    name_en: "St.Vincent",
    code: "LK",
    num: "+1784"
  },
  {
    name_ch: "苏丹",
    name_en: "Sudan",
    code: "LC",
    num: "+249"
  },
  {
    name_ch: "斯威士兰",
    name_en: "Swaziland",
    code: "VC",
    num: "+268"
  },
  {
    name_ch: "瑞典",
    name_en: "Sweden",
    code: "SD",
    num: "+46"
  },
  {
    name_ch: "瑞士",
    name_en: "Switzerland",
    code: "SZ",
    num: "+41"
  },
  {
    name_ch: "叙利亚",
    name_en: "Syria",
    code: "SE",
    num: "+963"
  },
  {
    name_ch: "台湾省",
    name_en: "Taiwan",
    code: "CH",
    num: "+886"
  },
  {
    name_ch: "塔吉克斯坦",
    name_en: "Tajikstan",
    code: "SY",
    num: "+992"
  },
  {
    name_ch: "坦桑尼亚",
    name_en: "Tanzania",
    code: "TW",
    num: "+255"
  },
  {
    name_ch: "泰国",
    name_en: "Thailand",
    code: "TJ",
    num: "+66"
  },
  {
    name_ch: "多哥",
    name_en: "Togo",
    code: "TZ",
    num: "+228"
  },
  {
    name_ch: "汤加",
    name_en: "Tonga",
    code: "TH",
    num: "+676"
  },
  {
    name_ch: "特立尼达和多巴哥",
    name_en: "Trinidad and Tobago",
    code: "TG",
    num: "+1809"
  },
  {
    name_ch: "突尼斯",
    name_en: "Tunisia",
    code: "TO",
    num: "+216"
  },
  {
    name_ch: "土耳其",
    name_en: "Turkey",
    code: "TT",
    num: "+90"
  },
  {
    name_ch: "土库曼斯坦",
    name_en: "Turkmenistan",
    code: "TN",
    num: "+993"
  },
  {
    name_ch: "乌干达",
    name_en: "Uganda",
    code: "TR",
    num: "+256"
  },
  {
    name_ch: "乌克兰",
    name_en: "Ukraine",
    code: "TM",
    num: "+380"
  },
  {
    name_ch: "阿拉伯联合酋长国",
    name_en: "United Arab Emirates",
    code: "UG",
    num: "+971"
  },
  {
    name_ch: "英国",
    name_en: "United Kiongdom",
    code: "UA",
    num: "+44"
  },
  {
    name_ch: "美国",
    name_en: "United States of America",
    code: "AE",
    num: "+1"
  },
  {
    name_ch: "乌拉圭",
    name_en: "Uruguay",
    code: "GB",
    num: "+598"
  },
  {
    name_ch: "乌兹别克斯坦",
    name_en: "Uzbekistan",
    code: "US",
    num: "+233"
  },
  {
    name_ch: "委内瑞拉",
    name_en: "Venezuela",
    code: "UY",
    num: "+58"
  },
  {
    name_ch: "越南",
    name_en: "Vietnam",
    code: "UZ",
    num: "+84"
  },
  {
    name_ch: "也门",
    name_en: "Yemen",
    code: "VE",
    num: "+967"
  },
  {
    name_ch: "南斯拉夫",
    name_en: "Yugoslavia",
    code: "VN",
    num: "+381"
  },
  {
    name_ch: "津巴布韦",
    name_en: "Zimbabwe",
    code: "YE",
    num: "+263"
  },
  {
    name_ch: "扎伊尔",
    name_en: "Zaire",
    code: "YU",
    num: "+243"
  },
  {
    name_ch: "赞比亚",
    name_en: "Zambia",
    code: "ZW",
    num: "+260"
  }
]

export const commonList = [
  {
    name_ch: "中国",
    name_en: "China",
    code: "CN",
    num: "+86"
  },
  {
    name_ch: "菲律宾",
    name_en: "Philippines",
    code: "PH",
    num: "+63"
  },
  {
    name_ch: "英国",
    name_en: "United Kiongdom",
    code: "UA",
    num: "+44"
  },
  {
    name_ch: "越南",
    name_en: "Vietnam",
    code: "UZ",
    num: "+84"
  },
  {
    name_ch: "韩国",
    name_en: "Korea",
    code: "KR",
    num: "+82"
  }
]

export default codelist;
