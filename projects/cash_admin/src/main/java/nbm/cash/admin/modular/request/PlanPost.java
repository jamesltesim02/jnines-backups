package nbm.cash.admin.modular.request;

/**
 * @program: cash_admin
 * @description: 方案查询参数
 * @author: Mr.Nat
 * @create: 2019-12-20 11:00
 **/
public class PlanPost extends BasePost {

    /**方案id*/
    private String ticketId;
    /**用户id*/
    private String userId;
    /**投注时间*/
    private Long betTime;
    /**注单状态*/
    private Integer betState;
    /**结算状态*/
    private Integer settleResult;
    /**审批人*/
    private String auditUserId;
    /**审批时间*/
    private Long auditTime;
    /**是否置顶*/
    private Integer isTop;
    /**方案状态*/
    private Integer planState;
    /**方案内容*/
    private String planContent;
    /**备注（更改意见）*/
    private String  remark;

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getBetTime() {
        return betTime;
    }

    public void setBetTime(Long betTime) {
        this.betTime = betTime;
    }

    public Integer getBetState() {
        return betState;
    }

    public void setBetState(Integer betState) {
        this.betState = betState;
    }

    public Integer getSettleResult() {
        return settleResult;
    }

    public void setSettleResult(Integer settleResult) {
        this.settleResult = settleResult;
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

    public Integer getPlanState() {
        return planState;
    }

    public void setPlanState(Integer planState) {
        this.planState = planState;
    }

    public String getPlanContent() {
        return planContent;
    }

    public void setPlanContent(String planContent) {
        this.planContent = planContent;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
