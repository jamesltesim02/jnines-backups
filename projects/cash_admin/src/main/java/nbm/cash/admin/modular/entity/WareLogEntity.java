package nbm.cash.admin.modular.entity;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Description
 * @ClassName WareLogEntity
 * @Author New
 * @Date 2019/12/13 18:59
 * @Version V1.0
 **/
@Document(collection = "ware_log")
public class WareLogEntity {

    /**
     * MongoDB自带ID
     */
    private String _id;

    /**
     * 商品ID
     */
    private String wareId;

    /**
     * 兑换商品数量
     */
    private Integer num;

    /**
     * 兑换商品用户ID
     */
    private String userId;

    /**
     * 兑换时间
     */
    private Long createTime;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getWareId() {
        return wareId;
    }

    public void setWareId(String wareId) {
        this.wareId = wareId;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
}