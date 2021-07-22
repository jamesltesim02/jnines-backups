package nbm.cash.seamless.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

/**
 * @Description 奖金日志记录
 * @ClassName BonusLogEntity
 * @Author New
 * @Date 2019/11/28 14:09
 * @Version V1.0
 **/
@Document(collection = "bonus_log")
public class BonusLogEntity {

    /**
     * MongoDB自带字段
     */
    private String _id;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 注单ID
     */
    private Long ticketId;

    /**
     * 奖金金额
     */
    private BigDecimal bonusAmount;

    /**
     * 生成时间
     */
    private Long createTime;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public BigDecimal getBonusAmount() {
        return bonusAmount;
    }

    public void setBonusAmount(BigDecimal bonusAmount) {
        this.bonusAmount = bonusAmount;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
}