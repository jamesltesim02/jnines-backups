/**
 * 电竞 分图玩法名构造
 * @param {string} code 玩法类型
 * @param {string} name 对应名称
 */
const makeEsportMapMarkets = (code, name) => ({
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
  /** 地图6 */
  [`1_56_${code}`]: `Map 6,${name}`,
  /** 地图7 */
  [`1_57_${code}`]: `Map 7,${name}`,
})

/* eslint-disable import/no-anonymous-default-export */
export default {
  /** 语言选项 */
  locale: {
    'zh': '简体中文',
    'en': 'English',
  },
  /** 体育类型 */
  sports: {
    /** 我的赛程 */
    '-1': 'My Games',
    /** 滚球 */
    2: 'In-Play',
    /** 串关 */
    1: 'Multiples',
    /** 足球 */
    10: 'Soccer',
    /** 篮球 */
    11: 'Basketball',
    /** 网球' */
    12: 'Tennis', 
    /** 排球 */
    13: 'Volleyball',
    /** 乒乓球 */
    14: 'PingPong',
    /** 冰球 */
    15: 'Ice Hockey',
    /** 棒球 */
    16: 'Baseball',
    /** 电竞 */
    99: 'Esports',
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
      '1_0_16': 'Asian Handicap',
      /** 上半场让分 */
      '1_1_16': '1H, Asian Handicap',
      /** 下半场让分 */
      '1_2_16': '2H, Asian Handicap',
      /** 大小 */
      '1_0_18': 'Goal Line',
      /** 上半场大小 */
      '1_1_18': '1H, Goal Line',
      /** 下半场大小 */
      '1_2_18': '2H, Goal Line',
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
      '1_0_25': 'Goals Range',
      /** 上半场总分范围 */
      '1_1_25': '1H Goals Range',
      /** 下半场总分范围 */
      '1_2_25': '2H Goals Range',
      /** 单双 */
      '1_0_26': 'Odd/Even',
      /** 上半场单双 */
      '1_1_26': '1H,Odd/Even',
      /** 下半场单双 */
      '1_2_26': '2H,Odd/Even',
      /** 净胜球数 */
      '1_0_27': 'Goal Difference',
      /** 上半场净胜球数 */
      '1_1_27': '1H Goal Difference',
      /** 下半场净胜球数 */
      '1_2_27': '2H Goal Difference',
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
      '1_0_31': 'Home Exact Goals',
      /** 上半场主队准确得分 */
      '1_1_31': '1H,Home Exact Goals',
      /** 下半场主队准确得分 */
      '1_2_31': '2H,Home Exact Goals',
      /** 客队准确得分 */
      '1_0_32': 'Away Exact Goals',
      /** 上半场客队准确得分 */
      '1_1_32': '1H,Away Exact Goals',
      /** 下半场客队准确得分 */
      '1_2_32': '2H,Away Exact Goals',
      /** 主胜且零封 */
      '1_0_33': 'Home wins to nil',
      /** 客胜且零封 */
      '1_0_34': 'Away wins to nil',
      /** 胜出且零封 */
      '1_0_35': 'Win to nil',
      /** 双方得分情况 */
      '1_0_36': 'Team to Score',
      /** 零失球 */
      '1_0_37': 'Clean Sheet',
      /** 首先/最后进球 */
      '1_0_38': 'First/Last to Score',
      /** 上半场首先/最后进球 */
      '1_1_38': 'IH,First/Last to Score',
      /** 下半场首先/最后进球 */
      '1_2_38': '2H,First/Last to Score', 
      /** 主队大小 */
      '1_0_40': 'Home Goals',
      /** 上半场主队大小 */
      '1_1_40': '1H,Home Goals',
      /** 下半场主队大小 */
      '1_2_40': '2H,Home Goals',
      /** 客队大小 */
      '1_0_41': 'Away Goals',
      /** 上半场客队大小 */
      '1_1_41': '1H,Away Goals',
      /** 下半场客队大小 */
      '1_2_41': '2H,Away Goals',
      /** 正确比分 */
      '1_0_45': 'Correct Score',
      /** 上半场正确比分 */
      '1_1_45': '1H,Correct Score',
      /** 下半场正确比分 */
      '1_2_45': '2H,Correct Score',
      /** 半全场 */
      '1_0_47': 'Half/Full Time',
      /** 主队两个半场均得分 */
      '1_0_48': 'Home team to score in both halves',
      /** 客队两个半场均得分 */
      '1_0_49': 'Away team to score in both halves',
      /** 主队任意半场获胜 */
      '1_0_50': 'Home team wins in any half',
      /** 客队任意半场获胜 */
      '1_0_51': 'Away team wins in any half',
      /** 最高得分半场 */
      '1_0_52': 'Highest scoring half',
      /** 主队最高得分半场 */
      '1_0_53': 'Home team highest scoring half',
      /** 客队最高得分半场 */
      '1_0_54': 'Away team highest scoring half',
      /** 半场均大于1.5 */
      '1_0_55': 'Each half goals over@1.5',
      /** 半场均小于1.5 */
      '1_0_56': 'Each half goals under@1.5',
      /** 首球半场 */
      '1_0_62': 'First goal in half',
      /** 首球方式' */
      '1_0_63': 'Way of first goal', 
      /** 下一个进球 */
      '1_0_160': 'Next goal',
      /** 上半场下一个进球 */
      '1_1_160': '1H,Next goal',
      /** 下半场下一个进球 */
      '1_2_160': '2H,Next goal',
      /** 赛果/大小 */
      '1_0_144': 'Result/Total Goals',
      /** 双胜彩/大小 */
      '1_0_449': 'Double Chance/Total Goals',
      /** 两队均得分/双胜彩 */
      '1_0_451': 'Both Teams to Score/Double Chance',
      /** 单双/大小 */
      '1_0_450': 'Odd Even/Total Goals',
      /** 是否加时赛 */
      '1_0_220': 'To Go Extra-time?',
      /** 是否点球 */
      '1_0_221': 'To Go Penalty Shoot-out?',
      /** 是否和局 */
      '1_0_222': 'Will it be draw?',
      /** 加时进球 */
      '1_0_223': 'To score in extra-time',
      /** 比赛终结方式 */
      '1_0_224': 'Way of match ends',
      /** 赛果/首球 */
      '1_0_230': 'Result/First goal',
      /** 均得分/赛果 */
      '1_0_231': 'Both team to score/Result',
      /** 上半场均得分/赛果 */
      '1_1_231': 'H1,Both team to score/Result',
      /** 下半场均得分/赛果 */
      '1_2_231': 'H2,Both team to score/Result',
      /** 主队哪个半场先得分 */
      '1_0_420': 'Home Team Which Half First Goal',
      /** 客队哪个半场先得分 */
      '1_0_421': 'Away Team Which Half First Goal',
      /** 首先进2球 */
      '1_0_422': 'First Team 2 Goals',
      /** 首先进3球 */
      '1_0_423': 'First Team 3 Goals',
      /** 哪支球队赢得5+球 */
      '1_0_460': 'Which Team Will Win By 5+ Goals',
      /** 落后反超球队 */
      '1_0_425': 'To Win From Behind',
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
      '2_0_18': 'Number of Corners',
      /** 上半场角球大小 */
      '2_1_18': '1H,Number of Corners',
      /** 下半场角球大小 */
      '2_2_18': '2H,Number of Corners',
      /** 角球范围 */
      '2_0_25': 'Corners Range',
      /** 上半场角球范围 */
      '2_1_25': '1H,Corners Range',
      /** 角球单双 */
      '2_0_26': 'Corner Odd/Even',
      /** 上半场角球单双 */
      '2_1_26': '1H Corner Odd/Even',
      /** 角球最高得分半场 */
      '2_0_52': 'Half with Most Corner',
      /** 主队角球数大小 */
      '2_0_57': 'Home Corner',
      /** 上半场主队角球数大小 */
      '2_1_57': '1H Home Corner',
      /** 客队角球数大小 */
      '2_0_58': 'Away Corner',
      /** 上半场客队角球数大小 */
      '2_1_58': '1H Away Corner',
      /** 最后一个角球 */
      '2_0_448': 'Last Corner',
      /** 上半场最后一个角球 */
      '2_1_448': '1H Last Corner',
      /** 首个角球 */
      '2_0_489': 'First Corner',
      /** 上半场首个角球 */
      '2_1_489': '1H, First Corner',
      /** 谁先开球 */
      '5_0_16': 'Kick-off Team',
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
      '1_0_18': 'Total Points',
      /** 上半场大小 */
      '1_1_18': '1H,Total Points',
      /** 第1节大小 */
      '1_51_18': '1st Quarter,Total Points',
      /** 第2节大小 */
      '1_52_18': '2nd Quarter,Total Points',
      /** 第3节大小 */
      '1_53_18': '3rd Quarter,Total Points',
      /** 第4节大小 */
      '1_54_18': '4th Quarter,Total Points',
      /** 单双 */
      '1_0_26': 'Odd/Even',
      /** 上半场单双 */
      '1_1_26': '1H,Odd/Even',
      /** 第1节单双 */
      '1_51_26': '1st Quarter,Odd/Even',
      /** 第2节单双 */
      '1_52_26': '2nd Quarter,Odd/Even',
      /** 第3节单双 */
      '1_53_26': '3rd Quarter,Odd/Even',
      /** 第4节单双 */
      '1_54_26': '4th Quarter,Odd/Even',
      /** 主队大小 */
      '1_0_40': 'Home Total Points',
      /** 上半场主队大小 */
      '1_1_40': '1H,Home Total Points',
      /** 第1节主队大小 */
      '1_51_40': '1st Quarter,Home Total Points',
      /** 第2节主队大小 */
      '1_52_40': '2nd Quarter,Home Total Points',
      /** 第3节主队大小 */
      '1_53_40': '3rd Quarter,Home Total Points',
      /** 第4节主队大小 */
      '1_54_40': '4th Quarter,Home Total Points',
      /** 客队大小 */
      '1_0_41': 'Away Total Points',
      /** 上半场客队大小 */
      '1_1_41': '1H,Away Total Points',
      /** 第1节客队大小 */
      '1_51_41': '1st Quarter,Away Total Points',
      /** 第2节客队大小 */
      '1_52_41': '2nd Quarter,Away Total Points',
      /** 第3节客队大小 */
      '1_53_41': '3rd Quarter,Away Total Points',
      /** 第4节客队大小 */
      '1_54_41': '4th Quarter,Away Total Points',
      /** 半全场 */
      '1_0_47': 'HT/FT',
      /** 胜负 */
      '1_0_186': 'Money Line',
      /** 上半场胜负 */
      '1_1_186': '1H,Money Line',
      /** 第1节胜负 */
      '1_51_186': '1st Quarter,Money Line',
      /** 第2节胜负 */
      '1_52_186': '2nd Quarter,Money Line',
      /** 第3节胜负 */
      '1_53_186': '3rd Quarter,Money Line',
      /** 第4节胜负 */
      '1_54_186': '4th Quarter,Money Line',
      /** 是否进入加时赛 */
      '1_0_220': 'To Go Overtime?',
      /** 胜分范围 */
      '1_0_290': 'Winning Margin',
      /** 上半场胜分范围 */
      '1_1_290': '1H,Winning Margin',
      /** 第1节胜分范围 */
      '1_51_290': '1st Quarter,Winning Margin',
      /** 第2节胜分范围 */
      '1_52_290': '2nd Quarter,Winning Margin',
      /** 第3节胜分范围 */
      '1_53_290': '3rd Quarter,Winning Margin',
      /** 第4节胜分范围 */
      '1_54_290': '4th Quarter,Winning Margin',
      /** 落后反超球队 */
      '1_0_425': 'To Win From Behind',
      /** 第1节落后反超球队 */
      '1_51_425': '1st Quarter,To Win From Behind',
      /** 第2节落后反超球队 */
      '1_52_425': '2nd Quarter,To Win From Behind',
      /** 第3节落后反超球队 */
      '1_53_425': '3rd Quarter,To Win From Behind',
      /** 第4节落后反超球队 */
      '1_54_425': '4th Quarter,To Win From Behind',
      /** 首先获得{y}分 */
      '1_0_606': 'Race to {y} Points',
      /** 上半场首先获得{y}分 */
      '1_1_606': '1H Race to {y} Points',
      /** 第1节首先获得{y}分 */
      '1_51_606': 'Q1 Race to {y} Points',
      /** 第2节首先获得{y}分 */
      '1_52_606': 'Q2 Race to {y} Points',
      /** 第3节首先获得{y}分 */
      '1_53_606': 'Q3 Race to {y} Points',
      /** 第4节首先获得{y}分 */
      '1_54_606': 'Q4 Race to {y} Points',
      /** 首先获得{y}分 */
      '1_0_613': 'FT Which team to score the first basket',
      /** 最后得分球队 */
      '1_0_617': 'Team to Score Last',
      /** 上半场最后得分球队 */
      '1_1_617': '1H Team to Score Last',
      /** 第1节最后得分球队 */
      '1_51_617': 'Q1 Team to Score Last',
      /** 第2节最后得分球队 */
      '1_52_617': 'Q2 Team to Score Last',
      /** 第3节最后得分球队 */
      '1_53_617': 'Q3 Team to Score Last',
      /** 第4节最后得分球队 */
      '1_54_617': 'Q4 Team to Score Last',
    },
    /** 网球 */
    12: {
      /** 胜负 */
      '1_0_186': 'To Win Match',
      /** 第一盘胜负 */
      '1_51_186': 'S1,To Win Match',
      /** 第二盘胜负 */
      '1_52_186': 'S2,To Win Match',
      /** 第三盘胜负 */
      '1_53_186': 'S3,To Win Match',
      /** 第四盘胜负 */
      '1_54_186': 'S4,To Win Match',
      /** 第五盘胜负 */
      '1_55_186': 'S5,To Win Match',
      /** 第六盘胜负 */
      '1_56_186': 'S6,To Win Match',
      /** 第七盘胜负 */
      '1_57_186': 'S7,To Win Match',
      /** 让盘 */
      '1_0_16': 'Match Handicap (Sets)',
      /** 盘数比分 */
      '1_0_1302': 'Set Score',
      /** 让局 */
      '1_0_153': 'Match Handicap (Games)',
      /** 让局 */
      '1_0_153': 'Match Handicap (Games)',
      /** 第一盘让局 */
      '1_51_153': 'S1, Match Handicap (Games)',
      /** 第二盘让局 */
      '1_52_153': 'S2, Match Handicap (Games)',
      /** 第三盘让局 */
      '1_53_153': 'S3, Match Handicap (Games)',
      /** 第四盘让局 */
      '1_54_153': 'S4, Match Handicap (Games)',
      /** 第五盘让局 */
      '1_55_153': 'S5, Match Handicap (Games)',
      /** 第六盘让局 */
      '1_56_153': 'S6, Match Handicap (Games)',
      /** 第七盘让局 */
      '1_57_153': 'S7, Match Handicap (Games)',
      /** 总局数大小 */
      '1_0_18': 'Total Games Number',
      /** 总局数单双 */
      '1_0_1305': 'Total Games Odd/Even',
    },
    /** 排球 */
    13: {
      /** 让分 */
      '1_0_16': 'Handicap (Sets)',
      /** 大小 */
      '1_0_18': 'Total Points',
      /** 胜负 */
      '1_0_186': 'To Win',
      /** 单双 */
      '1_0_26': 'Odd/Even (Sets)',
      /** 第一局让分 */
      '1_51_16': 'Set 1 Handicap',
      /** 第二局让分 */
      '1_52_16': 'Set 2 Handicap',
      /** 第三局让分 */
      '1_53_16': 'Set 3 Handicap',
      /** 第四局让分 */
      '1_54_16': 'Set 4 Handicap',
      /** 第五局让分 */
      '1_55_16': 'Set 5 Handicap',
      /** 第一局胜负 */
      '1_51_186': 'Set 1 Winner',
      /** 第二局胜负 */
      '1_52_186': 'Set 2 Winner',
      /** 第三局胜负 */
      '1_53_186': 'Set 3 Winner',
      /** 第四局胜负 */
      '1_54_186': 'Set 4 Winner',
      /** 第五局胜负 */
      '1_55_186': 'Set 5 Winner',
    },
    /** 乒乓球 */
    14: {
      /** 让分 */
      '1_0_16': 'Handicap (Sets)',
      /** 胜负 */
      '1_0_186': 'To Win',
    },
    /** 冰球 */
    15: {
      /** 让分 */
      '1_0_16': 'Handicap',
      /** 大小 */
      '1_0_18': 'Total Score',
      /** 胜负 */
      '1_0_186': 'Money Line',
      /** 单双 */
      '1_0_26': 'Odd/Even',
    },
    /** 棒球 */
    16: {
      /** 让分 */
      '1_0_16': 'Handicap',
      /** 大小 */
      '1_0_18': 'Game Total',
      /** 胜负 */
      '1_0_186': 'Money Line',
      /** 上半场让分 */
      '1_1_16': '1H,Handicap',
      /** 上半场大小 */
      '1_1_18': '1H,Total',
      /** 上半场胜负 */
      '1_1_186': '1H,Money Line',
    },
    /** 电竞 */
    99: {
      /** 让分 */
      '1_0_16': 'Handicap',
      /** 大小 */
      '1_0_18': 'Total',
      /** 胜负 */
      '1_0_186': 'Money Line',
      // 第x图胜负
      ...makeEsportMapMarkets('9001', 'Moneyline'),
      // 第x图击杀总数让分
      ...makeEsportMapMarkets('9002', 'Total Kills Handicap'),
      // 第x图击杀总数大小
      ...makeEsportMapMarkets('9003', 'Total Kills Over/Under'),
      // 第x图击杀总数胜负
      ...makeEsportMapMarkets('9004', 'Total Kills Moneyline'),
      // 第x图击杀总数单双
      ...makeEsportMapMarkets('9005', 'Total Kills Odd/Even'),
      // 第x图第一滴血
      ...makeEsportMapMarkets('9006', 'First Blood'),
      // 待确认 第x图首先达到{y}杀
      ...makeEsportMapMarkets('9007', 'First to {y} Kills'),
      // 第x图摧毁防御塔让分
      ...makeEsportMapMarkets('9008', 'Total Towers Handicap'),
      // 第x图摧毁防御塔大小
      ...makeEsportMapMarkets('9009', 'Total Towers Over/Under'),
      // 第x图摧毁防御塔胜负
      ...makeEsportMapMarkets('9010', 'Total Towers Moneyline'),
      // 待确认 第x图第一防御塔-第{y}层
      ...makeEsportMapMarkets('9011', 'First Tier {y} Tower'),
      // 第x图击杀肉山让分
      ...makeEsportMapMarkets('9012', 'Total Roshans Handicap'),
      // 第x图击杀肉山大小
      ...makeEsportMapMarkets('9013', 'Total Roshans Over/Under'),
      // 第x图击杀肉山胜负
      ...makeEsportMapMarkets('9014', 'Total Roshans Moneyline'),
      // 第x图击杀首个肉山
      ...makeEsportMapMarkets('9015', '1st Roshan'),
      // 第x图击杀第二个肉山
      ...makeEsportMapMarkets('9016', '2nd Roshan'),
      // 第x图击杀第三个肉山
      ...makeEsportMapMarkets('9017', '3rd Roshan'),
      // 第x图摧毁兵营总数让分
      ...makeEsportMapMarkets('9018', 'Total Barracks Handicap'),
      // 第x图摧毁兵营总数大小
      ...makeEsportMapMarkets('9019', 'Total Barracks Over/Under'),
      // 第x图摧毁兵营总数胜负
      ...makeEsportMapMarkets('9020', 'Total Barracks Moneyline'),
      // 第x图摧毁首座兵营
      ...makeEsportMapMarkets('9021', 'Barracks 1st Lane'),
      // 第x图摧毁第二座兵营
      ...makeEsportMapMarkets('9022', 'Barracks 2nd Lane'),
      // 第x图摧毁第三座兵营
      ...makeEsportMapMarkets('9023', 'Barracks 3rd Lane'),
      // 第x图摧毁炮塔总数让分
      ...makeEsportMapMarkets('9024', 'Total Turrets Handicap'),
      // 第x图摧毁炮塔总数大小
      ...makeEsportMapMarkets('9025', 'Total Turrets Over/Under'),
      // 第x图摧毁炮塔总数胜负
      ...makeEsportMapMarkets('9026', 'Total Turrets Moneyline'),
      // 待确认 第x图首先摧毁{y}座炮塔
      ...makeEsportMapMarkets('9027', 'First Tier {y} Turret'),
      // 第x图击杀巨龙总数让分
      ...makeEsportMapMarkets('9028', 'Total Dragons Handicap'),
      // 第x图击杀巨龙总数大小
      ...makeEsportMapMarkets('9029', 'Total Dragons Over/Under'),
      // 第x图击杀巨龙总数胜负
      ...makeEsportMapMarkets('9030', 'Total Dragons Moneyline'),
      // 第x图击杀第一只巨龙
      ...makeEsportMapMarkets('9031', '1st Dragon'),
      // 第x图击杀第二只巨龙
      ...makeEsportMapMarkets('9032', '2nd Dragon'),
      // 第x图击杀第三只巨龙
      ...makeEsportMapMarkets('9033', '3rd Dragon'),
      // 第x图击杀男爵总数让分
      ...makeEsportMapMarkets('9034', 'Total Barons Handicap'),
      // 第x图击杀男爵总数大小
      ...makeEsportMapMarkets('9035', 'Total Barons Over/Under'),
      // 第x图击杀男爵总数胜负
      ...makeEsportMapMarkets('9036', 'Total Barons Moneyline'),
      // 第x图击杀首个男爵
      ...makeEsportMapMarkets('9037', '1st Baron'),
      // 第x图击杀第二个男爵
      ...makeEsportMapMarkets('9038', '2nd Baron'),
      // 第x图击杀第三个男爵
      ...makeEsportMapMarkets('9039', '3rd Baron'),
      // 第x图摧毁水晶总数让分
      ...makeEsportMapMarkets('9040', 'Total Inhibitors Handicap'),
      // 第x图摧毁水晶总数大小
      ...makeEsportMapMarkets('9041', 'Total Inhibitors Over/Under'),
      // 第x图摧毁水晶总数胜负
      ...makeEsportMapMarkets('9042', 'Total Inhibitors Moneyline'),
      // 第x图摧毁首个水晶
      ...makeEsportMapMarkets('9043', '1st Inhibitor'),
      // 第x图摧毁第二个水晶
      ...makeEsportMapMarkets('9044', '2nd Inhibitor'),
      // 第x图摧毁第三个水晶
      ...makeEsportMapMarkets('9045', '3rd Inhibitor'),
      // 第x图击杀暴君总数让分
      ...makeEsportMapMarkets('9046', 'Total Tyrants Handicap'),
      // 第x图击杀暴君总数大小
      ...makeEsportMapMarkets('9047', 'Total Tyrants Over/Under'),
      // 第x图击杀暴君总数胜负
      ...makeEsportMapMarkets('9048', 'Total Tyrants Moneyline'),
      // 第x图击杀第一个暴君
      ...makeEsportMapMarkets('9049', '1st Tyrant'),
      // 第x图击杀第二个暴君
      ...makeEsportMapMarkets('9050', '2nd Tyrant'),
      // 第x图击杀第三个暴君
      ...makeEsportMapMarkets('9051', '3rd Tyrant'),
      // 第x图击杀主宰总数让分
      ...makeEsportMapMarkets('9052', 'Total Overlords Handicap'),
      // 第x图击杀主宰总数大小
      ...makeEsportMapMarkets('9053', 'Total Overlords Over/Under'),
      // 第x图击杀主宰总数胜负
      ...makeEsportMapMarkets('9054', 'Total Overlords Moneyline'),
      // 第x图击杀首个主宰 
      ...makeEsportMapMarkets('9055', '1st Overlord'),
      // 第x图击杀第二个主宰
      ...makeEsportMapMarkets('9056', '2nd Overlord'),
      // 第x图击杀第三个主宰
      ...makeEsportMapMarkets('9057', '3rd Overlord'),
      // 第x图比赛时间大小
      ...makeEsportMapMarkets('9058', 'Duration Over/Under (Mins)'),
      // 第x图回合获胜让分
      ...makeEsportMapMarkets('9059', 'Rounds Handicap'),
      // 第x图回合获胜大小
      ...makeEsportMapMarkets('9060', 'Rounds Over/Under'),
      // 第x图回合获胜单双
      ...makeEsportMapMarkets('9061', 'Rounds Odd/Even'),
      // 第x图首先赢得{y}回合
      ...makeEsportMapMarkets('9062', 'First to {y} Rounds'),
      // 第x图赢得上半场
      ...makeEsportMapMarkets('9063', 'First Half'),
      // 第x图赢得下半场
      ...makeEsportMapMarkets('9064', 'Second Half'),
      // 第x图最多第一杀
      ...makeEsportMapMarkets('9065', 'Most First Kill'),
      // 第x图最后存活玩家
      ...makeEsportMapMarkets('9066', 'Clutches'),
      // 第x图第16回合
      ...makeEsportMapMarkets('9067', '16th Round'),
      // TODO 待确认 第x图第X回合胜负
      ...makeEsportMapMarkets('9068', 'Round {y} Moneyline'),
      // 第x图第{y}回合击杀总数胜负
      ...makeEsportMapMarkets('9069', 'Round {y} Total Kills Moneyline'),
      // 第x图第{y}回合击杀总数大小
      ...makeEsportMapMarkets('9070', 'Round {y} Total Kills Over/Under'),
      // 第x图第{y}回合击杀总数单双
      ...makeEsportMapMarkets('9071', 'Round {y} Total Kills Odd/Even'),
      // 待确认 第x图第{y}回合首杀
      ...makeEsportMapMarkets('9072', 'Round {y} First Kill'),
      // 第x图第{y}回合炸弹安放
      ...makeEsportMapMarkets('9073', 'Round {y} Bomb Plant'),
      // 第x图出现加时赛
      ...makeEsportMapMarkets('9074', 'Rounds Over/Under (Overtime)'),
      // 第x图最后回合炸弹安放
      ...makeEsportMapMarkets('9075', 'Final Round Bomb Plant'),
      // 第x图最后存活玩家让分
      ...makeEsportMapMarkets('9076', 'Clutches Handicap'),
      // 第x图第{y}回合击杀总数让分
      ...makeEsportMapMarkets('9077', 'Round {y} Total Kills Handicap'),
      // 第x图摧毁防御塔总数单双
      ...makeEsportMapMarkets('9078', 'Total Towers Odd/Even'),
      // 第x图击杀肉山总数单双
      ...makeEsportMapMarkets('9079', 'Total Roshans Odd/Even'),
      // 第x图摧毁兵营总数单双
      ...makeEsportMapMarkets('9080', 'Total Barracks Odd/Even'),
      // 第x图摧毁炮塔总数单双
      ...makeEsportMapMarkets('9081', 'Total Turrets Odd/Even'),
      // 第x图击杀巨龙总数单双
      ...makeEsportMapMarkets('9082', 'Total Dragons Odd/Even'),
      // 第x图击杀男爵总数单双
      ...makeEsportMapMarkets('9083', 'Total Barons Odd/Even'),
      // 第x图摧毁水晶总数单双
      ...makeEsportMapMarkets('9084', 'Total Inhibitors Odd/Even'),
      // 第x图击杀暴君总数单双
      ...makeEsportMapMarkets('9085', 'Total Tyrants Odd/Even'),
      // 第x图击杀男爵总数单双
      ...makeEsportMapMarkets('9086', 'Total Overlords Odd/Even'),
      // 第x图出现加时赛
      ...makeEsportMapMarkets('9087', 'Overtime'),
      // 第x图精准得分
      ...makeEsportMapMarkets('9088', 'Correct score'),
    },
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
    '1X': 'Home&Draw',
    /** 主客 */
    12: 'Home&Away',
    /** 和客 */
    X2: 'Draw&Away',
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
    '1H': '1H',
    /** 下半场 */
    '2H': '2H',
    // /** 上半场 */
    // maxscore_1: '1H',
    // /** 下半场 */
    // maxscore_2: '2H',
    // /** 平局 */
    // maxscore_Equals: 'Draw',
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
    '30_None': 'No Goal' ,
    /** 双方球队 */
    '30_Both': 'Both',
    /** 仅主队 */
    '30_1': 'Only Home Team',
    /** 仅客队 */
    '30_2': 'Only Away Team',
    /** 一方 */
    '36_O': 'One Side',
    /** 均不 */
    '36_N': 'None',
    /** 双方 */
    '36_B': 'Both',
    /** 主先 */
    '38_1:1': 'Home to score first',
    /** 主后 */
    '38_1:2': 'Home to score last',
    /** 客先 */
    '38_2:1': 'Away to score first',
    /** 客后 */
    '38_2:2': 'Away to score last',
    /** 无进球 */
    '38_0:0': 'No Goal',
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
    '62_None': 'No Goal',
    /** 射门 */
    '63_S': 'Shoot',
    /** 头球 */
    '63_H': 'Header',
    /** 点球 */
    '63_P': 'Penalty',
    /** 任意球 */
    '63_FK': 'Free Kick',
    /** 乌龙球 */
    '63_OG': 'Own Goal',
    /** 无进球 */
    '63_NG': 'No Goal',
    /** 主/常规 */
    '224_HR': 'Home/Regular',
    /** 主/加时 */
    '224_HE': 'Home/Extra-Time',
    /** 主/点球 */
    '224_HP': 'Home/Penalty',
    /** 客/常规 */
    '224_AR': 'Away/Regular',
    /** 客/加时 */
    '224_AE': 'Away/Extra-Time',
    /** 客/点球 */
    '224_AP': 'Away/Penalty',
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
    '231_YH': 'Yes/Home',
    /** 是/客胜 */
    '231_YA': 'Yes/Away',
    /** 是/和局 */
    '231_YD': 'Yes/Draw',
    /** 否/主胜 */
    '231_NH': 'No/Home',
    /** 否/客胜 */
    '231_NA': 'No/Away',
    /** 否/和局 */
    '231_ND': 'No/Draw',
    /** 主 {value}分 */
    '290_Home': 'Home {value}',
    /** 客 {value}分 */
    '290_Away': 'Away {value}',
    /** 平局 */
    '290_Draw': 'Draw',
    /** 主队/小 */
    '144_HU': 'Home/Under',
    /** 主队/大 */
    '144_HO': 'Home/Over',
    /** 和局/小 */
    '144_DU': 'Draw/Under',
    /** 和局/大 */
    '144_DO': 'Draw/Over',
    /** 客队/小 */
    '144_AU': 'Away/Under',
    /** 客队/大 */
    '144_AO': 'Away/Over',
    /** 主和/大 */
    '449_1XO': 'Home/Draw & Over ',
    /** 主和/小 */
    '449_1XU': 'Home/Draw & Under',
    /** 主客/大 */
    '449_12O': 'Home/Away & Over ',
    /** 主客/小 */
    '449_12U': 'Home/Away & Under',
    /** 客和/大 */
    '449_2XO': 'Away/Draw & Over',
    /** 客和/小 */
    '449_2XU': 'Away/Draw & Under',
    /** 是/主和 */
    '451_Y1X': 'Yes & Home/Draw',
    /** 是/主客 */
    '451_Y12': 'Yes & Home/Away',
    /** 是/客和 */
    '451_Y2X': 'Yes & Away/Draw',
    /** 否/主和 */
    '451_N1X': 'No & Home/Draw ',
    /** 否/主客 */
    '451_N12': 'No & Home/Away ',
    /** 否客和 */
    '451_N2X': 'No & Away/Draw',
    /** 单/大 */
    '450_OO': 'Odd & Over',
    /** 单/小 */
    '450_OU': 'Odd & Under',
    /** 双/大 */
    '450_EO': 'Even & Over',
    /** 双/小 */
    '450_EU': 'Even & Under',
  },
  /** 比赛阶段 */
  periods: {
    /**   */
    10: ' ',
    /** 节 */
    11: ' ',
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
    0: 'Not Started',
    /** 第1{type} */
    1: 'Q1',
    /** 第2{type} */
    2: 'Q2',
    /** 第3{type} */
    3: 'Q3',
    /** 第4{type} */
    4: 'Q4',
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
    14: 'Time Out',
    /** 半场 */
    15: 'Half',
    /** 等待加时 */
    16: 'Waiting Extra Time',
    /** 加时中 */
    17: 'In Extra Time',
    /** 加时上半场 */
    18: '1H,ET',
    /** 加时赛中场 */
    19: 'Half Time, ET',
    /** 加时下半场 */
    20: '2H,ET',
    /** 加时赛后 */
    21: 'After ET',
    /** 等待点球 */
    22: 'Waiting Penalties',
    /** 点球中 */
    23: 'Penalty Shoot-out',
    /** 点球后 */
    24: 'After Penalties',
    /** 中断 */
    25: 'Interrupted',
    /** 停赛 */
    26: 'Suspended',
    /** 弃赛 */
    27: 'Abandoned',
    /** 弃权 */
    28: 'Forfeit',
    /** 取消 */
    29: 'Cancelled',
    /** 金局后 */
    30: 'After Golden Set',
    /** 第1{type}完场后 */
    31: 'After 1st{type}',
    /** 第2{type}完场后 */
    32: 'After 2nd{type}',
    /** 第3{type}完场后 */
    33: 'After 3rd{type}',
    /** 第4{type}完场后 */
    34: 'After 4th{type}',
    /** 第5{type}完场后 */
    35: 'After 5th{type}',
    /** 第6{type}完场后 */
    36: 'After 6th{type}',
    /** 第7{type}完场后 */
    37: 'After 7th{type}',
    /** 第8{type}完场后 */
    38: 'After 8th{type}',
    /** 延期 */
    40: 'Postponed',
    /** 推迟开赛 */
    41: 'Match Delayed',
    /** 完场 */
    100: 'Full Time',
    /** 进行中 */
    999: 'In Play',
  },
  /** 玩法分类 */
  categories: {
    /** 全部 */
    '-1': 'All',
    /** 主要玩法 */
    1: 'Main',
    /** 亚洲玩法 */
    2: 'Asian',
    /** 半场玩法 */
    3: 'Half Time',
    /** 附加玩法 */
    4: 'Others',
    /** 角球玩法 */
    5: 'Corners',
    /** 罚牌玩法 */
    6: 'Cards',
    /** 单节玩法 */
    7: 'Quarter',
  },
  /** 详情或赛果的比分标题 */
  scores: {
    /** 上半场 */
    h1: '1H',
    /** 角球 */
    corner: 'Corner',
    /** 黄牌 */
    yellowCard: 'Yellow Card',
    /** 红牌 */
    redCard: 'Red Card',
    /** 上半场角球 */
    h1corner: '1H Corner',
    /** 上半场比分 */
    h1score: '1H Score',
    /** 全场角球 */
    h0corner: 'FT Corner',
    /** 全场比分 */
    h0score: 'FT Score',
    /** 角 */
    corner_h: 'C',
    /** 分 */
    score_h: 'Points',
    /** 上半 */
    h1_h: '1H',
    /** 全 */
    h0_h: 'FT',
  },
  /** 底部tab-bar */
  tabs: {
    /** 首页 */
    home: 'HOME',
    /** 滚球 */
    inplay: 'IN-PLAY',
    /** 发现 */
    discover: 'DISCOVER',
    /** 直播 */
    live: 'LIVE',
    /** 我的 */
    member: 'MEMBER',
  },
  /** 发现页 tabs */
  discover_tabs: {
    /** 直播 */
    live: 'LIVE',
    /** 优惠 */
    promo: 'PROMOTIONS',
    /** 赛果 */
    match_result: 'RESULTS',
  },
  /** 搜索 */
  search: {
    /** 未查到任何数据 */
    notfound: 'No Data Found',
    /** 大爷您别急，小的正在使劲的查找 */
    searching: 'Please be patient while we are searching for you...',
    /** 联赛结果 */
    tours: 'League Found',
    /** 比赛结果 */
    matchs: 'Match Found',
    /** 开赛时间 */
    time: 'Start Time: {time}',
    /** 进行中 */
    playing: 'In-Play',
    /** 输入联赛或者球队关键字 */
    placeholder: 'Please input event or team key word(s)',
    /** {count} 场赛事*/
    match_count: '{count} Games'
  },
  /** 公共 */
  common: {
    /** 九游体育(公告署名) */
    org: 'J9 Sports',
    /** 分 */
    minute: 'm',
    /** 需要登录 */
    sign_first: 'Please Login First',
    /** 暂无数据 */
    norecords: 'No Data Available at the Moment',
    /** 网络请求错误,请稍后再试! */
    network_error: 'Network jitter, Please try again later',
    /** 提现 */
    cash_out: 'Withdraw',
    /** 充值 */
    cash_in: 'Cash In',
    /** 登录 */
    login: 'Login',
    /** 注册 */
    reg: 'Register',
    /** 至 */
    to: 'to',
    /** 存款 */
    deposit: 'Deposit',
    /** 公告 */
    annouce: 'Notice',
    /** 公告详情 */
    annou_detail: 'Notice Detail',
    /** 查看详情 */
    details: 'Details',
    /** 关闭 */
    close: 'Close',
    /** 活动详情 */
    activity_details: 'Activity Details',
    /** 时间 */
    time: 'Time',
    /** 赛事 */
    match: 'Match',
    /** 状态 */
    state: 'State',
    /** 当前 */
    current: 'Current'
  },
  /** 比赛过滤 */
  filter: {
    /** 条件筛选 */
    condition: 'Filters',
    /** 选择联赛(可多选) */
    muti_select: 'Tournaments (Multiple Choice)',
    /** 列表排序设置 */
    orderby_title: 'Event List Order',
    /** 按比赛时间升序(近期开赛) */
    orderby_0: 'Earliest Kick-off',
    /** 按比赛时间降序(最新滚球) */
    orderby_2: 'Latest In-Play Game',
    /** 按比赛时间降序(联赛优先) */
    orderby_1: 'Sort by League',
    /** 精选 */
    'state_1301': 'Featured',
    /** 滚球 */
    'state_1': 'In-Play',
    /** 今日 */
    'state_-1': 'Today',
    /** 早盘 */
    'state_0': 'Early Price',
    /** 串关 */
    'state_99': 'Multi-Bets',
    /** 赛果 */
    'state_1302': 'Results',
    /** 直播 */
    'state_1303': 'Live Stream',
    /** 时间筛选 */
    date: 'Date',
    /** 体育筛选 */
    sports: 'Sports',
    /** 类型筛选 */
    state: 'Choice',
    /** 联赛筛选 */
    tours: 'Leagues',
    /** 日期格式 */
    date_format1: 'MM-DD',
    /** 现在 */
    now: 'Now',
    /** 取消 */
    cancel: 'Cancel',
    /** 确定 */
    ok: 'OK',
    /** 多选 */
    multiple: 'Selection',
    /** 收起 */
    collapse_true: 'Hide',
    /** 更多 */
    collapse_false: 'More',
    /** 时间选择(单选) */
    time_pick: 'Select Time (Single)',
    /** 输入关键字检索联赛 */
    keyword: 'Tournament/Match/Team Key Word',
  },
  /** 比赛相关 */
  match: {
    /** 赛事信息(比赛详情切换按钮) */
    media_info: 'Match',
    /** 动画直播(比赛详情切换按钮) */
    media_lmt: 'Flash',
    /** 视频直播(比赛详情切换按钮) */
    media_video: 'Stream',
    /** 注单tab */
    order_count: 'Bet Slip',
    /** 推荐比赛 */
    recommend: 'Featured',
    /** 全场 */
    h0: 'FT',
    /** 局数 */
    games: 'Games',
    /** 盘数 */
    sets: 'Sets',
    /** 第n局 */
    sets_index: 'Set {index}',
    /** 第n盘 */
    games_index: 'Game {index}',
    /** 得分 */
    scores: 'Scores',
    /** 比分 */
    result_scores: 'Scores',
    /** 现场滚球 */
    inplays: 'In-Play',
    /** 顶级联赛 */
    topTours: 'Top Leagues',
    /** 共{count}场比赛 */
    total_matchs: '{count} Games',
    /** 更多玩法 */
    more_plays: 'More Bets',
    /** 附加盘口 */
    more_markets: 'Optional Odds',
    /** 比赛详情 */
    match_detail: 'Match Details',
    /** 暂不可投注 */
    unavailable: 'Unavailable',
    /** 已结束 (详情拉比赛提示) */
    finished: 'Match Finished',
    /** 请点击返回 */
    backtip: 'Please Click to Return',
    /** 或查看下一场推荐比赛 */
    nexttip: 'Or View Next Featured Match',
    /** 返回按钮 */
    back: 'Return',
    /** 下一场 */
    next: 'Next Match',
    /** 暂无玩法 */
    nomarket: 'No Bet Available',
    /** 进球啦! */
    goal_notify: 'Goal!!!!!!!!!!!!',
    /** 未找到相关比赛 (详情) */
    match_not_found: 'No Match Found',
    /** 查看比赛 */
    to_detail: 'View Match',
    /** 继续看直播 */
    hold_stream: 'Go on Video'
  },
  /** 会员相关 */
  member: {
    /** 优惠活动*/
    activities: 'Promotion',
    logout: 'Logout',
    /** 暂无玩法 */
    nomarket: 'No Bet Available',
  },
  /** 注单 */
  ticket: {
    /** 日期 */
    date: 'Date',
    /** 投注 (注单页面-左侧投注额统计标题) */
    bet: 'Bet',
    amount: 'Stake',
    /** 盈利 (注单页面-左侧盈利统计标题) */
    profit: 'Return',
    /** 受注中 */
    'status_-1': 'Processing',
    /** 投注成功 */
    'status_1': 'Bet Accepted',
    /** 投注失败 */
    'status_0': 'Bet Failed',
    /** 已结算 */
    'status_3': 'Bet Settled',
    /** 操盘手取消 */
    'status_4': 'Cancelled by Booker',
    /** 暂无订单 */
    norecords: 'No Bet Found',
    /** 未结算 */
    unsettle: 'Unsettle',
    /** 已结算 */
    settled: 'Settled',
    /** 注单号码 */
    billno: 'Bet Slip ID',
    /** 体育类型 */
    sport_type: 'Sports',
    /** 联赛/对阵/投注 */
    match_info: 'League/Match/Stake',
    /** 投注金额 */
    bet_amount: 'Stake',
    /** 总返还额 */
    total_return: 'Return',
    /** 中奖 */
    record_profit: 'Win',
    /** 下注时间 */
    bet_time: 'Bet Time',
    /** 状态 */
    status: 'Status',
    /** 盈 */
    win: 'Win',
    /** 亏 */
    lose: 'Loss',
    /** 平 */
    draw: 'Tie',
    /** 串关投注 */
    combo_bet: '串关投注',
    /** 单式投注 */
    single_bet: '单式投注',
    /** 本金 */
    principal: 'Stake',
    /** 查询注单 */
    more_ticket: 'View Bets',
    /** 退单 */
    chargeback: 'Canceled',
    /** 点击重投 */
    bet_Again: 'Click to Re-bet',
    /** 投注日期 */
    bet_date: 'Bet Date',
    /** 注单单号 */
    bet_no: 'Bet No.',
    /** 复制 */
    copy: 'copy',
    /** 复制成功 */
    copy_success: 'Copy Success',
    /** 复制失败 */
    copy_failed: 'Copy Failed',
  },
  toast: {
    /** 退出登录 */
    logout: 'Please wait...',
    /** 用户余额不足 */
    balance_less: 'Insufficient balance, Please recharge',
    /** 当前有串关项不满足条件 */
    unable: 'One or more choices not valid for multiple bet',
  },
  settings: {
    /** 偏好设置 */
    title: 'Preference',
    /** 赔率变化 */
    odds_change: 'Odds Change',
    /** 快捷金额设置 */
    amount_label: 'Fast Bet Stake',
    /** 金额 */
    amount: 'Amount',
    /** 请输入金额 */
    amount_holder: 'Please input amount',
    /** 语言选择 */
    locale: 'Languages',
    /** 主题选择 */
    theme: 'Theme Options',
    /** 炫晶白 */
    light: 'Crystal White',
    /** 尊贵黑 */
    dark: 'Noble Black',
    /** 开启进球提示音 */
    goal_sound: 'Turn on the goal alert',
    /** 保存成功 */
    save_success: 'Please wait...',
    /** 保存 */
    save: 'Save',
    /** 声音设置 */
    sound: 'Sound Setup'
  },
  bet: {
    /** 当前选项不可投 */
    unavailable: 'Current Bet Unavailable',
    /** 投注受理中 */
    betting: 'Bet in Processing...',
    /** 当前限额{min} ~ {max}元 */
    amount_limit: 'Stake Limit {min} ~ {max}',
    /** 最低限额 */
    lowest_limit: 'Lowest Limit: {min}',
    /** 自动接受所有赔率变化 */
    accept_all: 'Accept All Handicap Odds',
    /** 自动接受更高赔率变化 */
    accept_better: 'Accept Better Odds Only',
    /** 请输入投注金额 */
    amount_required: 'Please input amount',
    /** {var}串1 */
    combo_var: '{var} Fold',
    /** 二串一 */
    double: 'Double',
    /** 三串一 */
    treble: 'Treble',
    /** {amount}元 */
    amount: '{amount}',
    /** 限额: */
    limit: 'Bet Limit: ',
    /** 总赔率:  */
    total_odds: 'Total Odds: ',
    /** 预计返还:  */
    will_return: 'Potential Return: ',
    /** 投注额: */
    bet_label: 'Bet Stake: ',
    /** 至少{count}串1 */
    combo_required: 'At Least {count} Fold ',
    /** 至少2串1 */
    double_required: 'At Least Double',
    /** 至少3串1 */
    treble_required: 'At Least Treble',
    /** 投注 (提交按钮) */
    submit_bet: 'Bet',
    /** 加入串关 */
    add_to_combo: 'Add to Multi-Bet',
    /** 投注单 */
    tab1_cart: 'Bet Slip',
    /** 未结算注单 */
    tab1_ticket: 'Unsettled Bet',
    /** 余额不足 */
    over_amount: 'Insufficient balance, Please recharge',
    /** 投注推送错误信息 */
    error_msg: {
      /** 成功 */
      200: 'Success',
      /** 参数错误 */
      400: 'Parameter Error',
      /** 用户未验证 */
      403: 'Customer Not Verified',
      /** 数据不存在 */
      404: 'Data Not Exist',
      /** ID未验证 */
      405: 'ID Not Verified',
      /** ID未验证 */
      406: 'ID Not Verified',
      /** 比赛已结束 */
      415: 'Match Finished',
      /** 盘口已关闭 */
      416: 'Odds Closed',
      /** 系统错误 */
      500: 'System Error',
      /** 系统错误 */
      510: 'System Error',
      /** 比赛不支持串关 */
      511: 'Match Doesn\'t Support Multiple Bet',
      /** 该投注项无赔率 */
      513: 'No Odds for This Bet',
      /** 串关不能串同一场比赛 */
      514: 'Cannot Add Bet from Same Match to Multiples',
    }
  },
  /** 优惠 */
  promotion: {
    /** 活动内容 */
    promo_content: 'Contents',
    /** 优惠详情 */
    promo_detail: 'Details',
    /** 赛程 */
    matchs: ' Match',
    /** 本活动长期有效 */
    promo_forever: 'All the Time',
    /** 活动倒计时 */
    promo_countdown: '{days}Days {hours}Hours {minutes}Mins {seconds}Secs',
  },
  /** 普通页面 */
  pages: {
    /** 收藏切换提示 */
    faving: 'Processing, please wait...',
    /** 添加收藏成功 */
    fav_success: 'Added Successfully',
    /** 取消收藏成功 */
    cancel_success: 'Removed Successfully',
    /** 特别说明 */
    special_rules: 'Special Notes',
    /** 红包记录 */
    red_record: 'Bonus List',
    /** 玩法规则 */
    rules: 'Game Rules',
    /** 我的注单 */
    my_orders: 'My Bets',
    /** 当前余额 */
    balance: 'Balance',
    /** 点击立即切换到旧版 */
    toversion1: 'Change to Old Version',
    /** 特别说明页面 */
    special_note: {
      /** 老哥俱乐部 */
      bbc: '"Big Bro Club"',
      /** 内容1 */
      content_1: 'Due to the restrictions from Broadcaster and network transfer conditions, Live Stream Video on our website has delay parallel to the real time data and odds. Please take into consideration when you bet on Live Streamed matches.',
      /** 内容2 */
      content_2: 'A match and its betting page will be automatically closed when all betting odds for this match become unavailable. This will result in the shut down of the Live Stream of this match. We are sorry about this inconvenience and our technical team is trying the best to fix this issue.',
      /** 内容3 */
      content_3: 'Due to the Odds Provider\'s regulation, customer may encounter a certain delayed period during In-Play betting for processing the bets to be accepted by traders. Multiples bets may also be cancelled by trader\'s refusal. We are sorry about this inconvenience and are trying best to communicate with Odds Provider to optimise this process for better experience for our customers.',
      /** 内容4 */
      content_4: 'All results and other match data provided in our "RESULT" and "LIVE STREAM" pages are only for your reference. Bets are all settled by the betting result data.',
      /** 内容5 */
      content_5: 'Some bet settlements (in particular for the minor sports and tournaments) may be delayed for an uncertain period because of the confirmation process for accurate results. We are doing the best to acquire more reliable data sources for resulting improvement, to provide our customers with As Fast As Possible bets settlement.',
      /** 内容6 */
      content_6: 'J9 Sports is trying hard to build the best betting experience and our Mobile App will be released in near future.',
      /** 内容7 */
      content_7: 'For more comments and suggestions on improvement of J9 Sports, please visit {anchor} (unfortunately Chinese version only at the moment). Any customer may reply and leave your comments on the "J9 Sports Suggestion" Post. Our project team will listen carefully to your advices and will thank with a prize, highest can be 500 USDT (based on the helpful level for J9 Sports improvement), to the customer who gives valuable suggestion(s)!',
    },
    /** 错误页面 */
    '403': {
      /** 地域限制(标题) */
      'title': 'Restricted Visit',
      /** 地域限制内容(英文) */
      'content_en': 'Sorry, you({ip}) are not able to open this website because your are currently visiting from a location where has restriction(s) on the content of the website',
      /** 地域限制内容(中文) */
      'content_zh': '抱歉，您({ip})当前所在地区无法访问本站',
    },
    '404': {
      /** 找不到页面(标题) */
      'title': 'Page Not Found',
      /** 找不到页面(英文) */
      'content_en': 'The page you were looking for doesn\'t exist. You may have mistyped the address or the page may have been  removed.',
      /** 找不到页面(中文) */
      'content_zh': '抱歉！ 页面他不小心迷路了……',
      /** 返回主页 */
      back: 'Return to HOME'
    },
    '503': {
      /** 系统维护(标题) */
      'title': 'Maintenance in Progress',
      /** 尊敬的用户: */
      'customer': 'Dear Valued Customer:',
      /** 内容 */
      'content': 'To provide you with better services, our system is currently under maintenance and upgrade. All services and functions will be interrupted during the maintenance time. Please accept our apologies for any inconvenience it may bring to you!',
      /** 维护时间 */
      'time': 'Maintenance Time: {start} to {end}',
      /** 客服描述 */
      'qa': 'Shall you have any query, please feel free to contact our Customer Services team.'
    }
  }
};