package nbm.cash.seamless.entity;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Description banner
 * @ClassName BannerEntity
 * @Author New
 * @Date 2019/12/2 10:41
 * @Version V1.0
 **/
@Document(collection = "banner")
public class BannerEntity {

    /**
     * MongoDB自带ID
     */
    private String _id;

    /**
     * 缩略图
     */
    private String thumbnail;

    /**
     * url
     */
    private String url;

    /**
     * 状态
     */
    private Integer state = 1;

    /**
     * 排序号,越小越前
     */
    private Integer orderNo;

    /**
     * 创建时间
     */
    private Long createTime;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
}