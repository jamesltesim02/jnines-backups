package nbm.cash.seamless.entity;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Description 商品表
 * @ClassName CommodityEntity
 * @Author New
 * @Date 2019/11/29 16:20
 * @Version V1.0
 **/
@Document(collection = "ware")
public class WareEntity {

    /**
     * MongoDB自带ID
     */
    private String _id;

    /**
     * 商品名称
     */
    private String name;

    /**
     * 商品图片
     */
    private String photo;

    /**
     * 商品库存
     */
    private Integer inventory;

    /**
     * 兑换所需积分
     */
    private Integer needIntegral;

    /**
     * 商品类型:代金券，现金券，实物商品
     */
    private Integer type;

    /**
     * 商品状态
     */
    private Integer state = 1;

    /**
     * 商品上线日期
     */
    private Long createTime;

    /**
     * 有效期开始
     */
    private Long validTimeStart;

    /**
     * 有效期结束
     */
    private Long validTimeEnd;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Integer getInventory() {
        return inventory;
    }

    public void setInventory(Integer inventory) {
        this.inventory = inventory;
    }

    public Integer getNeedIntegral() {
        return needIntegral;
    }

    public void setNeedIntegral(Integer needIntegral) {
        this.needIntegral = needIntegral;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
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

    public Long getValidTimeStart() {
        return validTimeStart;
    }

    public void setValidTimeStart(Long validTimeStart) {
        this.validTimeStart = validTimeStart;
    }

    public Long getValidTimeEnd() {
        return validTimeEnd;
    }

    public void setValidTimeEnd(Long validTimeEnd) {
        this.validTimeEnd = validTimeEnd;
    }
}