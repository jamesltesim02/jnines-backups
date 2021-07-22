package nbm.cash.admin.modular.entity;

import nbm.cash.admin.modular.request.hotnews.HotNewsPost;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Description
 * @ClassName HotNewsEntity
 * @Author New
 * @Date 2019/11/21 10:30
 * @Version V1.0
 **/
@Document(collection = "hot_news")
public class HotNewsEntity {

    public HotNewsEntity(){

    }

    public HotNewsEntity(HotNewsPost model){
        this.title = model.getTitle();
        this.content = model.getContent();
        this.thumbnail = model.getThumbnail();
        this.url = model.getUrl();
        this.validStart = model.getValidStart();
        this.validEnd = model.getValidEnd();
        this.createTime = System.currentTimeMillis();
    }

    /**
     * ID
     */
    private String _id;

    /**
     * 标题
     */
    private String title;

    /**
     * 内容
     */
    private String content;

    /**
     * 缩略图
     */
    private String thumbnail;

    /**
     * 链接地址
     */
    private String url;

    /**
     * 人气值
     */
    private Integer popularity = 0;

    private Long validStart;

    private Long validEnd;

    /**
     * 时间
     */
    private Long createTime;

    /**
     * 状态
     */
    private Integer state = 1;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public Integer getPopularity() {
        return popularity;
    }

    public void setPopularity(Integer popularity) {
        this.popularity = popularity;
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

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }
}