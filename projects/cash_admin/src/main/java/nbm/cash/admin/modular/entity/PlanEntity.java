package nbm.cash.admin.modular.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

/**
 * @program: cash_admin
 * @description: 方案Entity
 * @author: Mr.Nat
 * @create: 2019-12-20 11:29
 **/
@Document(collection = "bet")
public class PlanEntity extends BetEntity{

    /**方案标题*/
    private String  planTitle;

    /**方案描述*/
    private String  planContent;

    /**方案所收佣金*/
    private BigDecimal recCommission;

    /**跟单数*/
    private int followCount;

    /**跟单金额*/
    private BigDecimal followAmount;

    /**是否抽佣*/
    private int isRake;

    /**佣金比例*/
    private Double rakeRate;

    /**截止跟单时间*/
    private Long displayTime;

    /**方案时间*/
    private Long planTime;

    /**
     * 方案状态：0待审核，1已审核通过，2未通过审核，不能显示
     */
    private Integer planState;

    /**审批人*/
    private String auditUserId;

    /**审批时间*/
    private Long auditTime;

    /**是否置顶*/
    private Integer isTop;

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

    public BigDecimal getRecCommission() {
        return recCommission;
    }

    public void setRecCommission(BigDecimal recCommission) {
        this.recCommission = recCommission;
    }

    public int getFollowCount() {
        return followCount;
    }

    public void setFollowCount(int followCount) {
        this.followCount = followCount;
    }

    public BigDecimal getFollowAmount() {
        return followAmount;
    }

    public void setFollowAmount(BigDecimal followAmount) {
        this.followAmount = followAmount;
    }

    public int getIsRake() {
        return isRake;
    }

    public void setIsRake(int isRake) {
        this.isRake = isRake;
    }

    public Double getRakeRate() {
        return rakeRate;
    }

    public void setRakeRate(Double rakeRate) {
        this.rakeRate = rakeRate;
    }

    public Long getDisplayTime() {
        return displayTime;
    }

    public void setDisplayTime(Long displayTime) {
        this.displayTime = displayTime;
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

    public String getAuditUserId() {
        return auditUserId;
    }

    public void setAuditUserId(String auditUserId) {
        this.auditUserId = auditUserId;
    }

    public Long getAuditTime() {
        return auditTime;
    }

    public void setAuditTime(Long auditTime) {
        this.auditTime = auditTime;
    }

    public Integer getIsTop() {
        return isTop;
    }

    public void setIsTop(Integer isTop) {
        this.isTop = isTop;
    }
}
