package nbm.cash.admin.modular.entity;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @program: cash_admin
 * @description: 方案变更记录
 * @author: Mr.Nat
 * @create: 2019-12-23 18:29
 **/
@Document(collection = "planChangeRecord")
public class PlanChangeRecordEntity {

    /**更改人*/
    private String userId;

    /**方案Id*/
    private String ticketId;

    /**
     * 更改类型（1 置顶  2 修改方案内容 3 审批）
     */
    private Integer changeType;

    /**修改前内容*/
    private String oidContent;

    /**修改后内容*/
    private String newContent;

    /**置顶或取消*/
    private Integer isTop;

    /**审批(通过或拒绝)*/
    private Integer planState;

    /**更改时间*/
    private Long updateTime;

    /**备注（更改意见）*/
    private String  remark;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public Integer getChangeType() {
        return changeType;
    }

    public void setChangeType(Integer changeType) {
        this.changeType = changeType;
    }

    public String getOidContent() {
        return oidContent;
    }

    public void setOidContent(String oidContent) {
        this.oidContent = oidContent;
    }

    public String getNewContent() {
        return newContent;
    }

    public void setNewContent(String newContent) {
        this.newContent = newContent;
    }

    public Integer getIsTop() {
        return isTop;
    }

    public void setIsTop(Integer isTop) {
        this.isTop = isTop;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getPlanState() {
        return planState;
    }

    public void setPlanState(Integer planState) {
        this.planState = planState;
    }
}
