package nbm.cash.admin.modular.entity;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Description 积分日志
 * @ClassName IntegralLogEntity
 * @Author New
 * @Date 2019/11/28 14:10
 * @Version V1.0
 **/
@Document(collection = "integral_log")
public class IntegralLogEntity {

    /**
     * MongoDB自带ID
     */
    private String _id;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 积分
     */
    private Integer integral;

    /**
     * 积分来源：1为投注赠送，2为活动赠送，3为兑换积分商品扣除
     */
    private Integer type;

    /**
     * 关联ID：投注ID或活动ID
     */
    private String relationId;

    /**
     * 创建时间
     */
    private Long createTime;

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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getIntegral() {
        return integral;
    }

    public void setIntegral(Integer integral) {
        this.integral = integral;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getRelationId() {
        return relationId;
    }

    public void setRelationId(String relationId) {
        this.relationId = relationId;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}