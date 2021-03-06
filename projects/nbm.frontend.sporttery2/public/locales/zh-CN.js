const serverError = '服务发生异常，请稍后再试'

module.exports = {
  // 公共组件
  common: {
    tabs: {
      home: '首页',
      score: '比分',
      order: '订单',
      profile: '我的'
    },
    errorCode: {
      // 失败
      202: serverError,
      // 参数错误
      400: serverError,
      // 数据格式化错误
      402: serverError,
      // 未登录 需要单独处理
      // 403: '',
      // 数据不存在
      404: '数据不存在',
      // 超过截止时间不能发单或跟单, 需要单独处理
      // 470: '',
      // 数据不存在
      480: '未找到相关数据',
      // 数据已存在
      485: '当前数据已存在',
      // 系统内部错误
      10003: serverError,
      // 参数校验错误
      10004: serverError,
      // 不满足发单条件
      10050: '发单失败，不满足发单条件',
    },
    message: {
      pageerror: '页面加载出错,请稍后再试',
      neterror: '网络错误,请稍后再试'
    },
    sports: {
      10: '竞彩足球',
      11: '竞彩篮球'
    },
    // 投注项名字
    option: {
      Yes: '是',
      No: '否',
      Equals: '和',
      1: '主',
      X: '和',
      x: '和',
      2: '客',
      '1X': '主和',
      12: '主客',
      X2: '和客',
      Over: '大',
      Under: '小',
      Home: '主',
      Away: '客',
      Odd: '单',
      Even: '双',
      Other: '其他',
      AOS: '其他',
      XX: '和局',
      HY: '主是',
      HN: '主否',
      AY: '客是',
      AN: '客否',
      None: '无',
      maxscore_1: '上半场',
      maxscore_2: '下半场',
      maxscore_Equals: '平局',
      winner: '{team}胜',
      '10_1X': '主或和',
      '10_12': '主或客',
      '10_X2': '和或客',
      '16_1': '主',
      '16_2': '客',
      '27_H': '主',
      '27_A': '客',
      '27_NG': '无进球',
      '27_Draw': '平局',
      '30_None': '无进球',
      '30_Both': '双方球队',
      '30_1': '仅主队',
      '30_Home': '仅主队',
      '30_2': '仅客队',
      '30_Away': '仅客队',
      '36_O': '一方',
      '36_N': '均不',
      '36_B': '双方',
      '38_1:1': '主先',
      '38_1:2': '主后',
      '38_2:1': '客先',
      '38_2:2': '客后',
      '38_0:0': '无进球',
      '47_1/1': '主/主',
      '47_1/X': '主/和',
      '47_1/2': '主/客',
      '47_X/1': '和/主',
      '47_X/X': '和/和',
      '47_X/2': '和/客',
      '47_2/1': '客/主',
      '47_2/X': '客/和',
      '47_2/2': '客/客',
      '62_1': '上半场',
      '62_2': '下半场',
      '62_None': '无进球',
      '63_S': '射门',
      '63_H': '头球',
      '63_P': '点球',
      '63_FK': '任意球',
      '63_OG': '乌龙球',
      '63_NG': '无进球',
      '224_HR': '主/常规',
      '224_HE': '主/加时',
      '224_HP': '主/点球',
      '224_AR': '客/常规',
      '224_AE': '客/加时',
      '224_AP': '客/点球',
      '230_HH': '主/主',
      '230_DH': '和/主',
      '230_HA': '主/客',
      '230_AH': '客/主',
      '230_DA': '和/客',
      '230_AA': '客/客',
      '230_NO': '无',
      '231_YH': '是/主胜',
      '231_YA': '是/客胜',
      '231_YD': '是/和局',
      '231_NH': '否/主胜',
      '231_NA': '否/客胜',
      '231_ND': '否/和局',
      '290_Home': '主 {value}分',
      '290_Away': '客 {value}分',
      '290_Draw': '平局',
    },
    game: {
      // sno_grouptype_比赛阶段_gtp
      // 足球
      // '10_1_0_1': '胜平负',
      // '10_1_1_1': '上半场胜平负',
      // '10_1_0_10': '双胜彩',
      // '10_1_1_10': '上半场双胜彩',
      // '10_1_0_14': '让球胜平负',
      // '10_1_0_16': '让分',
      // '10_1_1_16': '上半场让分',
      // '10_1_0_18': '大小',
      // '10_1_1_18': '上半场大小',
      // '10_1_0_21': '总进球',
      // '10_1_0_25': '总分范围',
      // '10_1_0_26': '单双',
      // '10_1_1_26': '上半场单双',
      // '10_1_0_29': '两队均得分',
      // '10_1_1_29': '上半场两队均得分',
      // '10_1_0_30': '得分球队',
      // '10_1_0_33': '主胜且零封',
      // '10_1_0_34': '客胜且零封',
      // '10_1_0_45': '正确比分',
      // '10_1_0_47': '半全场',
      // '10_1_0_48': '主队两个半场均得分',
      // '10_1_0_49': '客队两个半场均得分',
      // '10_1_0_50': '主队任意半场获胜',
      // '10_1_0_51': '客队任意半场获胜',
      // '10_1_0_52': '最高得分半场',
      // '10_1_0_53': '主队最高得分半场',
      // '10_1_0_54': '客队最高得分半场',

      '10_1_0_1': '胜平负',
      '10_1_1_1': '上半场胜平负',
      '10_1_2_1': '下半场胜平负',
      '10_1_0_10': '双胜彩',
      '10_1_1_10': '上半场双胜彩',
      '10_1_2_10': '下半场双胜彩',
      '10_1_0_14': '让分胜平负',
      '10_1_1_14': '上半场让分胜平负',
      '10_1_2_14': '下半场让分胜平负',
      '10_1_0_16': '让分',
      '10_1_1_16': '上半场让分',
      '10_1_2_16': '下半场让分',
      '10_1_0_18': '大小',
      '10_1_1_18': '上半场大小',
      '10_1_2_18': '下半场大小',
      '10_1_0_21': '精准进球数',
      '10_1_1_21': '上半场精准进球数',
      '10_1_2_21': '下半场精准进球数',
      '10_1_0_23': '平局退款',
      '10_1_1_23': '上半场平局退款',
      '10_1_2_23': '下半场平局退款',
      '10_1_0_25': '总分范围',
      '10_1_1_25': '上半场总分范围',
      '10_1_2_25': '下半场总分范围',
      '10_1_0_26': '单双',
      '10_1_1_26': '上半场单双',
      '10_1_2_26': '下半场单双',
      '10_1_0_27': '净胜球数',
      '10_1_1_27': '上半场净胜球数',
      '10_1_2_27': '下半场净胜球数',
      '10_1_0_29': '两队均得分',
      '10_1_1_29': '上半场两队均得分',
      '10_1_2_29': '下半场两队均得分',
      '10_1_0_30': '得分球队',
      '10_1_1_30': '上半场得分球队',
      '10_1_2_30': '下半场得分球队',
      '10_1_0_31': '主队准确得分',
      '10_1_1_31': '上半场主队准确得分',
      '10_1_2_31': '下半场主队准确得分',
      '10_1_0_32': '客队准确得分',
      '10_1_1_32': '上半场客队准确得分',
      '10_1_2_32': '下半场客队准确得分',
      '10_1_0_33': '主胜且零封',
      '10_1_0_34': '客胜且零封',
      '10_1_0_35': '胜出且零封',
      '10_1_0_36': '双方得分情况',
      '10_1_0_37': '零失球',
      '10_1_0_38': '首先/最后进球',
      '10_1_1_38': '上半场首先/最后进球',
      '10_1_2_38': '下半场首先/最后进球',
      '10_1_0_40': '主队大小',
      '10_1_1_40': '上半场主队大小',
      '10_1_2_40': '下半场主队大小',
      '10_1_0_41': '客队大小',
      '10_1_1_41': '上半场客队大小',
      '10_1_2_41': '下半场客队大小',
      '10_1_0_45': '正确比分',
      '10_1_1_45': '上半场正确比分',
      '10_1_2_45': '下半场正确比分',
      '10_1_0_47': '半全场',
      '10_1_0_48': '主队两个半场均得分',
      '10_1_0_49': '客队两个半场均得分',
      '10_1_0_50': '主队任意半场获胜',
      '10_1_0_51': '客队任意半场获胜',
      '10_1_0_52': '最高得分半场',
      '10_1_0_53': '主队最高得分半场',
      '10_1_0_54': '客队最高得分半场',
      '10_1_0_55': '半场均大于1.5',
      '10_1_0_56': '半场均小于1.5',
      '10_1_0_62': '首球半场',
      '10_1_0_63': '首球方式', 
      '10_1_0_133': '主队任意半场获胜',
      '10_1_0_134': '客队任意半场获胜',
      '10_1_0_160': '下一个进球',
      '10_1_0_220': '是否加时赛',
      '10_1_0_221': '是否点球',
      '10_1_0_222': '是否和局',
      '10_1_0_223': '加时进球',
      '10_1_0_224': '比赛终结方式',
      '10_1_0_230': '赛果/首球',
      '10_1_0_231': '均得分/赛果',
      '10_1_0_448': '最后得分球队',

      // 篮球
      '11_1_0_16': '让分胜负',
      '11_1_1_16': '上半场让分',
      '11_1_51_16': '第1节让分',
      '11_1_52_16': '第2节让分',
      '11_1_53_16': '第3节让分',
      '11_1_54_16': '第4节让分',
      '11_1_0_18': '大小分',
      '11_1_1_18': '上半场大小',
      '11_1_51_18': '第1节大小',
      '11_1_52_18': '第2节大小',
      '11_1_53_18': '第3节大小',
      '11_1_54_18': '第4节大小',
      '11_1_0_26': '单双',
      '11_1_1_26': '上半场单双',
      '11_1_51_26': '第1节单双',
      '11_1_52_26': '第2节单双',
      '11_1_53_26': '第3节单双',
      '11_1_54_26': '第4节单双',
      '11_1_0_47': '半全场',
      '11_1_1_47': '半全场',
      '11_1_0_186': '胜负全场',
      '11_1_0_220': '是否进入加时赛',
      '11_1_0_290': '胜分差'
    },
    sgame: {
      // sno_grouptype_比赛阶段_gtp
      // 足球
      '10_1_0_1': '胜平负',
      '10_1_0_14': '让球胜平负',
      '10_1_0_21': '总进球',
      '10_1_0_45': '比分',
      '10_1_0_47': '半全场',

      // 篮球
      '11_1_0_16': '让分胜负',
      '11_1_0_18': '大小分',
      '11_1_0_186': '胜负',
      '11_1_0_290': '胜分差'
    },
    soption: {
      '1_1': '胜',
      '1_X': '平',
      '1_2': '负',
      '14_1': '让胜',
      '14_X': '让平',
      '14_2': '让负',
      '16_1': '让胜',
      '16_2': '让负',
      '18_Over': '大分',
      '18_Under': '小分',
      '21': '{value}个',
      '45_Other': '其他',
      '186_1': '客胜',
      '186_2': '主胜',
      '1': '主胜',
      '2': '客胜',
      'H': '主胜',
      'A': '客胜'
    },
    dow: {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六'
    },
    minute: '分'
  },

  periods: {
    10: ' ',
    11: '节',
    99: 'Map'
  },
  /** 滚球对应阶段 */
  period: {
    0: '未开赛',
    1: '第1{type}',
    2: '第2{type}',
    3: '第3{type}',
    4: '第4{type}',
    5: '第5{type}',
    6: '第6{type}',
    7: '第7{type}',
    8: '第8{type}',
    9: '第9{type}',
    10: '上半场',
    11: '下半场',
    13: '已开始',
    14: '暂停',
    15: '半场',
    16: '等待加时',
    17: '加时中',
    18: '加时上半场',
    19: '加时赛中场',
    20: '加时下半场',
    21: '加时赛后',
    22: '等待点球',
    23: '点球中',
    24: '点球后',
    25: '中断',
    26: '停赛',
    27: '弃赛',
    28: '弃权',
    29: '取消',
    30: '金局后',
    31: '第1{type}完场后',
    32: '第2{type}完场后',
    33: '第3{type}完场后',
    34: '第4{type}完场后',
    35: '第5{type}完场后',
    36: '第6{type}完场后',
    37: '第7{type}完场后',
    38: '第8{type}完场后',
    40: '延期',
    41: '推迟开赛',
    100: '完场',
  },
  // 其他杂项
  sundires: {
    tomore: '更多',
    yuan: '元',
    people: '人',
    bei: '倍',
    cancel: '取消',
    save: '保存',
    more: '查看更多',
    moring: '加载中',
    nomore: '暂无更多数据',
    all: '全部',
    s10: '足球',
    s11: '篮球',
    multis: '{v1}串{v2}',
    ok: '确定',
    finish: '完成',
    cancel: '取消',
    clear: '清除',
    comingsoon: '敬请期待',
    rankingNomore: '榜单数据统计中，冲击榜单，拿高额奖金',
    signin: '登录',
    signup: '注册',
    copy: '复制',
    copySuccess: '已成功复制: {text}',
    copyFail: '复制失败',
    live: '视频直播',
    animate: '动画直播',
  },
  tours: {
    all: '全选',
    reverse: '反选',
    top5: '五大联赛'
  },
  index: {
    soccer: '竞彩足球',
    soccerdesc: '乐于足下',
    basketball: '竞彩篮球',
    basketballdesc: '精彩不断',
    online: '现场竞猜',
    onlinedesc: '边看边猜',
    recommend: '神单推荐',
    recommenddesc: '名利双收',
    live: '赛事直播',
    livedesc: '激情现场',
    news: '热门资讯',
    newsdesc: '最新消息',
    shop: '积分商城',
    shopdesc: '超值礼品',
    qxc: '七星彩',
    qxcdesc: '海南玩法',
    plw: '排列五',
    plwdesc: '海南玩法',
    agsports: '亚游体育',
    agsportsdesc: '海量比赛'
  },
  announcement: {
    detail: '消息详情',
    source: '来源',
    author: '作者',
    customer: '尊贵的亚游红彩贵宾：',
    welcome: '您好!'
  },
  news: {
    title: '热门资讯',
    detail: '新闻详情'
  },
  gurus: {
    title: '神单',
    blockTitle: '今日神单',
    focus: '关注',
    unfocus: '取消关注',
    fan: '粉丝',
    medal: '勋章',
    follow: '跟单',
    radix: '单倍',
    win: '已中奖',
    lose: '未中奖',
    footerWin: '中奖了 ~',
    footerLose: '很遗憾，未中奖～',
    ing: '进行中',
    tou: '投',
    bei: '倍',
    baseAmount: '2元',
    ledCount: '{value}人',
    programAmount: '方案金额',
    programState: '方案状态',
    followCount: '跟单数',
    followAmount: '跟单金额',
    bonus: '税后奖金',
    endtime: '截止时间',
    settletime: '预计开奖时间',
    createTime: '发单时间',
    descTitle: '竞彩大神说明',
    searchHolder: '输入大神昵称',
    explanTitle: '发起方案说明',
    explans: {
      1: '1、平台任何注册用户均可作为大神发起方案.',
      2: '2、支持发起竟彩足球和竞彩篮球大神方案，不限玩法，不限过关方式，但金额不得低于100元.',
      3: '3、投注竞彩足球和竞彩篮球串关成功后，如满足发起条件，在“订单”中该注单会提示“发起神单”，点击后即可发起大神推荐.',
      4: '4、竞彩篮球大神方案每天发起不能超过2个.',
      5: '5、发起大神方案时，串关内单场赔率不得低于1.5.',
      6: '6、场次内容完全相同不能重复发起大神方案.',
      7: '7、同一场比赛最多允许发起2个大神方案。',
    },
    rewardsTitle: '大神奖励机制',
    rewards: {
      1: '1、大神方案未中奖时，大神无奖励.',
      2: '2、大神方案中奖时，大神可抽取跟单用户所获奖金的5%作为奖励，同时获取亚游红彩的串关加奖.',
      3: '3、具体个人佣金扣除和奖励可在用户中心的资金明细査看.',
    },

    detailTitle: '方案详情',
    followLabel: '跟单列表',
    commission: '跟单佣金',
    betValue: '投 {value} 倍',
    lower: '-1',
    upper: '+1',
    submit: '确定',
    masterTitle: '大神资料',
    followSuccess: '跟单成功',
    followFail: '跟单错误,请稍后再试',
    profitOfWeek: '七日盈利率',
    hitOfWeek: '7天战绩',
    ledOfWeek: '累计带红',
    waitingSettle: '结算后公开',
    follower: '用户名',
    flAmount: '跟单金额(元)',
    flBonus: '税后金额(元)',
    flCommission: '佣金(元)',
    noFollow: '暂无跟单'
  },
  ranking: {
    descTitle: '榜单说明',
    profitLabel: '盈利率',
    hitLabel: '命中率',
    consecutiveLabel: '最高连红',
    ledLabel: '累计带红',
    profit: '盈利榜',
    profitDesc: {
      1: '1、当周（月）至少发起7 (30）个方案，以周（月）盈利率进行排序；若盈利率相同则按当周（月）命中率排序，命中率高者排前.',
      2: '2、总盈利率=总返还/总下注额',
      3: '3、这里统计的方案均为大神方案，不含自购方案及跟单方案.',
      4: '4、最多只展示前10名.',
      5: '5、不论发哪天的比赛，盈利率都以周（月）作为时间轴进行统计'
    },
    hit: '命中榜',
    hitDesc: {
      1: '1、当周（月）至少有7（30）个方案.以当周（月）命中所获积分总和进行排序，若积分相同则按发单数多少排序.单数多者排前，',
      2: '2、积分获取详情：',
      '2.1': '2串1=10分',
      '2.2': '3串1=20分',
      '2.3': '4串1=40分',
      '2.4': '5串1=80分',
      '2.5': '6串1=160分',
      '2.6': '7串1=320分',
      '2.7': '8串1=640分',
      '2.8': '9串1=1280分',
      '2.9': '10串1=2560分',
      3: '3、串关内单场赔率低于1.5不予统计。',
      4: '4、这里统计的方案均为大神方案，不含自购方案及跟单方案.',
      5: '5、最多只展示前10名.',
      6: '6、不论发哪天的比赛，命中榜都以周（月）作为时间轴进行积分统计.',
    },
    consecutive: '连红榜',
    consecutiveDesc: {
      1: '1、当周（月）至少有7（30）个方案.方案二连红即可上榜，连红越多排名越前；若连红数相同 则按当周（月）命中率排序，命中率高者排前.',
      2: '2、大神连红期间方案所含单场赔率低于1.5不予统计',
      3: '3、最多只展示前10名.',
      4: '4、这里统计的方案均为大神方案，不含自购方案及跟单方案.',
      5: '5、不论发哪天的比赛，连红都以周（月）作为时间轴进行统计.'
    },
    led: '带红榜',
    ledDesc: {
      1: '1、当周（月）至少有7（30）个方案.以方案累计带红人数进行排序，芾红人数即大神方案跟单中奖人数，若带红人数相同则按近7天命中率排序，命中率高者排前.',
      2: '2、最多展示前10名'
    },
    remark: '注',
    remarkDesc: {
      1: '1、当周是指数据统计周，时间范围：周一12:00至次周一11:59.',
      2: '2、当月是指数据统计月，时间范围：每月一号12:00至次月一号11:59.',
      3: '3、周榜每周三12:00进行更新，周榜奖金于每周四12:00进行发放;月榜每月三号12:00进行更新，月榜奖金于每月四号12:00进行发放.'
    }
  },
  profile: {
    balance: '可用余额',
    tips: '查看并编辑个人资料',
    saving: '充值',
    withdrawal: '提现',
    setting: '设置',
    task: '任务',
    verify: '手机验证',
    commission: '我的佣金',
    medal: '我的勋章',
    message: '站内消息',
    posted: '我的发单',
    records: '我的记录',
    amountrecords: '交易记录',
    shop: '积分商城',
    integral: '红彩积分',
    memberTitle: '个人信息',
    head: '头像',
    nickName: '昵称',
    sex: '性别',
    sex0: '女',
    sex1: '男',
    edit: '编辑',
    edithead: '修改头像',
    myfocus: '我的关注',
    myfans: '我的粉丝',
    guruCount: '可跟单数',
    level: 'VIP{value}',
    recentHit: '近{v1}中{v2}',
    highestHit: '{value}连红',
    masterName: '红彩大神',
    updateSuccess: '更新成功'
  },
  medal: {
    title: '我的勋章',
    led: '带红人数',
    consecutive: '最高连红',
    profit: '累计中奖',
    certificated: '认证大神',
    desc: '勋章规则说明',
    sname: '勋章',
    remark: '独有标识，官方认证',
    condition: '获取条件',
    rangeLabel: '统计范围',
    range: '仅限竞彩足球、竞彩篮球',
    ledCondition: '大神方案累计跟单中奖人数',
    consecutiveCondition: '大神方案最高连红记录，以发起大神推荐第一单开始统计',
    profitCondition: '大神方案、跟单和自购方案的累计中奖金额',
    certificatedCondition: '大神方案、跟单和自购方案的累计中奖金额与大神方案累计跟单中奖人数',
    timeLabel: '更新时间',
    updateTime: '实时更新'
  },
  betslip: {
    sporttery: '竞彩注单',
    gambling: '现场注单',
    time: {
      1: '7天内',
      2: '15天内',
      3: '30天内'
    },
    guruTitle: '发起大神方案，将在【今日大神】频道推广您的方案，彩民跟单中奖盈利后您可获得一定比例的佣金',
    guruHolder: '方案宣言能助你获得更多的跟单，字数在50字以内',
    publish: '确定发起',
    success: '发布成功',
    single: '单式',
    multi: '串关',
    bySelf: '自购',
    byFollow: '跟单',
    orderTimeLabel: '下单',
    bonus1: '参考奖金',
    bonus2: '返还奖金',
    bonus3: '预计返还',
    betAmount: '投注金额',
    detail: '串关详情',
    publish: '发起神单',
    guru: '查看神单',
    billno: '单号：',
    settled: '已结算',
    canceled: '已取消',
    ing: '未结算',
    serial: '第{value}期',
    monthly: '月排行',
    weekly: '周排行',
    0: {
      0: '进行中',
      1: '中奖',
      2: '未中奖',
      3: '自购',
      4: '跟单'
    },
    1: {
      0: '未结算',
      1: '已结算'
    }
  },
  errorPage: {
    403: {
      header: '访问禁止',
      content: '由于您所在的地区限制，您所尝试的网页现在无法打开。'
    },
    404: {
      header: '无效页面',
      content: '由于您所要访问的页面无效或者缺失，您所尝试的网页现在无法打开。'
    },
    500: {
      header: '网络错误',
      content: '由于服务器内部错误或网络原因，您所尝试的网页现在无法打开。'
    },
    csTip: '您可以通过以下方式联系我们的在线客服，由此给您带来的不便我们深表歉意。',
    callCs: '电话客服',
    hk: '香港热线(0.49元/分)',
    ph: '菲律宾热线(0.99元/分)',
    email: '邮箱',
    800: '800在线客服'
  },
  shop: {
    title: '积分商城',
    addressTitle: '收货地址',
    editTitle: '修改{field}',
    recipient: '收件人',
    tel: '电话',
    postCode: '邮编',
    address: '地址',
    holder: '立即填写',
    wrongContent: '内容填写不正确',
    addressSuccess: '更新成功',
    type: {
      1: '代金券',
      2: '现金券',
      3: '实物商品',
    },
    state: {
      1: '待发货',
      2: '已发货',
      3: '已签收',
      4: '已取消'
    },
    history: '兑换记录',
    billno: '兑换单号:',
    integral: '积分',
    time: '兑换时间',
    capacity: '商品规格',
    address: '收货地址',
    copybillno: '复制单号',
    needAddress: '请先完善收货地址',
    needCapacity: '请先选择商品规格',
    numNotEnough: '当前库存不足，敬请等待或选择其他商品兑换',
    integralNotEnough: '积分不足,请继续加油哟',
    success: '恭喜您，兑换成功',
    detailTitle: '商品详情',
    inventory: '库存{value}件',
    capacityLabel: '选择规格',
    color: '颜色',
    size: '尺寸',
    none: '无',
    prodDesc: '商品描述',
    prodSpecify: '规格参数',
    myIntegral: '当前积分',
    doRedeem: '立即兑换',
    useIntegral: '消耗积分',
    noAddress: '还未设置收货地址',
    setAddress: '立即设置'
  },
  categories: {
    all: '全部',
    1: '主要玩法',
    2: '亚洲玩法',
    3: '半场玩法',
    4: '附加玩法',
    5: '角球玩法',
    6: '罚牌玩法',
    7: '单节玩法'
  },
  qxc: {
    types: {
      11: '一定玩法',
      12: '两定玩法',
      13: '三定玩法',
      14: '四定玩法',
      21: '二字现',
      22: '三字现',
      30: '大小单双',
      31: '总和',
      32: '前二',
      33: '前三',
      34: '后二',
      35: '后三',
      36: '千位',
      37: '百位',
      38: '十位',
      39: '个位'
    }
  }
}
