package nbm.cash.seamless.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

/**
 * @Description 注单模型
 * @ClassName BetEntity
 * @Author New
 * @Date 2019/11/12 13:51
 * @Version V1.0
 **/

@Document(collection = "bet")
public class BetEntity {

    /**
     * MongoDB自带ID字段
     */
    private String _id;

    /**
     * 注单ID
     */
    private String ticketId;

    /**
     * 用户ID(NBMM)
     */
    private Long nbmmUserId;

    /**
     * 用户ID(商户)
     */
    private String userId;

    /**
     * 货币
     */
    private Integer currency;

    /**
     * 注单金额
     */
    private BigDecimal betAmount;

    /**
     * 注单类型
     */
    private Integer betType;

    /**
     * 1为滚球注单，0为竞彩注单
     */
    private Integer liveType;

    /**
     * 下注时间
     */
    private Long betTime;

    /**
     * 结算金额
     */
    private BigDecimal settlement;

    /**
     * 预计返还金额
     */
    private BigDecimal expectPay = BigDecimal.ZERO;

    /**
     * 结算结果
     */
    private Integer settleResult;

    /**
     * 状态（结算状态）
     */
    private Integer betState;

    /**
     * 奖金
     */
    private BigDecimal bonus;

    /**
     * 投注IP
     */
    private String ip;

    /**
     * 域名
     */
    private String doMain;

    /**
     * 客户端类型
     */
    private Integer clientType;

    /**
     * 订单类型：1=普通注单，2=方案，3=跟单
     */
    private Integer ticketType;

    /**
     * 方案标题
     */
    private String planTitle;

    /**
     * 方案内容
     */
    private String planContent;

    /**
     * 方案时间
     */
    private Long planTime;

    /**
     * 方案状态：0待审核，1已审核通过，2未通过审核，不能显示
     */
    private Integer planState;

    /**
     * 审核时间
     */
    private Long auditTime;

    /**
     * 审核人ID
     */
    private String auditUserId;

    /**
     * 方案所收佣金
     */
    private BigDecimal recCommission;

    /**
     * 跟单所付佣金
     */
    private BigDecimal payCommission;

    /**
     * 跟单数
     */
    private Integer followCount;

    /**
     * 跟单总金额
     */
    private BigDecimal followAmount;

    /**
     * 截止跟单时间
     */
    private Long displayTime;

    /**
     * 是否抽佣
     */
    private Integer isRake;

    /**
     * 佣金比率
     */
    private Double rakeRate;

    /**
     * 是否晒单
     */
    private Integer isShare;

    /**
     * 晒单标题
     */
    private String shareTitle;

    /**
     * 晒单内容
     */
    private String shareContent;

    /**
     * 晒单时间
     */
    private Long shareTime;

    /**
     * 跟单ID
     */
    private String followTicket;

    /**
     * 保底赔率
     */
    private Double ensureOdds;

    /**
     * 最低跟单金额
     */
    private BigDecimal minFollowAmount;

    /**
     * 串注详情：Json格式
     */
    private String bets;

    /**
     * 投注项详情：Json格式
     */
    private String options;

    /**
     * 是否置顶
     */
    private Integer isTop = 0;

    /**
     * 勋章值
     */
    private Integer medalLevel;

    /**
     * 体育类型
     */
    private Integer sportId;

    public Integer getSportId() {
        return sportId;
    }

    public void setSportId(Integer sportId) {
        this.sportId = sportId;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
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

    public Integer getCurrency() {
        return currency;
    }

    public void setCurrency(Integer currency) {
        this.currency = currency;
    }

    public BigDecimal getBetAmount() {
        return betAmount;
    }

    public void setBetAmount(BigDecimal betAmount) {
        this.betAmount = betAmount;
    }

    public Integer getBetType() {
        return betType;
    }

    public void setBetType(Integer betType) {
        this.betType = betType;
    }

    public Integer getLiveType() {
        return liveType;
    }

    public void setLiveType(Integer liveType) {
        this.liveType = liveType;
    }

    public Long getBetTime() {
        return betTime;
    }

    public void setBetTime(Long betTime) {
        this.betTime = betTime;
    }

    public BigDecimal getSettlement() {
        return settlement;
    }

    public void setSettlement(BigDecimal settlement) {
        this.settlement = settlement;
    }

    public BigDecimal getExpectPay() {
        return expectPay;
    }

    public void setExpectPay(BigDecimal expectPay) {
        this.expectPay = expectPay;
    }

    public Integer getSettleResult() {
        return settleResult;
    }

    public void setSettleResult(Integer settleResult) {
        this.settleResult = settleResult;
    }

    public Integer getBetState() {
        return betState;
    }

    public void setBetState(Integer betState) {
        this.betState = betState;
    }

    public BigDecimal getBonus() {
        return bonus;
    }

    public void setBonus(BigDecimal bonus) {
        this.bonus = bonus;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getDoMain() {
        return doMain;
    }

    public void setDoMain(String doMain) {
        this.doMain = doMain;
    }

    public Integer getClientType() {
        return clientType;
    }

    public void setClientType(Integer clientType) {
        this.clientType = clientType;
    }

    public Integer getTicketType() {
        return ticketType;
    }

    public void setTicketType(Integer ticketType) {
        this.ticketType = ticketType;
    }

    public String getPlanTitle() {
        return planTitle;
    }

    public void setPlanTitle(String planTitle) {
        this.planTitle = planTitle;
    }

    public String getPlanContent() {
        return planContent;
    }

    public void setPlanContent(String planContent) {
        this.planContent = planContent;
    }

    public Long getPlanTime() {
        return planTime;
    }

    public void setPlanTime(Long planTime) {
        this.planTime = planTime;
    }

    public Integer getPlanState() {
        return planState;
    }

    public void setPlanState(Integer planState) {
        this.planState = planState;
    }

    public Long getAuditTime() {
        return auditTime;
    }

    public void setAuditTime(Long auditTime) {
        this.auditTime = auditTime;
    }

    public String getAuditUserId() {
        return auditUserId;
    }

    public void setAuditUserId(String auditUserId) {
        this.auditUserId = auditUserId;
    }

    public BigDecimal getRecCommission() {
        return recCommission;
    }

    public void setRecCommission(BigDecimal recCommission) {
        this.recCommission = recCommission;
    }

    public BigDecimal getPayCommission() {
        return payCommission;
    }

    public void setPayCommission(BigDecimal payCommission) {
        this.payCommission = payCommission;
    }

    public Integer getFollowCount() {
        return followCount;
    }

    public void setFollowCount(Integer followCount) {
        this.followCount = followCount;
    }

    public BigDecimal getFollowAmount() {
        return followAmount;
    }

    public void setFollowAmount(BigDecimal followAmount) {
        this.followAmount = followAmount;
    }

    public Long getDisplayTime() {
        return displayTime;
    }

    public void setDisplayTime(Long displayTime) {
        this.displayTime = displayTime;
    }

    public Integer getIsRake() {
        return isRake;
    }

    public void setIsRake(Integer isRake) {
        this.isRake = isRake;
    }

    public Double getRakeRate() {
        return rakeRate;
    }

    public void setRakeRate(Double rakeRate) {
        this.rakeRate = rakeRate;
    }

    public Integer getIsShare() {
        return isShare;
    }

    public void setIsShare(Integer isShare) {
        this.isShare = isShare;
    }

    public String getShareTitle() {
        return shareTitle;
    }

    public void setShareTitle(String shareTitle) {
        this.shareTitle = shareTitle;
    }

    public String getShareContent() {
        return shareContent;
    }

    public void setShareContent(String shareContent) {
        this.shareContent = shareContent;
    }

    public Long getShareTime() {
        return shareTime;
    }

    public void setShareTime(Long shareTime) {
        this.shareTime = shareTime;
    }

    public String getFollowTicket() {
        return followTicket;
    }

    public void setFollowTicket(String followTicket) {
        this.followTicket = followTicket;
    }

    public Double getEnsureOdds() {
        return ensureOdds;
    }

    public void setEnsureOdds(Double ensureOdds) {
        this.ensureOdds = ensureOdds;
    }

    public BigDecimal getMinFollowAmount() {
        return minFollowAmount;
    }

    public void setMinFollowAmount(BigDecimal minFollowAmount) {
        this.minFollowAmount = minFollowAmount;
    }

    public String getBets() {
        return bets;
    }

    public void setBets(String bets) {
        this.bets = bets;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public Integer getIsTop() {
        return isTop;
    }

    public void setIsTop(Integer isTop) {
        this.isTop = isTop;
    }

    public Integer getMedalLevel() {
        return medalLevel;
    }

    public void setMedalLevel(Integer medalLevel) {
        this.medalLevel = medalLevel;
    }
}