/**
 * 电竞 分图玩法名构造
 * @param {string} code 玩法类型
 * @param {string} name 对应名称
 */
const makeEsportMapMarkets = (code, name) => ({
  /** 地图1 */
  [`1_51_${code}`]: `地图1${name}`,
  /** 地图2 */
  [`1_52_${code}`]: `地图2${name}`,
  /** 地图3 */
  [`1_53_${code}`]: `地图3${name}`,
  /** 地图4 */
  [`1_54_${code}`]: `地图4${name}`,
  /** 地图5 */
  [`1_55_${code}`]: `地图5${name}`,
  /** 地图6 */
  [`1_56_${code}`]: `地图6${name}`,
  /** 地图7 */
  [`1_57_${code}`]: `地图7${name}`,
})

export default {
  /** 语言选项 */
  locale: {
    'zh': '简体中文',
    'en': 'English',
  },
  betType: {
    1: "单式",
    2: "串关"
  },
  /** 体育类型 */
  sports: {
    /** 我的赛程 */
    '-1': '我的赛程',
    /** 串关 */
    1: '串关',
    /** 滚球 */
    2: '滚球',
    /** 足球 */
    10: '足球',
    /** 篮球 */
    11: '篮球',
    /** 网球' */
    12: '网球', 
    /** 排球 */
    13: '排球',
    /** 乒乓球 */
    14: '乒乓球',
    /** 冰球 */
    15: '冰球',
    /** 棒球 */
    16: '棒球',
    /** 电竞 */
    99: '电竞',
  },
  /**
   * 玩法相关  
   * 规则: sportId.marketGroup_marketStage_marketType  
   * sportId: 10 足球, 11 篮球  
   */
  market: {
    /** 足球 */
    10: {
      /** 胜平负 */
      '1_0_1': '胜平负',
      /** 上半场胜平负 */
      '1_1_1': '上半场胜平负',
      /** 下半场胜平负 */
      '1_2_1': '下半场胜平负',
      /** 双胜彩 */
      '1_0_10': '双胜彩',
      /** 上半场双胜彩 */
      '1_1_10': '上半场双胜彩',
      /** 下半场双胜彩 */
      '1_2_10': '下半场双胜彩',
      /** 让分胜平负 */
      '1_0_14': '让分胜平负',
      /** 上半场让分胜平负 */
      '1_1_14': '上半场让分胜平负',
      /** 下半场让分胜平负 */
      '1_2_14': '下半场让分胜平负',
      /** 让分 */
      '1_0_16': '让分',
      /** 上半场让分 */
      '1_1_16': '上半场让分',
      /** 下半场让分 */
      '1_2_16': '下半场让分',
      /** 大小 */
      '1_0_18': '大小',
      /** 上半场大小 */
      '1_1_18': '上半场大小',
      /** 下半场大小 */
      '1_2_18': '下半场大小',
      /** 精准进球数 */
      '1_0_21': '精准进球数',
      /** 上半场精准进球数 */
      '1_1_21': '上半场精准进球数',
      /** 下半场精准进球数 */
      '1_2_21': '下半场精准进球数',
      /** 平局退款 */
      '1_0_23': '平局退款',
      /** 上半场平局退款 */
      '1_1_23': '上半场平局退款',
      /** 下半场平局退款 */
      '1_2_23': '下半场平局退款',
      /** 总分范围 */
      '1_0_25': '总分范围',
      /** 上半场总分范围 */
      '1_1_25': '上半场总分范围',
      /** 下半场总分范围 */
      '1_2_25': '下半场总分范围',
      /** 单双 */
      '1_0_26': '单双',
      /** 上半场单双 */
      '1_1_26': '上半场单双',
      /** 下半场单双 */
      '1_2_26': '下半场单双',
      /** 净胜球数 */
      '1_0_27': '净胜球数',
      /** 上半场净胜球数 */
      '1_1_27': '上半场净胜球数',
      /** 下半场净胜球数 */
      '1_2_27': '下半场净胜球数',
      /** 两队均得分 */
      '1_0_29': '两队均得分',
      /** 上半场两队均得分 */
      '1_1_29': '上半场两队均得分',
      /** 下半场两队均得分 */
      '1_2_29': '下半场两队均得分',
      /** 得分球队 */
      '1_0_30': '得分球队',
      /** 上半场得分球队 */
      '1_1_30': '上半场得分球队',
      /** 下半场得分球队 */
      '1_2_30': '下半场得分球队',
      /** 主队准确得分 */
      '1_0_31': '主队准确得分',
      /** 上半场主队准确得分 */
      '1_1_31': '上半场主队准确得分',
      /** 下半场主队准确得分 */
      '1_2_31': '下半场主队准确得分',
      /** 客队准确得分 */
      '1_0_32': '客队准确得分',
      /** 上半场客队准确得分 */
      '1_1_32': '上半场客队准确得分',
      /** 下半场客队准确得分 */
      '1_2_32': '下半场客队准确得分',
      /** 主胜且零封 */
      '1_0_33': '主胜且零封',
      /** 客胜且零封 */
      '1_0_34': '客胜且零封',
      /** 胜出且零封 */
      '1_0_35': '胜出且零封',
      /** 双方得分情况 */
      '1_0_36': '双方得分情况',
      /** 零失球 */
      '1_0_37': '零失球',
      /** 首先/最后进球 */
      '1_0_38': '首先/最后进球',
      /** 上半场首先/最后进球 */
      '1_1_38': '上半场首先/最后进球',
      /** 下半场首先/最后进球 */
      '1_2_38': '下半场首先/最后进球',
      /** 主队大小 */
      '1_0_40': '主队大小',
      /** 上半场主队大小 */
      '1_1_40': '上半场主队大小',
      /** 下半场主队大小 */
      '1_2_40': '下半场主队大小',
      /** 客队大小 */
      '1_0_41': '客队大小',
      /** 上半场客队大小 */
      '1_1_41': '上半场客队大小',
      /** 下半场客队大小 */
      '1_2_41': '下半场客队大小',
      /** 正确比分 */
      '1_0_45': '正确比分',
      /** 上半场正确比分 */
      '1_1_45': '上半场正确比分',
      /** 下半场正确比分 */
      '1_2_45': '下半场正确比分',
      /** 半全场 */
      '1_0_47': '半全场',
      /** 主队两个半场均得分 */
      '1_0_48': '主队两个半场均得分',
      /** 客队两个半场均得分 */
      '1_0_49': '客队两个半场均得分',
      /** 主队任意半场获胜 */
      '1_0_50': '主队任意半场获胜',
      /** 客队任意半场获胜 */
      '1_0_51': '客队任意半场获胜',
      /** 最高得分半场 */
      '1_0_52': '最高得分半场',
      /** 主队最高得分半场 */
      '1_0_53': '主队最高得分半场',
      /** 客队最高得分半场 */
      '1_0_54': '客队最高得分半场',
      /** 半场均大于1.5 */
      '1_0_55': '半场均大于1.5',
      /** 半场均小于1.5 */
      '1_0_56': '半场均小于1.5',
      /** 首球半场 */
      '1_0_62': '首球半场',
      /** 首球方式' */
      '1_0_63': '首球方式', 
      /** 下一个进球 */
      '1_0_160': '下一个进球',      
      /** 上半场下一个进球 */
      '1_1_160': '上半场下一个进球',
      /** 下半场下一个进球 */
      '1_2_160': '下半场下一个进球',
      /** 是否加时赛 */
      '1_0_220': '是否加时赛',
      /** 是否点球 */
      '1_0_221': '是否点球',
      /** 是否和局 */
      '1_0_222': '是否和局',
      /** 加时进球 */
      '1_0_223': '加时进球',
      /** 比赛终结方式 */
      '1_0_224': '比赛终结方式',
      /** 赛果/首球 */
      '1_0_230': '赛果/首球',
      /** 均得分/赛果 */
      '1_0_231': '均得分/赛果',
      /** 最后得分球队 */
      '1_0_448': '最后得分球队',
      /** 角球胜平负 */
      '2_0_1': '角球胜平负',
      /** 上半场角球胜平负 */
      '2_1_1': '上半场角球胜平负',
      /** 下半场角球胜平负 */
      '2_2_1': '下半场角球胜平负',
      /** 角球让分 */
      '2_0_16': '角球让分',
      /** 上半场角球让分 */
      '2_1_16': '上半场角球让分',
      /** 下半场角球让分 */
      '2_2_16': '下半场角球让分',
      /** 角球大小 */
      '2_0_18': '角球大小',
      /** 上半场角球大小 */
      '2_1_18': '上半场角球大小',
      /** 下半场角球大小 */
      '2_2_18': '下半场角球大小',
      /** 角球范围 */
      '2_0_25': '角球范围',
      /** 上半场角球范围 */
      '2_1_25': '上半场角球范围',
      /** 角球单双 */
      '2_0_26': '角球单双',
      /** 上半场角球单双 */
      '2_1_26': '上半场角球单双',
      /** 角球最高得分半场 */
      '2_0_52': '角球最高得分半场',
      /** 主队角球数大小 */
      '2_0_57': '主队角球数大小',
      /** 上半场主队角球数大小 */
      '2_1_57': '上半场主队角球数大小',
      /** 客队角球数大小 */
      '2_0_58': '客队角球数大小',
      /** 上半场客队角球数大小 */
      '2_1_58': '上半场客队角球数大小',
      /** 最后一个角球 */
      '2_0_448': '最后一个角球',
      /** 上半场最后一个角球 */
      '2_1_448': '上半场最后一个角球',
      /** 首个角球 */
      '2_0_489': '首个角球',
      /** 上半场首个角球 */
      '2_1_489': '上半场首个角球',
      /** 谁先开球 */
      '5_0_16': '谁先开球',
    },
    /** 篮球 */
    11: {
      /** 让分 */
      '1_0_16': '让分',
      /** 上半场让分 */
      '1_1_16': '上半场让分',
      /** 第1节让分 */
      '1_51_16': '第1节让分',
      /** 第2节让分 */
      '1_52_16': '第2节让分',
      /** 第3节让分 */
      '1_53_16': '第3节让分',
      /** 第4节让分 */
      '1_54_16': '第4节让分',
      /** 大小 */
      '1_0_18': '大小',
      /** 上半场大小 */
      '1_1_18': '上半场大小',
      /** 第1节大小 */
      '1_51_18': '第1节大小',
      /** 第2节大小 */
      '1_52_18': '第2节大小',
      /** 第3节大小 */
      '1_53_18': '第3节大小',
      /** 第4节大小 */
      '1_54_18': '第4节大小',
      /** 单双 */
      '1_0_26': '单双',
      /** 上半场单双 */
      '1_1_26': '上半场单双',
      /** 第1节单双 */
      '1_51_26': '第1节单双',
      /** 第2节单双 */
      '1_52_26': '第2节单双',
      /** 第3节单双 */
      '1_53_26': '第3节单双',
      /** 第4节单双 */
      '1_54_26': '第4节单双',
      /** 主队大小 */
      '1_0_40': '主队大小',
      /** 上半场主队大小 */
      '1_1_40': '上半场主队大小',
      /** 第1节主队大小 */
      '1_51_40': '第1节主队大小',
      /** 第2节主队大小 */
      '1_52_40': '第2节主队大小',
      /** 第3节主队大小 */
      '1_53_40': '第3节主队大小',
      /** 第4节主队大小 */
      '1_54_40': '第4节主队大小',
      /** 客队大小 */
      '1_0_41': '客队大小',
      /** 上半场客队大小 */
      '1_1_41': '上半场客队大小',
      /** 第1节客队大小 */
      '1_51_41': '第1节客队大小',
      /** 第2节客队大小 */
      '1_52_41': '第2节客队大小',
      /** 第3节客队大小 */
      '1_53_41': '第3节客队大小',
      /** 第4节客队大小 */
      '1_54_41': '第4节客队大小',
      /** 半全场 */
      '1_0_47': '半全场',
      /** 胜负 */
      '1_0_186': '胜负',
      /** 上半场胜负 */
      '1_1_186': '上半场胜负',
      /** 第1节胜负 */
      '1_51_186': '第1节胜负',
      /** 第2节胜负 */
      '1_52_186': '第2节胜负',
      /** 第3节胜负 */
      '1_53_186': '第3节胜负',
      /** 第4节胜负 */
      '1_54_186': '第4节胜负',
      /** 是否进入加时赛 */
      '1_0_220': '是否进入加时赛',
      /** 胜分范围 */
      '1_0_290': '胜分范围',
      /** 上半场胜分范围 */
      '1_1_290': '上半场胜分范围',
      /** 第1节胜分范围 */
      '1_51_290': '第1节胜分范围',
      /** 第2节胜分范围 */
      '1_52_290': '第2节胜分范围',
      /** 第3节胜分范围 */
      '1_53_290': '第3节胜分范围',
      /** 第4节胜分范围 */
      '1_54_290': '第4节胜分范围',
      /** 首先获得{y}分 */
      '1_0_606': '首先获得{y}分',
      /** 上半场首先获得{y}分 */
      '1_1_606': '上半场首先获得{y}分',
      /** 首先获得{y}分 */
      '1_0_613': '首先获得{y}分',
      /** 第1节首先获得{y}分 */
      '1_51_613': '第1节首先获得{y}分',
      /** 第2节首先获得{y}分 */
      '1_52_613': '第2节首先获得{y}分',
      /** 第3节首先获得{y}分 */
      '1_53_613': '第3节首先获得{y}分',
      /** 第4节首先获得{y}分 */
      '1_54_613': '第4节首先获得{y}分',
      /** 最后得分球队 */
      '1_0_617': '最后得分球队',
      /** 上半场最后得分球队 */
      '1_1_617': '上半场最后得分球队',
      /** 第1节最后得分球队 */
      '1_51_617': '第1节最后得分球队',
      /** 第2节最后得分球队 */
      '1_52_617': '第2节最后得分球队',
      /** 第3节最后得分球队 */
      '1_53_617': '第3节最后得分球队',
      /** 第4节最后得分球队 */
      '1_54_617': '第4节最后得分球队',
    },
    /** 网球 */
    12: {
      /** 胜负 */
      '1_0_186': '胜负',
      /** 让盘 */
      '1_0_16': '让盘',
      /** 盘数比分 */
      '1_0_1302': '盘数比分',
      /** 让局 */
      '1_0_153': '让局',
      /** 总局数大小 */
      '1_0_18': '总局数大小',
      /** 总局数单双 */
      '1_0_1305': '总局数单双',
    },
    /** 排球 */
    13: {
      /** 让分 */
      '1_0_16': '让分',
      /** 大小 */
      '1_0_18': '大小',
      /** 胜负 */
      '1_0_186': '胜负',
      /** 单双 */
      '1_0_26': '单双',
    },
    /** 乒乓球 */
    14: {
      /** 让分 */
      '1_0_16': '让分',
      /** 胜负 */
      '1_0_186': '胜负',
    },
    /** 冰球 */
    15: {
      /** 让分 */
      '1_0_16': '让分',
      /** 大小 */
      '1_0_18': '大小',
      /** 胜负 */
      '1_0_186': '胜负',
      /** 单双 */
      '1_0_26': '单双',
    },
    /** 棒球 */
    16: {
      /** 让分 */
      '1_0_16': '让分',
      /** 大小 */
      '1_0_18': '大小',
      /** 胜负 */
      '1_0_186': '胜负',
      /** 上半场让分 */
      '1_1_16': '上半场让分',
      /** 上半场大小 */
      '1_1_18': '上半场大小',
      /** 上半场胜负 */
      '1_1_186': '上半场胜负',
    },
    /** 电竞 */
    99: {
      /** 让分 */
      '1_0_16': '让分',
      /** 大小 */
      '1_0_18': '大小',
      /** 胜负 */
      '1_0_186': '胜负',
      // 第x图胜负
      ...makeEsportMapMarkets('9001', '胜负'),
      // 第x图击杀总数让分
      ...makeEsportMapMarkets('9002', '击杀总数让分'),
      // 第x图击杀总数大小
      ...makeEsportMapMarkets('9003', '击杀总数大小'),
      // 第x图击杀总数胜负
      ...makeEsportMapMarkets('9004', '击杀总数胜负'),
      // 第x图击杀总数单双
      ...makeEsportMapMarkets('9005', '击杀总数单双'),
      // 第x图第一滴血
      ...makeEsportMapMarkets('9006', '第一滴血'),
      // 待确认 第x图首先达到{y}杀
      ...makeEsportMapMarkets('9007', '首先达到{y}杀'),
      // 第x图摧毁防御塔让分
      ...makeEsportMapMarkets('9008', '摧毁防御塔让分'),
      // 第x图摧毁防御塔大小
      ...makeEsportMapMarkets('9009', '摧毁防御塔大小'),
      // 第x图摧毁防御塔胜负
      ...makeEsportMapMarkets('9010', '摧毁防御塔胜负'),
      // 待确认 第x图第一防御塔-第{y}层
      ...makeEsportMapMarkets('9011', '第一防御塔-第{y}层'),
      // 第x图击杀肉山让分
      ...makeEsportMapMarkets('9012', '击杀肉山让分'),
      // 第x图击杀肉山大小
      ...makeEsportMapMarkets('9013', '击杀肉山大小'),
      // 第x图击杀肉山胜负
      ...makeEsportMapMarkets('9014', '击杀肉山胜负'),
      // 第x图击杀首个肉山
      ...makeEsportMapMarkets('9015', '击杀首个肉山'),
      // 第x图击杀第二个肉山
      ...makeEsportMapMarkets('9016', '击杀第二个肉山'),
      // 第x图击杀第三个肉山
      ...makeEsportMapMarkets('9017', '击杀第三个肉山'),
      // 第x图摧毁兵营总数让分
      ...makeEsportMapMarkets('9018', '摧毁兵营总数让分'),
      // 第x图摧毁兵营总数大小
      ...makeEsportMapMarkets('9019', '摧毁兵营总数大小'),
      // 第x图摧毁兵营总数胜负
      ...makeEsportMapMarkets('9020', '摧毁兵营总数胜负'),
      // 第x图摧毁首座兵营
      ...makeEsportMapMarkets('9021', '摧毁首座兵营'),
      // 第x图摧毁第二座兵营
      ...makeEsportMapMarkets('9022', '摧毁第二座兵营'),
      // 第x图摧毁第三座兵营
      ...makeEsportMapMarkets('9023', '摧毁第三座兵营'),
      // 第x图摧毁炮塔总数让分
      ...makeEsportMapMarkets('9024', '摧毁炮塔总数让分'),
      // 第x图摧毁炮塔总数大小
      ...makeEsportMapMarkets('9025', '摧毁炮塔总数大小'),
      // 第x图摧毁炮塔总数胜负
      ...makeEsportMapMarkets('9026', '摧毁炮塔总数胜负'),
      // 待确认 第x图首先摧毁{y}座炮塔
      ...makeEsportMapMarkets('9027', '首先摧毁{y}座炮塔'),
      // 第x图击杀巨龙总数让分
      ...makeEsportMapMarkets('9028', '击杀巨龙总数让分'),
      // 第x图击杀巨龙总数大小
      ...makeEsportMapMarkets('9029', '击杀巨龙总数大小'),
      // 第x图击杀巨龙总数胜负
      ...makeEsportMapMarkets('9030', '击杀巨龙总数胜负'),
      // 第x图击杀第一只巨龙
      ...makeEsportMapMarkets('9031', '击杀第一只巨龙'),
      // 第x图击杀第二只巨龙
      ...makeEsportMapMarkets('9032', '击杀第二只巨龙'),
      // 第x图击杀第三只巨龙
      ...makeEsportMapMarkets('9033', '击杀第三只巨龙'),
      // 第x图击杀男爵总数让分
      ...makeEsportMapMarkets('9034', '击杀男爵总数让分'),
      // 第x图击杀男爵总数大小
      ...makeEsportMapMarkets('9035', '击杀男爵总数大小'),
      // 第x图击杀男爵总数胜负
      ...makeEsportMapMarkets('9036', '击杀男爵总数让分'),
      // 第x图击杀首个男爵
      ...makeEsportMapMarkets('9037', '击杀首个男爵'),
      // 第x图击杀第二个男爵
      ...makeEsportMapMarkets('9038', '击杀第二个男爵'),
      // 第x图击杀第三个男爵
      ...makeEsportMapMarkets('9039', '击杀第三个男爵'),
      // 第x图摧毁水晶总数让分
      ...makeEsportMapMarkets('9040', '摧毁水晶总数让分'),
      // 第x图摧毁水晶总数大小
      ...makeEsportMapMarkets('9041', '摧毁水晶总数大小'),
      // 第x图摧毁水晶总数胜负
      ...makeEsportMapMarkets('9042', '摧毁水晶总数胜负'),
      // 第x图摧毁首个水晶
      ...makeEsportMapMarkets('9043', '摧毁首个水晶'),
      // 第x图摧毁第二个水晶
      ...makeEsportMapMarkets('9044', '摧毁第二个水晶'),
      // 第x图摧毁第三个水晶
      ...makeEsportMapMarkets('9045', '摧毁第三个水晶'),
      // 第x图击杀暴君总数让分
      ...makeEsportMapMarkets('9046', '击杀暴君总数让分'),
      // 第x图击杀暴君总数大小
      ...makeEsportMapMarkets('9047', '击杀暴君总数大小'),
      // 第x图击杀暴君总数胜负
      ...makeEsportMapMarkets('9048', '击杀暴君总数胜负'),
      // 第x图击杀第一个暴君
      ...makeEsportMapMarkets('9049', '击杀第一个暴君'),
      // 第x图击杀第二个暴君
      ...makeEsportMapMarkets('9050', '击杀第二个暴君'),
      // 第x图击杀第三个暴君
      ...makeEsportMapMarkets('9051', '击杀第三个暴君'),
      // 第x图击杀主宰总数让分
      ...makeEsportMapMarkets('9052', '击杀主宰总数让分'),
      // 第x图击杀主宰总数大小
      ...makeEsportMapMarkets('9053', '击杀主宰总数大小'),
      // 第x图击杀主宰总数胜负
      ...makeEsportMapMarkets('9054', '击杀主宰总数胜负'),
      // 第x图击杀首个主宰 
      ...makeEsportMapMarkets('9055', '击杀首个主宰 '),
      // 第x图击杀第二个主宰
      ...makeEsportMapMarkets('9056', '击杀第二个主宰'),
      // 第x图击杀第三个主宰
      ...makeEsportMapMarkets('9057', '击杀第三个主宰'),
      // 第x图比赛时间大小
      ...makeEsportMapMarkets('9058', '比赛时间大小'),
      // 第x图回合获胜让分
      ...makeEsportMapMarkets('9059', '回合获胜让分'),
      // 第x图回合获胜大小
      ...makeEsportMapMarkets('9060', '回合获胜大小'),
      // 第x图回合获胜单双
      ...makeEsportMapMarkets('9061', '回合获胜单双'),
      // 第x图首先赢得{y}回合
      ...makeEsportMapMarkets('9062', '首先赢得{y}回合'),
      // 第x图赢得上半场
      ...makeEsportMapMarkets('9063', '赢得上半场'),
      // 第x图赢得下半场
      ...makeEsportMapMarkets('9064', '赢得下半场'),
      // 第x图最多第一杀
      ...makeEsportMapMarkets('9065', '最多第一杀'),
      // 第x图最后存活玩家
      ...makeEsportMapMarkets('9066', '最后存活玩家'),
      // 第x图第16回合
      ...makeEsportMapMarkets('9067', '第16回合'),
      // TODO 待确认 第x图第X回合胜负
      ...makeEsportMapMarkets('9068', '第{y}回合胜负'),
      // 第x图第{y}回合击杀总数胜负
      ...makeEsportMapMarkets('9069', '第{y}回合击杀总数胜负'),
      // 第x图第{y}回合击杀总数大小
      ...makeEsportMapMarkets('9070', '第{y}回合击杀总数大小'),
      // 第x图第{y}回合击杀总数单双
      ...makeEsportMapMarkets('9071', '第{y}回合击杀总数单双'),
      // 待确认 第x图第{y}回合首杀
      ...makeEsportMapMarkets('9072', '第{y}回合首杀'),
      // 第x图第{y}回合炸弹安放
      ...makeEsportMapMarkets('9073', '第{y}回合炸弹安放'),
      // 第x图出现加时赛
      ...makeEsportMapMarkets('9074', '出现加时赛'),
      // 第x图最后回合炸弹安放
      ...makeEsportMapMarkets('9075', '最后回合炸弹安放'),
      // 第x图最后存活玩家让分
      ...makeEsportMapMarkets('9076', '最后存活玩家让分'),
      // 第x图第{y}回合击杀总数让分
      ...makeEsportMapMarkets('9077', '第{y}回合击杀总数让分'),
      // 第x图摧毁防御塔总数单双
      ...makeEsportMapMarkets('9078', '摧毁防御塔总数单双'),
      // 第x图击杀肉山总数单双
      ...makeEsportMapMarkets('9079', '击杀肉山总数单双'),
      // 第x图摧毁兵营总数单双
      ...makeEsportMapMarkets('9080', '摧毁兵营总数单双'),
      // 第x图摧毁炮塔总数单双
      ...makeEsportMapMarkets('9081', '摧毁炮塔总数单双'),
      // 第x图击杀巨龙总数单双
      ...makeEsportMapMarkets('9082', '击杀巨龙总数单双'),
      // 第x图击杀男爵总数单双
      ...makeEsportMapMarkets('9083', '击杀男爵总数单双'),
      // 第x图摧毁水晶总数单双
      ...makeEsportMapMarkets('9084', '摧毁水晶总数单双'),
      // 第x图击杀暴君总数单双
      ...makeEsportMapMarkets('9085', '击杀暴君总数单双'),
      // 第x图击杀男爵总数单双
      ...makeEsportMapMarkets('9086', '击杀男爵总数单双'),
      // 第x图出现加时赛
      ...makeEsportMapMarkets('9087', '出现加时赛'),
      // 第x图精准得分
      ...makeEsportMapMarkets('9088', '精准得分'),
    },
  },
  /**
   * 投注项相关
   */
  option: {
    /** 是 */
    Yes: '是',
    /** 否 */
    No: '否',
    /** 和 */
    Equals: '和',
    /** 主 */
    1: '主',
    /** 和 */
    X: '和',
    /** 和 */
    x: '和',
    /** 客 */
    2: '客',
    /** 主和 */
    '1X': '主和',
    /** 主客 */
    12: '主客',
    /** 和客 */
    X2: '和客',
    /** 大 */
    Over: '大',
    /** 小 */
    Under: '小',
    /** 主 */
    Home: '主',
    /** 客 */
    Away: '客',
    /** 单 */
    Odd: '单',
    /** 双 */
    Even: '双',
    /** 其他 */
    Other: '其他',
    /** 其他 */
    AOS: '其他',
    /** 和局 */
    XX: '和局',
    /** 主是 */
    HY: '主是',
    /** 主否 */
    HN: '主否',
    /** 客是 */
    AY: '客是',
    /** 客否 */
    AN: '客否',
    /** 无 */
    None: '无',
    /** 上半场 */
    maxscore_1: '上半场',
    /** 下半场 */
    maxscore_2: '下半场',
    /** 平局 */
    maxscore_Equals: '平局',
    /** {team}胜 */
    winner: '{team}胜',
    /** 主或和 */
    '10_1X': '主或和',
    /** 主或客 */
    '10_12': '主或客',
    /** 和或客 */
    '10_X2': '和或客',
    /** 主 */
    '16_1': '主',
    /** 客 */
    '16_2': '客',
    /** 主 */
    '27_H': '主',
    /** 客 */
    '27_A': '客',
    /** 无进球 */
    '27_NG': '无进球',
    /** 平局 */
    '27_Draw': '平局',
    /** 无进球 */
    '30_None': '无进球',
    /** 双方球队 */
    '30_Both': '双方球队',
    /** 仅主队 */
    '30_1': '仅主队',
    /** 仅客队 */
    '30_2': '仅客队',
    /** 一方 */
    '36_O': '一方',
    /** 均不 */
    '36_N': '均不',
    /** 双方 */
    '36_B': '双方',
    /** 主先 */
    '38_1:1': '主先',
    /** 主后 */
    '38_1:2': '主后',
    /** 客先 */
    '38_2:1': '客先',
    /** 客后 */
    '38_2:2': '客后',
    /** 无进球 */
    '38_0:0': '无进球',
    /** 主/主 */
    '47_1/1': '主/主',
    /** 主/和 */
    '47_1/X': '主/和',
    /** 主/客 */
    '47_1/2': '主/客',
    /** 和/主 */
    '47_X/1': '和/主',
    /** 和/和 */
    '47_X/X': '和/和',
    /** 和/客 */
    '47_X/2': '和/客',
    /** 客/主 */
    '47_2/1': '客/主',
    /** 客/和 */
    '47_2/X': '客/和',
    /** 客/客 */
    '47_2/2': '客/客',
    /** 上半场 */
    '62_1': '上半场',
    /** 下半场 */
    '62_2': '下半场',
    /** 无进球 */
    '62_None': '无进球',
    /** 射门 */
    '63_S': '射门',
    /** 头球 */
    '63_H': '头球',
    /** 点球 */
    '63_P': '点球',
    /** 任意球 */
    '63_FK': '任意球',
    /** 乌龙球 */
    '63_OG': '乌龙球',
    /** 无进球 */
    '63_NG': '无进球',
    /** 主/常规 */
    '224_HR': '主/常规',
    /** 主/加时 */
    '224_HE': '主/加时',
    /** 主/点球 */
    '224_HP': '主/点球',
    /** 客/常规 */
    '224_AR': '客/常规',
    /** 客/加时 */
    '224_AE': '客/加时',
    /** 客/点球 */
    '224_AP': '客/点球',
    /** 主/主 */
    '230_HH': '主/主',
    /** 和/主 */
    '230_DH': '和/主',
    /** 主/客 */
    '230_HA': '主/客',
    /** 客/主 */
    '230_AH': '客/主',
    /** 和/客 */
    '230_DA': '和/客',
    /** 客/客 */
    '230_AA': '客/客',
    /** 无 */
    '230_NO': '无',
    /** 是/主胜 */
    '231_YH': '是/主胜',
    /** 是/客胜 */
    '231_YA': '是/客胜',
    /** 是/和局 */
    '231_YD': '是/和局',
    /** 否/主胜 */
    '231_NH': '否/主胜',
    /** 否/客胜 */
    '231_NA': '否/客胜',
    /** 否/和局 */
    '231_ND': '否/和局',
    /** 主 {value}分 */
    '290_Home': '主 {value}分',
    /** 客 {value}分 */
    '290_Away': '客 {value}分',
    /** 平局 */
    '290_Draw': '平局',
  },
  /** 比赛阶段 */
  periods: {
    /**   */
    10: ' ',
    /** 节 */
    11: '节',
    /** 盘 */
    12: '盘',
    /** 等待加时 */
    16: ' ',
    /** Map */
    99: '图',
  },
  /** 滚球对应阶段 */
  period: {
    /** 未开赛 */
    0: '即将开赛',
    /** 第1{type} */
    1: '第1{type}',
    /** 第2{type} */
    2: '第2{type}',
    /** 第3{type} */
    3: '第3{type}',
    /** 第4{type} */
    4: '第4{type}',
    /** 第5{type} */
    5: '第5{type}',
    /** 第6{type} */
    6: '第6{type}',
    /** 第7{type} */
    7: '第7{type}',
    /** 第8{type} */
    8: '第8{type}',
    /** 第9{type} */
    9: '第9{type}',
    /** 上半场 */
    10: '上半场',
    /** 下半场 */
    11: '下半场',
    /** 已开始 */
    13: '已开始',
    /** 暂停 */
    14: '暂停',
    /** 半场 */
    15: '半场',
    /** 等待加时 */
    16: '等待加时',
    /** 加时中 */
    17: '加时中',
    /** 加时上半场 */
    18: '加时上半场',
    /** 加时赛中场 */
    19: '加时赛中场',
    /** 加时下半场 */
    20: '加时下半场',
    /** 加时赛后 */
    21: '加时赛后',
    /** 等待点球 */
    22: '等待点球',
    /** 点球中 */
    23: '点球中',
    /** 点球后 */
    24: '点球后',
    /** 中断 */
    25: '中断',
    /** 停赛 */
    26: '停赛',
    /** 弃赛 */
    27: '弃赛',
    /** 弃权 */
    28: '弃权',
    /** 取消 */
    29: '取消',
    /** 金局后 */
    30: '金局后',
    /** 第1{type}完场后 */
    31: '第1{type}完场后',
    /** 第2{type}完场后 */
    32: '第2{type}完场后',
    /** 第3{type}完场后 */
    33: '第3{type}完场后',
    /** 第4{type}完场后 */
    34: '第4{type}完场后',
    /** 第5{type}完场后 */
    35: '第5{type}完场后',
    /** 第6{type}完场后 */
    36: '第6{type}完场后',
    /** 第7{type}完场后 */
    37: '第7{type}完场后',
    /** 第8{type}完场后 */
    38: '第8{type}完场后',
    /** 延期 */
    40: '延期',
    /** 推迟开赛 */
    41: '推迟开赛',
    /** 完场 */
    100: '完场',
    /** 进行中 */
    999: '进行中...',
  },
  /** 玩法分类 */
  categories: {
    /** 全部 */
    '-1': '全部',
    /** 主要玩法 */
    1: '主要玩法',
    /** 亚洲玩法 */
    2: '亚洲玩法',
    /** 半场玩法 */
    3: '半场玩法',
    /** 附加玩法 */
    4: '附加玩法',
    /** 角球玩法 */
    5: '角球玩法',
    /** 罚牌玩法 */
    6: '罚牌玩法',
    /** 单节玩法 */
    7: '单节玩法',
  },
  /** 比赛过滤 */
  filter: {
    /** 精选 */
    'state_1301': '精选',
    /** 滚球 */
    'state_1': '滚球',
    /** 今日 */
    'state_-1': '今日',
    /** 早盘 */
    'state_0': '早盘',
    /** 串关 */
    'state_99': '串关',
    /** 赛果 */
    'state_1302': '赛果',
    /** 直播 */
    'state_1303': '直播',
    /** 时间筛选 */
    date: '时间筛选',
    /** 体育筛选 */
    sports: '体育筛选',
    /** 类型筛选 */
    state: '类型筛选',
    /** 联赛筛选 */
    tours: '联赛筛选',
    /** 日期格式 */
    date_format1: 'MM月DD日',
    /** 现在 */
    now: '现在',
    /** 取消 */
    cancel: '取消',
    /** 确定 */
    ok: '确定',
    /** 多选 */
    multiple: '多选',
    /** 收起 */
    collapse_true: '收起',
    /** 更多 */
    collapse_false: '更多',
  },
  /** 详情或赛果的比分标题 */
  scores: {
    /** 上半场 */
    h1: '上半场',
    /** 角球 */
    corner: '角球',
    /** 黄牌 */
    yellowCard: '黄牌',
    /** 红牌 */
    redCard: '红牌',
    /** 上半场角球 */
    h1corner: '上半场角球',
    /** 上半场比分 */
    h1score: '上半场比分',
    /** 全场角球 */
    h0corner: '全场角球',
    /** 全场比分 */
    h0score: '全场比分',
  },
  /** 比赛相关 */
  match: {
    /** 体育类型 */
    sport_type: '体育类型',
    /** 滚球(球类首页部分滚球列表) */
    live: '滚球',
    /** 精选(球类首页精选列表) */
    select: '精选',
    /** 动画直播(比赛详情切换按钮) */
    media_lmt: '动画直播',
    /** 视频直播(比赛详情切换按钮) */
    media_video: '视频直播',
    /** 共{count}场比赛 */
    total_matchs: '共{count}场比赛',
    /** 赛事 (列表标题) */
    list_title_tour: '赛事',
    /** 赛事 (列表标题) */
    list_title_versus: '对阵',
    /** 未找到相关比赛 (详情) */
    match_not_found: '未找到相关比赛',
    /** 已结束 (详情拉比赛提示) */
    finished: '已结束',
    /** 请点击返回 */
    backtip: '请点击返回',
    /** 或查看下一场推荐比赛 */
    nexttip: '或查看下一场推荐比赛',
    /** 返回按钮 */
    back: '返  回',
    /** 下一场 */
    next: '下一场',
    /** 查看比赛 */
    to_detail: '查看比赛',
    /** 第n局 */
    sets_index: '第{index}局',
    /** 第n盘 */
    games_index: '第{index}盘',
    /** 得分 */
    scores: '得分',
    /** 总盘数 */
    sets: '总盘数',
    /** 总局数 */
    games: '总局数',
    /** 添加到收藏 */
    add_favorite: '添加到收藏',
    /** 已添加到收藏 */
    favorited: '已添加到收藏',
    /** 详情注单数量 */
    order_count: '注单({count})',
    /** 暂无玩法 */
    nomarket: '暂无玩法',
    /** 我的收藏 */
    my_favs: '我的收藏',
    /** 推荐比赛 */
    recommend: '推荐比赛',
    /** 首页重要赛事 */
    home_tours: '重要赛事',
    /** 焦点赛事 */
    focus: '焦点赛事',
    /** 现场滚球 */
    inplays: '现场滚球',
    /** 更多 */
    more: '更多',
    /** 顶级联赛 */
    topTours: '顶级联赛',
    /** 近12小时 */
    top12: '近12小时',
    /** 场 */
    chang: '场',
    /** 附加盘口 */
    more_markets: '附加盘口',
    /** 直播中... */
    living: '直播中...',
    /** 等待中... */
    waiting: '等待中...',
    /** 全场 */
    h0: '全场',
    /** 比分 */
    result_scores: '比分',
    /** 按时间排序 */
    time_sort: '按时间排序',
    /** 按联赛排序 */
    tour_sort: '按联赛排序',
    /** 正在直播 */
    live_block_title: '正在直播',
    /** 进球啦! */
    goal_notify: '进球啦!',
    /** {count}场赛事 (搜索框联赛对应的赛事数量) */
    serch_countoftour: '{count}场赛事',
    /** 已有新的滚球比赛, 点击立即更新 */
    inplay_updated: '已有新的滚球比赛, 点击立即更新',
  },
  /** 注单 */
  ticket: {
    /** 日期 */
    date: '日期',
    /** 投注 (注单页面-左侧投注额统计标题) */
    amount: '投注',
    /** 盈利 (注单页面-左侧盈利统计标题) */
    profit: '盈利',
    /** 受注中 */
    'status_-1': '受注中',
    /** 投注成功 */
    'status_1': '投注成功',
    /** 已结算 */
    'status_3': '已结算',
    /** 操盘手取消 */
    'status_4': '操盘手取消',
    /** 暂无订单 */
    norecords: '暂无订单',
    /** 注单号码 */
    billno: '注单号码',
    /** 体育类型 */
    sport_type: '体育类型',
    /** 联赛/对阵/投注 */
    match_info: '联赛/对阵/投注',
    /** 投注金额 */
    bet_amount: '投注金额',
    /** 总返还额 */
    total_return: '总返还额',
    /** 中奖 */
    record_profit: '中奖',
    /** 下注时间 */
    bet_time: '下注时间',
    /** 状态 */
    status: '状态',
    /** 盈 */
    win: '盈',
    /** 亏 */
    lose: '亏',
    /** 平 */
    draw: '平',
  },
  /** 偏好设置 */
  settings: {
    /** 偏好设置 */
    title: '偏好设置',
    /** 赔率变化 */
    odds_change: '赔率变化',
    /** 快捷金额设置 */
    amount_label: '快捷金额设置',
    /** 金额 */
    amount: '金额',
    /** 请输入金额 */
    amount_holder: '请输入金额',
    /** 语言选择 */
    locale: '语言选择',
    /** 主题选择 */
    theme: '主题切换',
    /** 炫晶白 */
    light: '炫晶白',
    /** 尊贵黑 */
    dark: '尊贵黑',
    /** 任何修改都需要点击保存按钮，成功之后才能生效 */
    savetip: '任何修改都需要点击保存按钮，成功之后才能生效',
    /** 其他设置 */
    others: '其他设置',
    /** 开启进球提示音 */
    goal_sound: '开启进球提示音',
  },
  /** 投注 */
  bet: {
    /** 当前选项不可投 */
    unavailable: '当前选项不可投',
    /** 投注受理中 */
    betting: '投注受理中...',
    /** 当前限额{min} ~ {max}元 */
    amount_limit: '当前限额{min} ~ {max}元',
    /** 自动接受所有赔率变化 */
    accept_all: '自动接受所有赔率变化',
    /** 自动接受更高赔率变化 */
    accept_better: '自动接受更高赔率变化',
    /** 请输入投注金额 */
    amount_required: '请输入投注金额',
    /** {var}串1 */
    combo_var: '{var}串1',
    /** 二串一 */
    double: '2串1',
    /** 三串一 */
    treble: '3串1',
    /** {amount}元 */
    amount: '{amount}元',
    /** 限额: */
    limit: '限额: ',
    /** 总赔率:  */
    total_odds: '总赔率: ',
    /** 预计返还:  */
    will_return: '预计返还: ',
    /** 投注额: */
    bet_label: '投注额: ',
    /** 至少{count}串1 */
    combo_required: '至少{count}串1 ',
    /** 至少2串1 */
    double_required: '至少2串1',
    /** 至少3串1 */
    treble_required: '至少3串1',
    /** 投注 (提交按钮) */
    submit_bet: '投注',
    /** 加入串关 */
    add_to_combo: '加入串关',
    /** 投注单 */
    tab1_cart: '投注单',
    /** 投注单 */
    tab1_ticket: '未结算注单',
    /** 余额不足 */
    over_amount: '余额不足,请充值',
    /** 投注推送错误信息 */
    error_msg: {
      /** 成功 */
      200: '成功',
      /** 参数错误 */
      400: '参数错误',
      /** 用户未验证 */
      403: '用户未验证',
      /** 数据不存在 */
      404: '数据不存在',
      /** ID未验证 */
      405: 'ID未验证',
      /** ID未验证 */
      406: 'ID未验证',
      /** 比赛已结束 */
      415: '比赛已结束',
      /** 盘口已关闭 */
      416: '盘口已关闭',
      /** 系统错误 */
      500: '系统错误',
      /** 系统错误 */
      510: '系统错误',
      /** 比赛不支持串关 */
      511: '比赛不支持串关',
      /** 该投注项无赔率 */
      513: '该投注项无赔率',
      /** 串关不能串同一场比赛 */
      514: '串关不能串同一场比赛'
    }
  },
  /** 搜索 */
  search: {
    /** 未查到任何数据 */
    notfound: '未查到任何数据',
    /** 大爷您别急，小的正在使劲的查找 */
    searching: '大爷您别急，小的正在使劲的查找',
    /** 联赛结果 */
    tours: '联赛结果',
    /** 比赛结果 */
    matchs: '比赛结果',
    /** 开赛时间 */
    time: '开赛时间: {time}',
    /** 进行中 */
    playing: '进行中',
    /** 输入联赛或者球队关键字 */
    placeholder: '输入联赛或者球队关键字',
  },
  /** 通用 */
  common: {
    /** 全部 */
    all: '全部',
    /** 保存 */
    save: '保存',
    /** 关闭 */
    close: '关闭',
    /** 搜索 */
    search: '搜索',
    /** 分 */
    minute: '分',
    /** 共{total}条(分页栏显示记录数) */
    records: '共{total}条',
    /** 九游体育(公告署名) */
    org: '九游体育',
    /** 需要登录 */
    sign_first: '您还未登录,请先登录',
    /** 复制成功 */
    copy_success: '复制成功',
    /** 复制失败 */
    copy_fail: '复制失败',
    /** 暂无数据 */
    norecords: '暂无数据',
    /** © 2020 J9SPORT 版权所有 | 18+ */
    copyright: '© 2020 J9SPORT 版权所有 | 18+',
    /** 网络请求错误,请稍后再试! */
    network_error: '网络请求错误,请稍后再试!',
    /** 时间 */
    time: '时间',
    /** 查看详情 */
    details: '查看详情'
  },
  /** 优惠 */
  promotion: {
    /** 活动内容 */
    promo_content: '活动内容',
    /** 优惠详情 */
    promo_detail: '优惠详情',
    /** 赛程 */
    matchs: '赛程'
  },
  /** 普通页面 */
  pages: {
    /** 顶部菜单 */
    menus: {
      /** 首页 */
      home: '首页',
      /** 滚球 */
      inplay: '滚球',
      /** 赛果 */
      results: '赛果',
      /** 直播 */
      live: '直播',
      /** 优惠 */
      promotions: '优惠',
    },
    /** 立即登录 */
    signin: '立即登录',
    /** 免费注册 */
    signup: '免费注册',
    /** 存款 */
    deposit: '存款',
    /** 退出 */
    quit: '退出',
    /** 退出成功 */
    quit_sucecss: '退出成功!',
    /** 玩法规则 */
    rules: '玩法规则',
    /** 特别说明 */
    special_rules: '特别说明',
    /** 我的注单 */
    my_orders: '我的注单',
    /** 公告列表 */
    annou_list: '公告列表',
    /** 公告详情 */
    annou_detail: '公告详情',
    /** 公告标题 */
    annou_title: '公告标题',
    /** 公告时间 */
    annou_time: '公告时间',
    /** 更多... */
    annou_more: '更多...',
    /** 暂无公告内容 */
    annou_none: '暂无公告内容',
    /** 近期开赛 */
    soon_list: '近期开赛',
    /** 最新优惠 */
    promo_title: '最新优惠',
    /** 优惠提示 */
    promo_tip: '请时刻关注本栏目,我们将不定期推出各种优惠活动返利给用户',
    /** 本活动长期有效 */
    promo_forever: '本活动长期有效',
    /** 活动倒计时 */
    promo_countdown: '结束时间：{days}天{hours}时{minutes}分{seconds}秒',
    /** 收藏切换提示 */
    faving: '正在处理,请稍后...',
    /** 添加收藏成功 */
    fav_success: '添加收藏成功',
    /** 取消收藏成功 */
    cancel_success: '取消收藏成功',
    /** 特别说明页面 */
    special_note: {
      /** 老哥俱乐部 */
      bbc: '"老哥俱乐部"',
      /** 内容1 */
      content_1: '根据直播版权相关规定以及网络因素，本站视频直播相较盘口赔率数据有一定的延迟，请用户在使用时根据具体情况酌情下注。',
      /** 内容2 */
      content_2: '比赛详情会因为投注数据的收盘而提前关闭，导致用户无法看完整场比赛，项目组正在努力解决此问题。',
      /** 内容3 */
      content_3: '由于赔率数据原因，用户在滚球投注是可能存在一定的受注延时，投注串关可能也会因为操盘手拒绝而导致退单，九游体育正在努力优化相关功能。',
      /** 内容4 */
      content_4: '本产品提供的“赛果”、“直播”功能中产生的赛果或其他因素仅供参考，实际结算以赌盘数据为准',
      /** 内容5 */
      content_5: '因为赛果确认因素，注单结算有时会有一定延时，九游体育正在努力获取更多可靠数据来源优化流程，尽力提高结算速度。',
      /** 内容6 */
      content_6: '九游体育力争打造多平台最佳投注体验，APP将会后续推出。',
      /** 内容7 */
      content_7: '更多功能和建议，请用户移步到{anchor}，在九游体育吐槽专帖下面回复，项目组将认真听取大家的意见，并送出高达500USDT奖金感谢您的睿智提议！',
    },
    /** 错误页面 */
    '403': {
      /** 地域限制(标题) */
      'title': '地域限制',
      /** 地域限制内容(英文) */
      'content_en': 'Sorry, you are not able to open this website because your are currently visiting from a location where has restriction(s) on the content of the website',
      /** 地域限制内容(中文) */
      'content_zh': '抱歉，您当前所在地区无法访问本站',
    },
    '404': {
      /** 找不到页面(标题) */
      'title': '找不到页面',
      /** 找不到页面(英文) */
      'content_en': 'The page you were looking for doesn\'t exist. You may have mistyped the address or the page may have been  removed.',
      /** 找不到页面(中文) */
      'content_zh': '抱歉！ 页面他不小心迷路了……',
      /** 返回主页 */
      back: '返回主页'
    },
    '503': {
      /** 系统维护(标题) */
      'title': '系统维护',
      /** 尊敬的用户: */
      'customer': '尊敬的用户:',
      /** 内容 */
      'content': '为了给您提供更好的服务，系统正在进行升级维护，维护期间将暂停服务使用，给您带来不便我们深表歉意！',
      /** 维护时间 */
      'time': '维护期间: {start} 至 {end}',
      /** 客服描述 */
      'qa': '如您有任何疑问请联系客服.'
    }
  },
};