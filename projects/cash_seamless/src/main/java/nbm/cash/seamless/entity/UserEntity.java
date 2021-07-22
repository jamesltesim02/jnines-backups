package nbm.cash.seamless.entity;

import com.alibaba.fastjson.JSON;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

/**
 * @Description 用户表
 * @ClassName UserEntity
 * @Author New
 * @Date 2019/11/15 14:09
 * @Version V1.0
 **/
@Document(collection = "user")
public class UserEntity {

    /**
     * Mongo必须自带的id字段
     */
    private String _id;

    /**
     * 用户ID(NBMM)
     */
    private Long nbmmUserId;

    /**
     * 用户ID(商户)
     */
    private String userId;

    private String uid;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 生日
     */
    private String birthday;

    /**
     * 性别
     */
    private Integer sex = 1;

    /**
     * 头像
     */
    private String header = "0";

    /**
     * 电话
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 用户标签
     */
    private String tags;

    /**
     * 签名
     */
    private String sign;

    /**
     * 余额
     */
    private BigDecimal balance = BigDecimal.ZERO;

    /**
     * 币种
     */
    private Integer currency = 1;

    /**
     * 锁定余额
     */
    private BigDecimal lockAmount = BigDecimal.ZERO;

    /**
     * 可取余额
     */
    private BigDecimal usableDrawBalance = BigDecimal.ZERO;

    /**
     * 状态：1=正常，2=锁定
     */
    private Integer userState = 1;

    /**
     * 创建时间
     */
    private Long createTime;

    /**
     * 最后登录时间
     */
    private Long lastSignInTime;

    /**
     * 是否为测试账号：1=正常用户，2=测试用户，3=机器人
     */
    private Integer userType = 1;

    /**
     * 用户等级
     */
    private Integer userLevel = 1;

    /**
     * 用户邀请码
     */
    private String inviteCode;

    /**
     * 用户代理域名
     */
    private String proxyDomain;

    /**
     * 父级ID
     */
    private Long parentId;

    /**
     * 粉丝数
     */
    private Integer fansCount = 0;

    /**
     * 关注数
     */
    private Integer focusCount = 0;

    /**
     * 奖金:用户方案中奖，除去正常的结算，以及返佣以外，额外给的奖励
     */
    private BigDecimal bonus;

    /**
     * 佣金:用户方案中奖后，抽取跟单用户的佣金总和
     */
    private BigDecimal commission = BigDecimal.ZERO;

    /**
     * 总单数:用户所有的下单总数
     */
    private Integer betCount = 0;

    /**
     * 最近10场战绩:近10单方案的中奖单数
     */
    private String recentHit = "0-0";

    /**
     * 总方案数:所发方案的总数
     */
    private Integer totalPlan = 0;

    /**
     * 可跟单方案数
     */
    private Integer usablePlan = 0;

    /**
     * 赢的单数
     */
    private Integer winBetCount = 0;

    /**
     * 赢的方案数
     */
    private Integer winPlanCount = 0;

    /**
     * 总投注额
     */
    private BigDecimal totalBetAmount = BigDecimal.ZERO;

    /**
     * 方案投注额
     */
    private BigDecimal planBetAmount = BigDecimal.ZERO;

    /**
     * 总返还金额
     */
    private BigDecimal totalReturn = BigDecimal.ZERO;

    /**
     * 总中奖金额
     */
    private BigDecimal totalWinAmount = BigDecimal.ZERO;

    /**
     * 方案返还金额
     */
    private BigDecimal planReturn = BigDecimal.ZERO;

    /**
     * 命中率：总命中率，包含所有注单
     */
    private Double betRate = 0.0;

    /**
     * 发单命中率：只计算所发方案
     */
    private Double planRate = 0.0;

    /**
     * 总返还率
     */
    private Double betReturnRate = 0.0;

    /**
     * 方案返还率
     */
    private Double planReturnRate = 0.0;

    /**
     * 历史最高连红
     */
    private Integer historyHit = 0;

    /**
     * 当前连红
     */
    private Integer currentHit = 0;

    /**
     * 累计带红人数
     */
    private Integer totalLongRed = 0;

    /**
     * 周、月统计用数据
     */
    private String weekMonthData = JSON.toJSONString(new WeekMonthData());

    /**
     * 月命中率
     */
    private Double betRateMonth = 0.0;

    /**
     * 周命中率
     */
    private Double betRateWeek = 0.0;

    /**
     * 月盈利率
     */
    private Double betReturnRateMonth = 0.0;

    /**
     * 周盈利率
     */
    private Double betReturnRateWeek = 0.0;

    /**
     * 月连红
     */
    private Integer monthHit = 0;

    /**
     * 周连红
     */
    private Integer weekHit = 0;

    /**
     * 月带红
     */
    private Integer monthRed = 0;

    /**
     * 周带红
     */
    private Integer weekRed = 0;

    /**
     * 积分
     */
    private Integer integral = 0;

    /**
     * 当周已结算单数
     */
    private Integer settleWeek = 0;

    /**
     * 当周已结算单数
     */
    private Integer settleMonth = 0;

    /**
     * 勋章
     */
    private String medal = JSON.toJSONString(new MedalEntity());

    /**
     * 备注
     */
    private String note;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public Long getNbmmUserId() {
        return nbmmUserId;
    }

    public void setNbmmUserId(Long nbmmUserId) {
        this.nbmmUserId = nbmmUserId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Integer getCurrency() {
        return currency;
    }

    public void setCurrency(Integer currency) {
        this.currency = currency;
    }

    public BigDecimal getLockAmount() {
        return lockAmount;
    }

    public void setLockAmount(BigDecimal lockAmount) {
        this.lockAmount = lockAmount;
    }

    public BigDecimal getUsableDrawBalance() {
        return usableDrawBalance;
    }

    public void setUsableDrawBalance(BigDecimal usableDrawBalance) {
        this.usableDrawBalance = usableDrawBalance;
    }

    public Integer getUserState() {
        return userState;
    }

    public void setUserState(Integer userState) {
        this.userState = userState;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getLastSignInTime() {
        return lastSignInTime;
    }

    public void setLastSignInTime(Long lastSignInTime) {
        this.lastSignInTime = lastSignInTime;
    }

    public Integer getUserType() {
        return userType;
    }

    public void setUserType(Integer userType) {
        this.userType = userType;
    }

    public Integer getUserLevel() {
        return userLevel;
    }

    public void setUserLevel(Integer userLevel) {
        this.userLevel = userLevel;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public String getProxyDomain() {
        return proxyDomain;
    }

    public void setProxyDomain(String proxyDomain) {
        this.proxyDomain = proxyDomain;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Integer getFansCount() {
        return fansCount;
    }

    public void setFansCount(Integer fansCount) {
        this.fansCount = fansCount;
    }

    public Integer getFocusCount() {
        return focusCount;
    }

    public void setFocusCount(Integer focusCount) {
        this.focusCount = focusCount;
    }

    public BigDecimal getCommission() {
        return commission;
    }

    public void setCommission(BigDecimal commission) {
        this.commission = commission;
    }

    public Integer getBetCount() {
        return betCount;
    }

    public void setBetCount(Integer betCount) {
        this.betCount = betCount;
    }

    public String getRecentHit() {
        return recentHit;
    }

    public void setRecentHit(String recentHit) {
        this.recentHit = recentHit;
    }

    public Integer getTotalPlan() {
        return totalPlan;
    }

    public void setTotalPlan(Integer totalPlan) {
        this.totalPlan = totalPlan;
    }

    public Integer getUsablePlan() {
        return usablePlan;
    }

    public void setUsablePlan(Integer usablePlan) {
        this.usablePlan = usablePlan;
    }

    public Integer getWinBetCount() {
        return winBetCount;
    }

    public void setWinBetCount(Integer winBetCount) {
        this.winBetCount = winBetCount;
    }

    public Integer getWinPlanCount() {
        return winPlanCount;
    }

    public void setWinPlanCount(Integer winPlanCount) {
        this.winPlanCount = winPlanCount;
    }

    public BigDecimal getTotalBetAmount() {
        return totalBetAmount;
    }

    public void setTotalBetAmount(BigDecimal totalBetAmount) {
        this.totalBetAmount = totalBetAmount;
    }

    public BigDecimal getPlanBetAmount() {
        return planBetAmount;
    }

    public void setPlanBetAmount(BigDecimal planBetAmount) {
        this.planBetAmount = planBetAmount;
    }

    public BigDecimal getTotalReturn() {
        return totalReturn;
    }

    public void setTotalReturn(BigDecimal totalReturn) {
        this.totalReturn = totalReturn;
    }

    public BigDecimal getTotalWinAmount() {
        return totalWinAmount;
    }

    public void setTotalWinAmount(BigDecimal totalWinAmount) {
        this.totalWinAmount = totalWinAmount;
    }

    public BigDecimal getPlanReturn() {
        return planReturn;
    }

    public void setPlanReturn(BigDecimal planReturn) {
        this.planReturn = planReturn;
    }

    public Double getBetRate() {
        return betRate;
    }

    public void setBetRate(Double betRate) {
        this.betRate = betRate;
    }

    public Double getPlanRate() {
        return planRate;
    }

    public void setPlanRate(Double planRate) {
        this.planRate = planRate;
    }

    public Double getBetReturnRate() {
        return betReturnRate;
    }

    public void setBetReturnRate(Double betReturnRate) {
        this.betReturnRate = betReturnRate;
    }

    public Double getPlanReturnRate() {
        return planReturnRate;
    }

    public void setPlanReturnRate(Double planReturnRate) {
        this.planReturnRate = planReturnRate;
    }

    public Integer getHistoryHit() {
        return historyHit;
    }

    public void setHistoryHit(Integer historyHit) {
        this.historyHit = historyHit;
    }

    public Integer getCurrentHit() {
        return currentHit;
    }

    public void setCurrentHit(Integer currentHit) {
        this.currentHit = currentHit;
    }

    public Integer getTotalLongRed() {
        return totalLongRed;
    }

    public void setTotalLongRed(Integer totalLongRed) {
        this.totalLongRed = totalLongRed;
    }

    public String getWeekMonthData() {
        return weekMonthData;
    }

    public void setWeekMonthData(String weekMonthData) {
        this.weekMonthData = weekMonthData;
    }

    public Double getBetRateMonth() {
        return betRateMonth;
    }

    public void setBetRateMonth(Double betRateMonth) {
        this.betRateMonth = betRateMonth;
    }

    public Double getBetRateWeek() {
        return betRateWeek;
    }

    public void setBetRateWeek(Double betRateWeek) {
        this.betRateWeek = betRateWeek;
    }

    public Double getBetReturnRateMonth() {
        return betReturnRateMonth;
    }

    public void setBetReturnRateMonth(Double betReturnRateMonth) {
        this.betReturnRateMonth = betReturnRateMonth;
    }

    public Double getBetReturnRateWeek() {
        return betReturnRateWeek;
    }

    public void setBetReturnRateWeek(Double betReturnRateWeek) {
        this.betReturnRateWeek = betReturnRateWeek;
    }

    public Integer getMonthHit() {
        return monthHit;
    }

    public void setMonthHit(Integer monthHit) {
        this.monthHit = monthHit;
    }

    public Integer getWeekHit() {
        return weekHit;
    }

    public void setWeekHit(Integer weekHit) {
        this.weekHit = weekHit;
    }

    public Integer getMonthRed() {
        return monthRed;
    }

    public void setMonthRed(Integer monthRed) {
        this.monthRed = monthRed;
    }

    public Integer getWeekRed() {
        return weekRed;
    }

    public void setWeekRed(Integer weekRed) {
        this.weekRed = weekRed;
    }

    public Integer getIntegral() {
        return integral;
    }

    public void setIntegral(Integer integral) {
        this.integral = integral;
    }

    public Integer getSettleWeek() {
        return settleWeek;
    }

    public void setSettleWeek(Integer settleWeek) {
        this.settleWeek = settleWeek;
    }

    public Integer getSettleMonth() {
        return settleMonth;
    }

    public void setSettleMonth(Integer settleMonth) {
        this.settleMonth = settleMonth;
    }

    public String getMedal() {
        return medal;
    }

    public void setMedal(String medal) {
        this.medal = medal;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
}
