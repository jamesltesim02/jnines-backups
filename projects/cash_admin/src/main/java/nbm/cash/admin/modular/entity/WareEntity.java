package nbm.cash.admin.modular.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

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
    private String wareName;

    /**
     * 商品图片(列表显示)
     */
    private String photo;

    private List<String> bannerList;

    /**
     * 颜色列表
     */
    private List<WareColor> wareColor;

    /**
     * 尺寸
     */
    private List<String> size;

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
     * 有效期开始
     */
    private Long validStart;

    /**
     * 有效期结束
     */
    private Long validEnd;

    /**
     * 创建商品的用户ID
     */
    private String userId;

    /**
     * 商品上线日期
     */
    private Long createTime;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getWareName() {
        return wareName;
    }

    public void setWareName(String wareName) {
        this.wareName = wareName;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public List<WareColor> getWareColor() {
        return wareColor;
    }

    public void setWareColor(List<WareColor> wareColor) {
        this.wareColor = wareColor;
    }

    public List<String> getSize() {
        return size;
    }

    public void setSize(List<String> size) {
        this.size = size;
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

    public List<String> getBannerList() {
        return bannerList;
    }

    public void setBannerList(List<String> bannerList) {
        this.bannerList = bannerList;
    }

    public Long getValidStart() {
        return validStart;
    }

    public void setValidStart(Long validStart) {
        this.validStart = validStart;
    }

    public Long getValidEnd() {
        return validEnd;
    }

    public void setValidEnd(Long validEnd) {
        this.validEnd = validEnd;
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