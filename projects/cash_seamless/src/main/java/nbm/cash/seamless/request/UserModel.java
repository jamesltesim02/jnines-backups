package nbm.cash.seamless.request;

import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document(collection = "user")
public class UserModel {
    /**
     * 用户id
     */
    private String userId;

    /**
     * 用户名称
     */
    private String userName;

    /**
     * 密码
     */
    private String passWord;

    /**
     * 用户昵称
     */
    private String nickName;

    /**
     * 用户生日
     */
    private String birthday;

    /**
     * 性别
     */
    private Integer sex;

    /**
     * 用户头像
     */
    private String header;

    /**
     * 电话
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 标签
     */
    private String tags;

    /**
     * 个性签名
     */
    private String sign;

    /**
     * 余额
     */
    private BigDecimal balance;

    /**
     * 锁定额度
     */
    private BigDecimal lockAmount;

    /**
     * 可提款额度
     */
    private BigDecimal usableDrawBalance;

    /**
     * 状态
     */
    private Integer state;

    /**
     * 创建时间
     */
    private Long createTime;

    /**
     * 最后登录时间
     */
    private Long lastSignInTime;

    /**
     * 用户类型
     */
    private Integer userType;

    /**
     * 用户等级
     */
    private Integer userLevel;

    /**
     * 邀请码
     */
    private String inviteCode;

    /**
     * 代理域名
     */
    private String proxyDomain;

    /**
     * 父级id
     */
    private Long parentId;

    /**
     * 粉丝数
     */
    private Integer fansCount;

    /**
     * 关注数
     */
    private Integer focusCount;

    /**
     * 佣金
     */
    private BigDecimal commission;

    /**
     * 总单数
     */
    private Integer betCount;

    /**
     * 总方案数
     */
    private Integer totalPlan;

    /**
     * 可跟单方案数
     */
    private Integer usablePlan;

    /**
     * 赢的方案数
     */
    private Integer winPlanCount;

    /**
     * 总投注额
     */
    private BigDecimal totalBetAmount;

    /**
     * 方案投注额
     */
    private BigDecimal planBetAmount;

    /**
     * 总返还金额
     */
    private BigDecimal totalReturn;

    /**
     * 方案返还金额
     */
    private BigDecimal planReturn;

    /**
     * 命中率
     */
    private BigDecimal betRate;

    /**
     * 发单命中率
     */
    private BigDecimal planRate;

    /**
     * 总返还率
     */
    private BigDecimal betReturnRate;

    /**
     * 方案返还率
     */
    private BigDecimal planReturnRate;

    /**
     * 历史最高连红
     */
    private Integer historyHit;

    /**
     * 当前连红
     */
    private Integer currentHit;

    /**
     * 累计带红人数
     */
    private Integer totalLongRed;

    /**
     * 备注
     */
    private String note;

    /**
     * 用户ID(NBMM)
     */
    private Long nbmmUserId;

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

    public String getPassWord() {
        return passWord;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
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

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
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

    public BigDecimal getPlanReturn() {
        return planReturn;
    }

    public void setPlanReturn(BigDecimal planReturn) {
        this.planReturn = planReturn;
    }

    public BigDecimal getBetRate() {
        return betRate;
    }

    public void setBetRate(BigDecimal betRate) {
        this.betRate = betRate;
    }

    public BigDecimal getPlanRate() {
        return planRate;
    }

    public void setPlanRate(BigDecimal planRate) {
        this.planRate = planRate;
    }

    public BigDecimal getBetReturnRate() {
        return betReturnRate;
    }

    public void setBetReturnRate(BigDecimal betReturnRate) {
        this.betReturnRate = betReturnRate;
    }

    public BigDecimal getPlanReturnRate() {
        return planReturnRate;
    }

    public void setPlanReturnRate(BigDecimal planReturnRate) {
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    @Override
    public String toString() {
        return "UserModel{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", passWord='" + passWord + '\'' +
                ", nickName='" + nickName + '\'' +
                ", birthday='" + birthday + '\'' +
                ", sex=" + sex +
                ", header='" + header + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", tags='" + tags + '\'' +
                ", sign='" + sign + '\'' +
                ", balance=" + balance +
                ", lockAmount=" + lockAmount +
                ", usableDrawBalance=" + usableDrawBalance +
                ", state=" + state +
                ", createTime=" + createTime +
                ", lastSignInTime=" + lastSignInTime +
                ", userType=" + userType +
                ", userLevel=" + userLevel +
                ", inviteCode='" + inviteCode + '\'' +
                ", proxyDomain='" + proxyDomain + '\'' +
                ", parentId=" + parentId +
                ", fansCount=" + fansCount +
                ", focusCount=" + focusCount +
                ", commission=" + commission +
                ", betCount=" + betCount +
                ", totalPlan=" + totalPlan +
                ", usablePlan=" + usablePlan +
                ", winPlanCount=" + winPlanCount +
                ", totalBetAmount=" + totalBetAmount +
                ", planBetAmount=" + planBetAmount +
                ", totalReturn=" + totalReturn +
                ", planReturn=" + planReturn +
                ", betRate=" + betRate +
                ", planRate=" + planRate +
                ", betReturnRate=" + betReturnRate +
                ", planReturnRate=" + planReturnRate +
                ", historyHit=" + historyHit +
                ", currentHit=" + currentHit +
                ", totalLongRed=" + totalLongRed +
                ", note='" + note + '\'' +
                '}';
    }
}
