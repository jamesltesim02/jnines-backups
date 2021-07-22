const serverError = 'An exception has occurred to the service. Please try again later.'

const ESPORTS_MAPMARKETS = (code, name) => ({
  /** 地图1 */
  [`1_51_${code}`]: `Map 1,${name}`,
  /** 地图2 */
  [`1_52_${code}`]: `Map 2,${name}`,
  /** 地图3 */
  [`1_53_${code}`]: `Map 3,${name}`,
  /** 地图4 */
  [`1_54_${code}`]: `Map 4,${name}`,
  /** 地图5 */
  [`1_55_${code}`]: `Map 5,${name}`,
})

// 列表玩法标题默认值
const LIST_MARKET_TITLE_DEFAULT = ['1X2', 'Handicap', 'O/U']
/**
 * 列表玩法标题构造
 * @param {sting} type 体育类型
 * @param {array} names 标题名数组
 */
const makeMarketTitle = (type, names = LIST_MARKET_TITLE_DEFAULT) => ({
  /** 独赢 */
  [`market1_${type}`]: names[0],
  /** 让分 */
  [`market16_${type}`]: names[1],
  /** 大小 */
  [`market18_${type}`]: names[2],
})

export default {
  /** 语言选项 */
  locale: {
    zh: '简体中文',
    en: 'English',
  },
  /** 服务端错误code */
  errorCode: {
    /** 失败 */
    202: serverError,
    /** 参数错误 */
    400: serverError,
    /** 数据格式化错误 */
    402: serverError,
    /** 地域限制 */
    403: 'The page that you are trying to access has been restricted in this location. We apologize for any inconvenience caused.',
    /** 数据不存在 */
    404: 'Page or data not exist',
    /** 数据不存在 */
    480: 'No data was found',
    /** 数据已存在 */
    485: 'The current data already exists',
    /** 系统内部错误 */
    500: serverError,
    /** 系统维护 */
    503: 'Sorry, the system is under maintenance, please try again later',
    /** 系统内部错误 */
    10003: serverError,
    /** 参数校验错误 */
    10004: serverError,
  },
  /** 统一提示信息 */
  message: {
    /** 页面加载出错,请稍后再试 */
    pageerror: 'Page loading error, Please try again later',
    /** 网络错误,请稍后再试 */
    neterror: 'Network error, Please try again later',
    /** 操作成功 */
    success: 'Successful',
    /** 保存成功 */
    saveSuccess: 'Save successfully',
    /** 您还未登录,请先登录 */
    needLogin: 'You are not logged in yet, please log in first',
    /** 复制成功，内容：{text} */
    copySuccess: 'Copy successfully, copy content is {text}',
    /** 复制失败,请稍后再试 */
    copyFail: 'Copy fail, please try again later'
  },
  /** 通用 */
  common: {
    /** 全选 */
    checkAll: 'Select all',
    /** 确定 */
    ok: 'OK',
    /** 取消 */
    cancel: 'Cancel',
    /** 删除 */
    delete: 'Delete',
    /** 编辑 */
    edit: 'Edit',
    /** 清除 */
    clear: 'Clear',
    /** 关闭 */
    close: 'Close',
    /** 复制 */
    copy: 'Copy',
    /** 保存 */
    save: 'Save',
    /** 返回 */
    back: 'Back',
    /** 暂无更多数据 */
    nomore: 'No more data is available',
    /** 加载更多 */
    loadmore: 'Load more',
    /** 分 */
    minute: 'm',
    /** 余额 */
    balance: 'Balance',
    /** 未登录 */
    unlog: 'Not log in',
    /** 最大 */
    max: 'Max',
    /** 首页 */
    home: 'Home',
    /** 滚球 */
    inPlay: 'In-Play',
    /** 赛果 */
    score: 'Results',
    /** 直播 */
    live: 'Live',
    /** 注单 */
    orders: 'Orders',
    /** 回到顶部 */
    toTop: 'Back to top',
    /** 开始时间 */
    stime: 'Start',
    /** 结束时 */
    etime: 'End',
    /** 暂无数据 label1 */
    empty1: 'NO RECORDS',
    /** 暂无数据 label2 */
    empty2: 'Data not found'
  },
  /** 体育类型 */
  sports: {
    /** 足球 */
    10: 'Soccer',
    /** 篮球 */
    11: 'Basketball',
    /** 网球 */
    12: 'Tennis',
    /** 排球 */
    13: 'Volleyball',
    /** 乒乓球 */
    14: 'TableTennis',
    /** 冰球 */
    15: 'IceHockey',
    /** 棒球 */
    16: 'Baseball',
    /** 电竞 */
    99: 'Esports',
    /** 红彩 */
    // 901: '红彩',
  },
  esports: {
    /** CS GO */
    19: 'CS GO',
    /** Dota2 */
    20: 'Dota2',
    /** 王者荣耀 */
    24: 'Arena Of Valor',
    /** 英雄联 */
    25: 'League of Legends'
  },
  /**
   * 投注项相关
   */
  option: {
    /** 是 */
    Yes: 'Yes',
    /** 否 */
    No: 'No',
    /** 和 */
    Equals: 'Draw',
    /** 主 */
    1: 'Home',
    /** 和 */
    X: 'Draw',
    /** 和 */
    x: 'Draw',
    /** 客 */
    2: 'Away',
    /** 主和 */
    '1X': 'HD',
    /** 主客 */
    12: 'HA',
    /** 和客 */
    X2: 'DA',
    /** 大 */
    Over: 'Over',
    /** 小 */
    Under: 'Under',
    /** 主 */
    Home: 'Home',
    /** 客 */
    Away: 'Away',
    /** 单 */
    Odd: 'Odd',
    /** 双 */
    Even: 'Even',
    /** 其他 */
    Other: 'Other',
    /** 其他 */
    AOS: 'Other',
    /** 和局 */
    XX: 'Draw',
    /** 主是 */
    HY: 'Home Yes',
    /** 主否 */
    HN: 'Home No',
    /** 客是 */
    AY: 'Away Yes',
    /** 客否 */
    AN: 'Away No',
    /** 无 */
    None: 'None',
    /** 上半场 */
    maxscore_1: '1H',
    /** 下半场 */
    maxscore_2: '2H',
    /** 平局 */
    maxscore_Equals: 'Draw',
    /** {team}胜 */
    winner: '{team}Win',
    /** 主或和 */
    '10_1X': 'Home or Draw',
    /** 主或客 */
    '10_12': 'Home or Away',
    /** 和或客 */
    '10_X2': 'Draw or Away',
    /** 主 */
    '16_1': 'Home',
    /** 客 */
    '16_2': 'Away',
    /** 主 */
    '27_H': 'Home',
    /** 客 */
    '27_A': 'Away',
    /** 无进球 */
    '27_NG': 'No Goal',
    /** 平局 */
    '27_Draw': 'Draw',
    /** 无进球 */
    '30_None': 'No Draw' ,
    /** 双方球队 */
    '30_Both': 'Both',
    /** 仅主队 */
    '30_1': 'Only home team',
    /** 仅客队 */
    '30_2': 'Only away team',
    /** 一方 */
    '36_O': 'One side',
    /** 均不 */
    '36_N': 'Neither',
    /** 双方 */
    '36_B': 'Both',
    /** 主先 */
    '38_1:1': 'Home first to score',
    /** 主后 */
    '38_1:2': 'Home second to score',
    /** 客先 */
    '38_2:1': 'Away first to score',
    /** 客后 */
    '38_2:2': 'Away second to score',
    /** 无进球 */
    '38_0:0': 'No goal',
    /** 主/主 */
    '47_1/1': '1/1',
    /** 主/和 */
    '47_1/X': '1/X',
    /** 主/客 */
    '47_1/2': '1/2',
    /** 和/主 */
    '47_X/1': 'X/1',
    /** 和/和 */
    '47_X/X': 'X/X',
    /** 和/客 */
    '47_X/2': 'X/2',
    /** 客/主 */
    '47_2/1': '2/1',
    /** 客/和 */
    '47_2/X': '2/X',
    /** 客/客 */
    '47_2/2': '2/2',
    /** 上半场 */
    '62_1': '1H',
    /** 下半场 */
    '62_2': '2H',
    /** 无进球 */
    '62_None': 'No goal',
    /** 射门 */
    '63_S': 'Shoot',
    /** 头球 */
    '63_H': 'Head',
    /** 点球 */
    '63_P': 'Penalty',
    /** 任意球 */
    '63_FK': 'Free kick',
    /** 乌龙球 */
    '63_OG': 'Own goal',
    /** 无进球 */
    '63_NG': 'No goal',
    /** 主/常规 */
    '224_HR': 'H/Regular',
    /** 主/加时 */
    '224_HE': 'H/Extra-time',
    /** 主/点球 */
    '224_HP': 'H/Penalty',
    /** 客/常规 */
    '224_AR': 'A/Regular',
    /** 客/加时 */
    '224_AE': 'A/Extra-time',
    /** 客/点球 */
    '224_AP': 'A/Penalty',
    /** 主/主 */
    '230_HH': 'Home/Home',
    /** 和/主 */
    '230_DH': 'Draw/Home',
    /** 主/客 */
    '230_HA': 'Home/Away',
    /** 客/主 */
    '230_AH': 'Away/Home',
    /** 和/客 */
    '230_DA': 'Draw/Away',
    /** 客/客 */
    '230_AA': 'Away/Away',
    /** 无 */
    '230_NO': 'None',
    /** 是/主胜 */
    '231_YH': 'Y/H',
    /** 是/客胜 */
    '231_YA': 'Y/A',
    /** 是/和局 */
    '231_YD': 'Y/D',
    /** 否/主胜 */
    '231_NH': 'N/H',
    /** 否/客胜 */
    '231_NA': 'N/A',
    /** 否/和局 */
    '231_ND': 'N/D',
    /** 主 {value}分 */
    '290_Home': 'Home {value}',
    /** 客 {value}分 */
    '290_Away': 'Away {value}',
    /** 平局 */
    '290_Draw': 'Draw',
  },
  /**
   * 玩法相关  
   * 规则: sportId_marketGroup_marketStage_marketType  
   * sportId: 10 足球, 11 篮球  
   */
  market: {
    /** 足球 */
    10: {
      /** 胜平负 */
      '1_0_1': '1X2',
      /** 上半场胜平负 */
      '1_1_1': '1H,1X2',
      /** 下半场胜平负 */
      '1_2_1': '2H,1X2',
      /** 双胜彩 */
      '1_0_10': 'Double Chance',
      /** 上半场双胜彩 */
      '1_1_10': '1H,Double Chance',
      /** 下半场双胜彩 */
      '1_2_10': '2H,Double Chance',
      /** 让分胜平负 */
      '1_0_14': 'Handicap,1X2',
      /** 上半场让分胜平负 */
      '1_1_14': '1H,Handicap,1X2',
      /** 下半场让分胜平负 */
      '1_2_14': '2H,Handicap,1X2',
      /** 让分 */
      '1_0_16': 'Handicap',
      /** 上半场让分 */
      '1_1_16': '1H,Handicap',
      /** 下半场让分 */
      '1_2_16': '2H,Handicap',
      /** 大小 */
      '1_0_18': 'O/U',
      /** 上半场大小 */
      '1_1_18': '1H,O/U',
      /** 下半场大小 */
      '1_2_18': '2H,O/U',
      /** 精准进球数 */
      '1_0_21': 'Number of Goals',
      /** 上半场精准进球数 */
      '1_1_21': '1H,Number of Goals',
      /** 下半场精准进球数 */
      '1_2_21': '2H,Number of Goals',
      /** 平局退款 */
      '1_0_23': 'Draw no bet',
      /** 上半场平局退款 */
      '1_1_23': '1H,Draw no bet',
      /** 下半场平局退款 */
      '1_2_23': '2H,Draw no bet',
      /** 总分范围 */
      '1_0_25': 'Score Range',
      /** 上半场总分范围 */
      '1_1_25': '1H score range',
      /** 下半场总分范围 */
      '1_2_25': '2H score range',
      /** 单双 */
      '1_0_26': 'O/E',
      /** 上半场单双 */
      '1_1_26': '1H,O/E',
      /** 下半场单双 */
      '1_2_26': '2H,O/E',
      /** 净胜球数 */
      '1_0_27': 'Goal difference',
      /** 上半场净胜球数 */
      '1_1_27': '1H goal difference',
      /** 下半场净胜球数 */
      '1_2_27': '2H goal difference',
      /** 两队均得分 */
      '1_0_29': 'Both team to score',
      /** 上半场两队均得分 */
      '1_1_29': '1H,both team to score',
      /** 下半场两队均得分 */
      '1_2_29': '2H,both team to score',
      /** 得分球队 */
      '1_0_30': 'Team to score',
      /** 上半场得分球队 */
      '1_1_30': '1H,Team to score',
      /** 下半场得分球队 */
      '1_2_30': '2H,Team to score',
      /** 主队准确得分 */
      '1_0_31': 'Home exact goals',
      /** 上半场主队准确得分 */
      '1_1_31': '1H,Home exact goals',
      /** 下半场主队准确得分 */
      '1_2_31': '2H,Home exact goals',
      /** 客队准确得分 */
      '1_0_32': 'Away exact goals',
      /** 上半场客队准确得分 */
      '1_1_32': '1H,Away exact goals',
      /** 下半场客队准确得分 */
      '1_2_32': '2H,Away exact goals',
      /** 主胜且零封 */
      '1_0_33': 'Home wins to nil',
      /** 客胜且零封 */
      '1_0_34': 'Away wins to nil',
      /** 胜出且零封 */
      '1_0_35': 'Win to nil',
      /** 双方得分情况 */
      '1_0_36': 'Score of both',
      /** 零失球 */
      '1_0_37': 'Clean Sheet',
      /** 首先/最后进球 */
      '1_0_38': 'First/Last to score',
      /** 上半场首先/最后进球 */
      '1_1_38': 'IH,First/Last to score',
      /** 下半场首先/最后进球 */
      '1_2_38': '2H,First/Last to score', 
      /** 主队大小 */
      '1_0_40': 'Home O/U',
      /** 上半场主队大小 */
      '1_1_40': '1H,Home O/U',
      /** 下半场主队大小 */
      '1_2_40': '2H,Home O/U',
      /** 客队大小 */
      '1_0_41': 'Away O/U',
      /** 上半场客队大小 */
      '1_1_41': '1H,Away O/U',
      /** 下半场客队大小 */
      '1_2_41': '2H,Away O/U',
      /** 正确比分 */
      '1_0_45': 'Correct score',
      /** 上半场正确比分 */
      '1_1_45': '1H,correct score',
      /** 下半场正确比分 */
      '1_2_45': '2H,correct score',
      /** 半全场 */
      '1_0_47': 'HT/FT',
      /** 主队两个半场均得分 */
      '1_0_48': 'Home team to score in 1H-2H',
      /** 客队两个半场均得分 */
      '1_0_49': 'Away team to score in 1H-2H',
      /** 主队任意半场获胜 */
      '1_0_50': 'Home team wins in any half',
      /** 客队任意半场获胜 */
      '1_0_51': 'Away team wins in any half',
      /** 最高得分半场 */
      '1_0_52': 'Highest scoring in half',
      /** 主队最高得分半场 */
      '1_0_53': 'Home team highest scoring in half',
      /** 客队最高得分半场 */
      '1_0_54': 'Away team highest scoring in half',
      /** 半场均大于1.5 */
      '1_0_55': 'Each half is over@1.5',
      /** 半场均小于1.5 */
      '1_0_56': 'Each half is under@1.5',
      /** 首球半场 */
      '1_0_62': 'First goal in half',
      /** 首球方式' */
      '1_0_63': 'Way of first goal', 
      /** 下一个进球 */
      '1_0_160': 'Next goal',
      /** 是否加时赛 */
      '1_0_220': 'Will there be Extra-time?',
      /** 是否点球 */
      '1_0_221': 'Will there be Penalty?',
      /** 是否和局 */
      '1_0_222': 'Will it be draw?',
      /** 加时进球 */
      '1_0_223': 'To score in extra-time',
      /** 比赛终结方式 */
      '1_0_224': 'Way of match ends',
      /** 赛果/首球 */
      '1_0_230': 'Result/First goal',
      /** 均得分/赛果 */
      '1_0_231': 'Both to score/score',
      /** 最后得分球队 */
      '1_0_448': 'Last team to score',
      /** 角球胜平负 */
      '2_0_1': 'Corners 1X2',
      /** 上半场角球胜平负 */
      '2_1_1': '1H,Corners 1X2',
      /** 下半场角球胜平负 */
      '2_2_1': '2H,Corners 1X2',
      /** 角球让分 */
      '2_0_16': 'Handicap Corners',
      /** 上半场角球让分 */
      '2_1_16': '1H,Handicap Corners',
      /** 下半场角球让分 */
      '2_2_16': '2H,Handicap Corners',
      /** 角球大小 */
      '2_0_18': 'O/U Corners',
      /** 上半场角球大小 */
      '2_1_18': '1H,O/U Corners',
      /** 下半场角球大小 */
      '2_2_18': '2H,O/U Corners',
      /** 谁先开球 */
      '5_0_16': 'Which team to kick off',
      
    },
    /** 篮球 */
    11: {
      /** 让分 */
      '1_0_16': 'Handicap',
      /** 上半场让分 */
      '1_1_16': '1H Handicap',
      /** 第1节让分 */
      '1_51_16': '1st Quarter,Handicap',
      /** 第2节让分 */
      '1_52_16': '2nd Quarter,Handicap',
      /** 第3节让分 */
      '1_53_16': '3rd Quarter,Handicap',
      /** 第4节让分 */
      '1_54_16': '4th Quarter,Handicap',
      /** 大小 */
      '1_0_18': 'O/U',
      /** 上半场大小 */
      '1_1_18': '1H,O/U',
      /** 第1节大小 */
      '1_51_18': '1st Quarter,O/U',
      /** 第2节大小 */
      '1_52_18': '2nd Quarter,O/U',
      /** 第3节大小 */
      '1_53_18': '3rd Quarter,O/U',
      /** 第4节大小 */
      '1_54_18': '4th Quarter,O/U',
      /** 单双 */
      '1_0_26': 'O/E',
      /** 上半场单双 */
      '1_1_26': '1H,odd/even',
      /** 第1节单双 */
      '1_51_26': '1st Quarter,odd/even',
      /** 第2节单双 */
      '1_52_26': '2nd Quarter,odd/even',
      /** 第3节单双 */
      '1_53_26': '3rd Quater,odd/even',
      /** 第4节单双 */
      '1_54_26': '4th Quater,odd/even',
      /** 半全场 */
      '1_0_47': 'HT/FT',
      /** 胜负 */
      '1_0_186': 'Win or lose',
      /** 上半场胜负 */
      '1_1_186': '1H,Win or lose',
      /** 第1节胜负 */
      '1_51_186': '1st Quarter,Win or lose',
      /** 第2节胜负 */
      '1_52_186': '2nd Quarter,Win or lose',
      /** 第3节胜负 */
      '1_53_186': '3rd Quarter,Win or lose',
      /** 第4节胜负 */
      '1_54_186': '4th Quarter,Win or lose',
      /** 是否进入加时赛 */
      '1_0_220': 'Will there be overtime?',
      /** 胜分范围 */
      '1_0_290': 'Winning Range',
      /** 上半场胜分范围 */
      '1_1_290': '1H,Winning Range',
      /** 第1节胜分范围 */
      '1_51_290': '1st Quarter,Winning Range',
      /** 第2节胜分范围 */
      '1_52_290': '2nd Quarter,Winning Range',
      /** 第3节胜分范围 */
      '1_53_290': '3rd Quarter,Winning Range',
      /** 第4节胜分范围 */
      '1_54_290': '4th Quarter,Winning Range',
    },
    /** 网球 */
    12: {
      /** 胜负 */
      '1_0_186': 'Win or Lose',
      /** 让盘 */
      '1_0_16': 'Handicap in Set',
      /** 盘数比分 */
      '1_0_1302': 'Set Score',
      /** 让局 */
      '1_0_153': 'Handicap in Game',
      /** 总局数大小 */
      '1_0_18': 'Total number in O/U',
      /** 总局数单双 */
      '1_0_1305': 'Total number is O/E',
    },
    /** 排球 */
    13: {
      /** 让分 */
      '1_0_16': 'Handicap',
      /** 大小 */
      '1_0_18': 'O/U',
      /** 胜负 */
      '1_0_186': 'Win or lose',
      /** 单双 */
      '1_0_26': 'O/E',
    },
    /** 乒乓球 */
    14: {
      /** 让分 */
      '1_0_16': 'Handicap',
      /** 胜负 */
      '1_0_186': 'Win or lose',
    },
    /** 冰球 */
    15: {
      /** 让分 */
      '1_0_16': 'Handicap',
      /** 大小 */
      '1_0_18': 'O/U',
      /** 胜负 */
      '1_0_186': 'Win or lose',
      /** 单双 */
      '1_0_26': 'O/E',
    },
    /** 棒球 */
    16: {
      /** 让分 */
      '1_0_16': 'Handicap',
      /** 大小 */
      '1_0_18': 'O/U',
      /** 胜负 */
      '1_0_186': 'Win or lose',
      /** 上半场让分 */
      '1_1_16': '1H,Handicap',
      /** 上半场大小 */
      '1_1_18': '1H,O/U',
      /** 上半场胜负 */
      '1_1_186': '1H,Win or lose',
    },
    /** 电竞 */
    99: {
      /** 让分 */
      '1_0_16': 'Handicap',
      /** 大小 */
      '1_0_18': 'O/U',
      /** 胜负 */
      '1_0_186': 'Money Line',
      // 第x图胜负
      ...ESPORTS_MAPMARKETS('9001', 'Moneyline'),
      // 第x图让分
      ...ESPORTS_MAPMARKETS('9002', 'Total Kills Handicap'),
      // 第x图大小
      ...ESPORTS_MAPMARKETS('9003', 'Total Kills Over/Under'),
      // 第x图击杀总数胜负
      ...ESPORTS_MAPMARKETS('9004', 'Total Kills Moneyline'),
      // 第x图击杀总数单双
      ...ESPORTS_MAPMARKETS('9005', 'Total Kills Odd/Even'),
      // 第x图第一滴血
      ...ESPORTS_MAPMARKETS('9006', 'First Blood'),
      // TODO 待确认 第x图首先达到X杀
      ...ESPORTS_MAPMARKETS('9007', 'First to Y Kills'),
      // 第x图摧毁防御塔让分
      ...ESPORTS_MAPMARKETS('9008', 'Total Towers Handicap'),
      // 第x图摧毁防御塔大小
      ...ESPORTS_MAPMARKETS('9009', 'Total Towers Over/Under'),
      // 第x图摧毁防御塔胜负
      ...ESPORTS_MAPMARKETS('9010', 'Total Towers Moneyline'),
      // TODO 待确认 第x图第一防御塔-第Y层
      ...ESPORTS_MAPMARKETS('9011', 'First Tier Y Tower'),
      // 第x图击杀肉山让分
      ...ESPORTS_MAPMARKETS('9012', 'Total Roshans Handicap'),
      // 第x图击杀肉山大小
      ...ESPORTS_MAPMARKETS('9013', 'Total Roshans Over/Under'),
      // 第x图击杀肉山胜负
      ...ESPORTS_MAPMARKETS('9014', 'Total Roshans Moneyline'),
      // 第x图击杀首个肉山
      ...ESPORTS_MAPMARKETS('9015', '1st Roshan'),
      // 第x图击杀第二个肉山
      ...ESPORTS_MAPMARKETS('9016', '2nd Roshan'),
      // 第x图击杀第三个肉山
      ...ESPORTS_MAPMARKETS('9017', '3rd Roshan'),
      // 第x图摧毁兵营总数让分
      ...ESPORTS_MAPMARKETS('9018', 'Total Barracks Handicap'),
      // 第x图摧毁兵营总数大小
      ...ESPORTS_MAPMARKETS('9019', 'Total Barracks Over/Under'),
      // 第x图摧毁兵营总数胜负
      ...ESPORTS_MAPMARKETS('9020', 'Total Barracks Moneyline'),
      // 第x图摧毁首座兵营
      ...ESPORTS_MAPMARKETS('9021', 'Barracks 1st Lane'),
      // 第x图摧毁第二座兵营
      ...ESPORTS_MAPMARKETS('9022', 'Barracks 2nd Lane'),
      // 第x图摧毁第三座兵营
      ...ESPORTS_MAPMARKETS('9023', 'Barracks 3rd Lane'),
      // 第x图摧毁炮塔总数让分
      ...ESPORTS_MAPMARKETS('9024', 'Total Turrets Handicap'),
      // 第x图摧毁炮塔总数大小
      ...ESPORTS_MAPMARKETS('9025', 'Total Turrets Over/Under'),
      // 第x图摧毁炮塔总数胜负
      ...ESPORTS_MAPMARKETS('9026', 'Total Turrets Moneyline'),
      // TODO 待确认 第x图首先摧毁X座炮塔
      ...ESPORTS_MAPMARKETS('9027', 'First Tier Y Turret'),
      // 第x图击杀巨龙总数让分
      ...ESPORTS_MAPMARKETS('9028', 'Total Dragons Handicap'),
      // 第x图击杀巨龙总数大小
      ...ESPORTS_MAPMARKETS('9029', 'Total Dragons Over/Under'),
      // 第x图击杀巨龙总数胜负
      ...ESPORTS_MAPMARKETS('9030', 'Total Dragons Moneyline'),
      // 第x图击杀第一只巨龙
      ...ESPORTS_MAPMARKETS('9031', '1st Dragon'),
      // 第x图击杀第二只巨龙
      ...ESPORTS_MAPMARKETS('9032', '2nd Dragon'),
      // 第x图击杀第三只巨龙
      ...ESPORTS_MAPMARKETS('9033', '3rd Dragon'),
      // 第x图击杀男爵总数让分
      ...ESPORTS_MAPMARKETS('9034', 'Total Barons Handicap'),
      // 第x图击杀男爵总数大小
      ...ESPORTS_MAPMARKETS('9035', 'Total Barons Over/Under'),
      // 第x图击杀男爵总数胜负
      ...ESPORTS_MAPMARKETS('9036', 'Total Barons Moneyline'),
      // 第x图击杀首个男爵
      ...ESPORTS_MAPMARKETS('9037', '1st Baron'),
      // 第x图击杀第二个男爵
      ...ESPORTS_MAPMARKETS('9038', '2nd Baron'),
      // 第x图击杀第三个男爵
      ...ESPORTS_MAPMARKETS('9039', '3rd Baron'),
      // 第x图摧毁水晶总数让分
      ...ESPORTS_MAPMARKETS('9040', 'Total Inhibitors Handicap'),
      // 第x图摧毁水晶总数大小
      ...ESPORTS_MAPMARKETS('9041', 'Total Inhibitors Over/Under'),
      // 第x图摧毁水晶总数胜负
      ...ESPORTS_MAPMARKETS('9042', 'Total Inhibitors Moneyline'),
      // 第x图摧毁首个水晶
      ...ESPORTS_MAPMARKETS('9043', '1st Inhibitor'),
      // 第x图摧毁第二个水晶
      ...ESPORTS_MAPMARKETS('9044', '2nd Inhibitor'),
      // 第x图摧毁第三个水晶
      ...ESPORTS_MAPMARKETS('9045', '3rd Inhibitor'),
      // 第x图击杀暴君总数让分
      ...ESPORTS_MAPMARKETS('9046', 'Total Tyrants Handicap'),
      // 第x图击杀暴君总数大小
      ...ESPORTS_MAPMARKETS('9047', 'Total Tyrants Over/Under'),
      // 第x图击杀暴君总数胜负
      ...ESPORTS_MAPMARKETS('9048', 'Total Tyrants Moneyline'),
      // 第x图击杀第一个暴君
      ...ESPORTS_MAPMARKETS('9049', '1st Tyrant'),
      // 第x图击杀第二个暴君
      ...ESPORTS_MAPMARKETS('9050', '2nd Tyrant'),
      // 第x图击杀第三个暴君
      ...ESPORTS_MAPMARKETS('9051', '3rd Tyrant'),
      // 第x图击杀主宰总数让分
      ...ESPORTS_MAPMARKETS('9052', 'Total Overlords Handicap'),
      // 第x图击杀主宰总数大小
      ...ESPORTS_MAPMARKETS('9053', 'Total Overlords Over/Under'),
      // 第x图击杀主宰总数胜负
      ...ESPORTS_MAPMARKETS('9054', 'Total Overlords Moneyline'),
      // 第x图击杀首个主宰 
      ...ESPORTS_MAPMARKETS('9055', '1st Overlord'),
      // 第x图击杀第二个主宰
      ...ESPORTS_MAPMARKETS('9056', '2nd Overlord'),
      // 第x图击杀第三个主宰
      ...ESPORTS_MAPMARKETS('9057', '3rd Overlord'),
      // 第x图比赛时间大小
      ...ESPORTS_MAPMARKETS('9058', 'Duration Over/Under (Mins)'),
      // 第x图回合获胜让分
      ...ESPORTS_MAPMARKETS('9059', 'Rounds Handicap'),
      // 第x图回合获胜大小
      ...ESPORTS_MAPMARKETS('9060', 'Rounds Over/Under'),
      // 第x图回合获胜单双
      ...ESPORTS_MAPMARKETS('9061', 'Rounds Odd/Even'),
      // 第x图首先赢得X回合
      ...ESPORTS_MAPMARKETS('9062', 'First to Y Rounds'),
      // 第x图赢得上半场
      ...ESPORTS_MAPMARKETS('9063', 'First Half'),
      // 第x图赢得下半场
      ...ESPORTS_MAPMARKETS('9064', 'Second Half'),
      // 第x图最多第一杀
      ...ESPORTS_MAPMARKETS('9065', 'Most First Kill'),
      // 第x图最后存活玩家
      ...ESPORTS_MAPMARKETS('9066', 'Clutches'),
      // 第x图第16回合
      ...ESPORTS_MAPMARKETS('9067', '16th Round'),
      // TODO 待确认 第x图第X回合胜负
      ...ESPORTS_MAPMARKETS('9068', 'Round Y Moneyline'),
      // 第x图第X回合击杀总数胜负
      ...ESPORTS_MAPMARKETS('9069', 'Round Y Total Kills Moneyline'),
      // 第x图第X回合击杀总数大小
      ...ESPORTS_MAPMARKETS('9070', 'Round Y Total Kills Over/Under'),
      // 第x图第X回合击杀总数单双
      ...ESPORTS_MAPMARKETS('9071', 'Round Y Total Kills Odd/Even'),
      // TODO 待确认 第x图第X回合首杀
      ...ESPORTS_MAPMARKETS('9072', 'Round Y First Kill'),
      // 第x图第X回合炸弹安放
      ...ESPORTS_MAPMARKETS('9073', 'Round Y Bomb Plant'),
      // 第x图出现加时赛
      ...ESPORTS_MAPMARKETS('9074', 'Rounds Over/Under (Overtime)'),
      // 第x图最后回合炸弹安放
      ...ESPORTS_MAPMARKETS('9075', 'Final Round Bomb Plant'),
      // 第x图最后存活玩家让分
      ...ESPORTS_MAPMARKETS('9076', 'Clutches Handicap'),
      // 第x图第X回合击杀总数让分
      ...ESPORTS_MAPMARKETS('9077', 'Round Y Total Kills Handicap'),
      // 第x图摧毁防御塔总数单双
      ...ESPORTS_MAPMARKETS('9078', 'Total Towers Odd/Even'),
      // 第x图击杀肉山总数单双
      ...ESPORTS_MAPMARKETS('9079', 'Total Roshans Odd/Even'),
      // 第x图摧毁兵营总数单双
      ...ESPORTS_MAPMARKETS('9080', 'Total Barracks Odd/Even'),
      // 第x图摧毁炮塔总数单双
      ...ESPORTS_MAPMARKETS('9081', 'Total Turrets Odd/Even'),
      // 第x图击杀巨龙总数单双
      ...ESPORTS_MAPMARKETS('9082', 'Total Dragons Odd/Even'),
      // 第x图击杀男爵总数单双
      ...ESPORTS_MAPMARKETS('9083', 'Total Barons Odd/Even'),
      // 第x图摧毁水晶总数单双
      ...ESPORTS_MAPMARKETS('9084', 'Total Inhibitors Odd/Even'),
      // 第x图击杀暴君总数单双
      ...ESPORTS_MAPMARKETS('9085', 'Total Tyrants Odd/Even'),
      // 第x图击杀男爵总数单双
      ...ESPORTS_MAPMARKETS('9086', 'Total Overlords Odd/Even'),
      // 第x图出现加时赛
      ...ESPORTS_MAPMARKETS('9087', 'Overtime'),
      // 第x图精准得分
      ...ESPORTS_MAPMARKETS('9088', 'Correct score'),
    },
  },
  periods: {
    /**   */
    10: ' ',
    /** 节 */
    11: 'Period',
    /** 盘 */
    12: 'Set',
    /** 等待加时 */
    16: ' ',
    /** Map */
    99: 'Map',
  },
  /** 滚球对应阶段 */
  period: {
    /** 未开赛 */
    0: 'Not yet start',
    /** 第1{type} */
    1: '1st{type}',
    /** 第2{type} */
    2: '2nd{type}',
    /** 第3{type} */
    3: '3rd{type}',
    /** 第4{type} */
    4: '4th{type}',
    /** 第5{type} */
    5: '5th{type}',
    /** 第6{type} */
    6: '6th{type}',
    /** 第7{type} */
    7: '7th{type}',
    /** 第8{type} */
    8: '8th{type}',
    /** 第9{type} */
    9: '9th{type}',
    /** 上半场 */
    10: '1H',
    /** 下半场 */
    11: '2H',
    /** 已开始 */
    13: 'Started',
    /** 暂停 */
    14: 'Suspend',
    /** 半场 */
    15: 'Half',
    /** 等待加时 */
    16: 'Waiting for overtime',
    /** 加时中 */
    17: 'In overtime',
    /** 加时上半场 */
    18: '1H,overtime',
    /** 加时赛中场 */
    19: 'Midfield,overtime',
    /** 加时下半场 */
    20: '2H,overtime',
    /** 加时赛后 */
    21: 'Overtime afther game',
    /** 等待点球 */
    22: 'Wait for penalty',
    /** 点球中 */
    23: 'In penalty',
    /** 点球后 */
    24: 'After penalty',
    /** 中断 */
    25: 'Suspend',
    /** 停赛 */
    26: 'Suspension',
    /** 弃赛 */
    27: 'Quiiting the competition',
    /** 弃权 */
    28: 'Abstention',
    /** 取消 */
    29: 'Cancel',
    /** 金局后 */
    30: '金局后',
    /** 第1{type}完场后 */
    31: '1st{type}after game',
    /** 第2{type}完场后 */
    32: '2nd{type}after game',
    /** 第3{type}完场后 */
    33: '3rd{type}after game',
    /** 第4{type}完场后 */
    34: '4th{type}after game',
    /** 第5{type}完场后 */
    35: '5th{type}after game',
    /** 第6{type}完场后 */
    36: '6th{type}after game',
    /** 第7{type}完场后 */
    37: '7th{type}after game',
    /** 第8{type}完场后 */
    38: '8th{type}after game',
    /** 延期 */
    40: 'Extension',
    /** 推迟开赛 */
    41: 'Match Delay',
    /** 完场 */
    100: 'Full-Time',
    /** 进行中 */
    999: 'Playing...',
  },
  /** 玩法分类 */
  categories: {
    /** 全部 */
    all: 'All',
    /** 主要玩法 */
    1: 'Major',
    /** 亚洲玩法 */
    2: 'Asia',
    /** 半场玩法 */
    3: 'Half',
    /** 附加玩法 */
    4: 'Additional',
    /** 角球玩法 */
    5: 'Corner',
    /** 罚牌玩法 */
    6: 'Penalty',
    /** 单节玩法 */
    7: 'Quarter',
  },
  /** 赛事 */
  matchs: {
    /** 比赛详情 */
    detailTitle: 'Match detail',
    /** 当前暂无滚球和精选比赛 */
    nospecial: 'There are currently no Lives and select matches',
    /** 直播预告 */
    livenotice: 'Live preview',
    /** 视频直播 */
    video: 'Live video',
    /** 动画直播 */
    lmt: 'Animation',
    /** 清空收藏成功 */
    clearSuccess: 'Clear the collection successfully',
    /** 确定要清空所有比赛吗? */
    clearConfirm: 'Sure to clear all the matches?',
    /** 暂无玩法 */
    nomarket: 'No play',
    /** 未找到相关比赛 */
    notfound: 'No matches were found',
    /** 注单 */
    orderTab: 'Orders',
    /** 比赛已结束 */
    finished: 'Match is finished',
    /** 即将开赛 */
    playsoon: 'Match is abouot to start',
    /** 角球 */
    corner: 'Corners',
    /** 国家/地区 */
    area: 'Country/Region',
    /** 收起 */
    collapse: 'Pack up',
    /** 查看更多 */
    showmore: 'More...',
    /** 查看全部赛事 */
    showall: 'View all events',
    /** 查看全部赛事 */
    showallInplay: 'View all Live',
    /** 我的赛程 */
    myFav: 'Favorites',
    /** 添加收藏成功 */
    addFavSuccess: 'Add collection successfully',
    /** 取消收藏成功 */
    cancelFavSuccess: 'Cancel collection successfully',
    /** 焦点赛事 */
    focus: 'Select matches',
    /** 现场滚球 */
    inplays: 'Live',
    /** 推荐比赛 */
    recommend: 'Recommend',
    /** 列表玩法标题名-足球: 独赢, 让分, 大小  */
    ...makeMarketTitle(10),
    /** 列表玩法标题名-篮球: 独赢, 让分, 大小  */
    ...makeMarketTitle(11),
    /** 列表玩法标题名-网球: 独赢, 让盘, 总局数  */
    ...makeMarketTitle(12, ['1X2', 'Handicap in Set', 'Total number in O/U']),
    /** 列表玩法标题名-排球: 独赢, 让分, 大小  */
    ...makeMarketTitle(13),
    /** 列表玩法标题名-乒乓球: 独赢, 让分, 大小  */
    ...makeMarketTitle(14),
    /** 列表玩法标题名-冰球: 独赢, 让分, 大小  */
    ...makeMarketTitle(15),
    /** 列表玩法标题名-棒球: 独赢, 让分, 大小  */
    ...makeMarketTitle(16),
    /** 列表玩法标题名-电竞: 独赢, 让盘, 总局数  */
    ...makeMarketTitle(99),
    /** 精选足球 */
    featured10: 'Soccer',
    /** 精选篮球 */
    featured11: 'Basketball',
    /** 玩法 */
    marketLabel: 'Method',
    /** 赛事预告 */
    advance: 'Events',
    /** 场比赛 */
    mcounts: ' matchs',
    /** 场 */
    smcounts: ' matchs',
    /** 暂无比赛 */
    nomatchs: 'No match',
    /** 热门精选 */
    featured: 'Popular selection',
    /** 联赛 */
    tour: 'Events',
    /** 比赛状态 */
    states: {
      /** 滚球 */
      live: 'Live',
      /** 今日 */
      today: 'Today',
      /** 早盘 */
      early: 'Early',
      /** 串关 */
      combo: 'Parlay',
    },
    advances: {
      /** 顶级 */
      toptour1: 'Top',
      /** 联赛 */
      toptour2: 'Leagues',
      /** 近12 */
      last12h1: 'Near 12',
      /** 小时 */
      last12h2: 'Hours',
      /** 即将 */
      soon1: 'Up',
      /** 开赛 */
      soon2: 'coming',
    }
  },
  /** 投注 */
  bet: {
    /** 投注单 */
    title: 'bet slip',
    /** 点水出错 */
    quoteError: 'Quote error',
    /** 至少需要投注{count}串1 */
    comboCountError: 'At least to bet {count} strings 1',
    /** 最小投注{amount}元 */
    betAmountError: 'Min {amount}',
    /** 至少{count}串1 */
    comboCountNeed: 'At least {count}',
    /** 投注单 */
    comboTitle: 'Betting slip',
    /** {count}串1 */
    comboName: '{count} combo 1',
    /** 投注金额 */
    amount: 'Bet amount',
    /** 预计返还 */
    willback: 'Will return',
    /** 投注限额 */
    amountMax: 'Betting limits',
    /** 投 注 */
    doBet: 'Do a bet',
    /** 总投注金额 */
    totalAmount: 'Total amount',
    /** 总返还 */
    totalBack: 'Total return',
    /** 查看订单 */
    showOrder: 'Check my orders',
    /** 暂不可投 */
    inbetable: 'Temporarily do not bet',
    /** 投注确认中 */
    pending: 'Processing',
    /** 投注成功 */
    success: 'Betting successfully',
    /** 投注失败 */
    error: 'Betting failed',
    /** 投注成功 */
    betSuccessToast: 'Betting successful: {billno}',
    /** 投注失败 */
    betFailToast: 'Betting failed: {billno}',
    /** 请注意接收投注结果信息 */
    pendingDesc: 'Please note to receive betting result information',
    /** 更多信息到我的订单查看 */
    successDesc: 'See my orders for more information',
    /** 已达到本场投注上线 */
    overbet: 'This bet has reached its limit. Try something else.',
    /** 赔率不符 */
    '1': 'Invalid odds',
    /** 超出投注限额 */
    '2': 'Over limit',
    /** 投注项获取失败 */
    '3': 'No option redis',
    /** 投注项关闭 */
    '5': 'Option close',
    /** 系统异常 */
    '6': 'System exeception',
    /** 参数错误 */
    '7': 'Parameter error',
    /** 低于最小限额 */
    '8': 'Below the minimum limit',
    /** 超出最大返还 */
    '9': 'Over the maximum return',
    /** 危险球退单 */
    '10': 'Danger return',
    /** 频繁投注该盘口 */
    '11': 'Trash out',
    /** 串关注数错误 */
    '12': 'Combo count error',
    /** 赔率获取失败 */
    '13': 'No market redis',
    /** 超出风控限额 */
    '15': 'Exceed the risk limit',
    /** 超出风控限额 */
    '16': 'Exceed the risk limit',
    /** 获取限额失败 */
    '17': 'Quota error',
    /** 超出限额 */
    '18': 'Over limit ',
    /** 串关多个投注项不能包含同一场比赛 */
    '19': 'Combo bets cannot contain the same match',
    /** 该比赛不支持串关 */
    '20': 'Combo bet is not supported in this match',
    /** 该赛事不支持串关 */
    '21': 'Combo bet is not supported in this tournament',
    /** 登录失效 */
    '101': 'Logon failure',
    /** 余额不足 */
    '102': 'Insufficient Balance',
    /** 注单保存失败 */
    '103': 'Ticket is failed to save',
    /** 赔率变更 */
    '104': 'odds change',
    /** 资金调整失败 */
    '106': 'Fund tansfer failure'
  },
  /** 注单 */
  order: {
    /** 平 */
    draw: 'Draw',
    /** 盈 */
    win: 'Win',
    /** 亏 */
    lose: 'Lose',
    /** 退 */
    cancel: 'Canceled',
    /** 订单号 */
    billno: 'Slip No.',
    /** 投注额 */
    amount: 'Stake',
    /** 预计返还 */
    willback: 'Will return',
    /** 总返还 */
    backed: 'Total return',
    /** 未结算 */
    unsettle: 'Unsettle',
    /** 已结算 */
    settled: 'Settled'
  },
  /** 公告 */
  annou: {
    /** 公告列表 */
    listtitle: 'Announcement lists',
    /** 公告详情 */
    detailtitle: 'Announcement details',
    /** 未找到公告信息 */
    notfound: 'No announcement information found',
    /** 尊贵的贵宾： */
    customer: 'Dear Customer:',
    /** 您好! */
    welcome: ' '
  },
  settings: {
    /** 存取款 */
    deposit: 'DP/WD',
    /** 注册 */
    signup: 'Sign up',
    /** 登录 */
    signin: 'Sign in',
    /** 注销 */
    signout: 'Sign out',
    /** 退出成功 */
    sosuccess: 'Exit successfully',
    /** 优惠活动 */
    promo: 'Special Offer',
    /** 我的注单 */
    myorder: 'My Orders',
    /** 玩法规则 */
    rules: 'Game Rules',
    /** 特别说明 */
    specialNote: 'Special Notes',
    /** 偏好设置 */
    setting: 'Preferences',
    /** 设置 */
    title: 'Setting',
    /** 赔率变化 */
    oddsChange: 'Odd changes',
    /** 接受更佳赔率变化 */
    acceptBetter: 'Accept better odds',
    /** 接受所有变化 */
    acceptAll: 'Accept all changes',
    /** 快捷设置 */
    quickSet: 'Quick Setting',
    /** 默认投注额 */
    defaultAmount: 'Default bet amount',
    /** 请输入默认投注金额 */
    amountHolder: 'Enter the default bet amount',
    /** 玩法展示 */
    marketModel: 'Display of market',
    /** 单玩法展示 */
    singleModel: 'Single play display',
    /** 三玩法展示 */
    threeModel: 'Display of 3 Plays',
    /** 任何修改都需要点击保存按钮，成功之后才能生 */
    tips: 'Any changes need to be clicked on the save button to take effect after success'
  },
  others: {
    /** 玩法规则 */
    ruleTitle: 'Match rules',
    /** 全部产品 */
    flall: 'All products',
    /** 真人百家乐 */
    baccarat: 'Baccarat',
    /** 电子娱乐场 */
    playground: 'Fish Hunter',
    /** 在线老虎机 */
    slot: 'Slot',
    /** 暂无公告 */
    noAnnou: 'No announcement',
    /** 用户登录 */
    signTitle: 'User login',
    /** 账号 */
    account: 'Account',
    /** 密码 */
    password: 'Password',
    /** 登录 */
    signin: 'Log in',
    /** 暂不登录 */
    // later: 'Temporarily not login',
    later: 'Later',
    /** 测试账号 */
    testAccounts: 'Testing account',
    /** 测试密码 */
    testPassword: 'Testing password',
    /** 账号格式错误 */
    invalidAccount: 'Account format error',
    /** 密码格式错误 */
    invalidPassword: 'Password format error',
    /** 账号或密码不匹配 */
    accountNotMatch: 'The account or password does not match',
    /** 登录成 */
    signOK: 'Login successful',
    /** 余额刷新成功 */
    balanceReloaded: 'Reload success!You still have {balance} balance.',
    /** 底部描述内容 */
    footer: 'We offer a wide range of bets across all sports which covers football, tennis, basketball and so on. Betting on a wide range of pre-match and live-match in every premier League and Champions League match, and our fantastic European elite football bonus pool is also available. Experience a series of equally exciting matches including live match. To add to the thrill of the live-match, we\'ve also created a live link that broadcasts more than 100,000 exciting matches every year. Selections include the Masters Series tennis tournament and top national football leagues around the world. ',
    /** 版权信息 */
    copyright: '©2020 J9.com all rights reserved | 18+',
    /** 系统维护公告 */
    '503Title': 'System maintenance announcement',
    '503TitleTemp': 'Temporary Maintenance Notification',
    /** 系统维护内容 */
    '503Content': 'The system is currently under maintenance, during which all functions cannot be used. Apologize for any inconvenience caused. Thank you for your understanding and support.',
    '503ContentTemp': 'The system is under temporary maintenance. During the maintenance period, all functions are unavailable. We apologize for the inconvenience and appreciate your understanding and support.',
    /** 九游体育 */
    j9sport: 'J9 Sport'
  },
  /** 二级页面 */
  preview: {
    /** TODO 投注量占比 */
    chartTitle: '投注量占比',
    /** 投注限额 */
    amountMax: 'Limits',
    /** 输入投注金额 */
    amount: 'Enter bet amount',
    /** 主 */
    '1_1': 'Home',
    /** 和 */
    '1_X': 'Draw',
    /** 客 */
    '1_2': 'Away',
    /** 主 */
    '186_1': 'Home',
    /** 客 */
    '186_2': 'Away',
    /** 主 */
    '16_1': 'Home',
    /** 客 */
    '16_2': 'Away',
    /** 小 */
    '18_Under': 'Under',
    /** 大 */
    '18_Over': 'Over',
  }
}