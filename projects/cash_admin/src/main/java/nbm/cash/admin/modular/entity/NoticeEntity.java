package nbm.cash.admin.modular.entity;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Description 公告实体
 * @ClassName NoticeEntity
 * @Author New
 * @Date 2019/11/21 10:08
 * @Version V1.0
 **/
@Document(collection = "notice")
public class NoticeEntity {

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
     * 公告类型：1为系统公告，2为商户公告，3用户私信
     */
    private Integer type;

    /**
     * 用户ID，对应type的用户私信
     */
    private String userId;

    /**
     * 是否已阅读
     */
    private Integer isRead = 0;

    /**
     * 发布时间
     */
    private Long createTime;

    /**
     * 有效期开始
     */
    private Long validStart;

    /**
     * 发有效期结束
     */
    private Long validEnd;

    /**
     * 发布用户ID
     */
    private String createUserId;

    /**
     * 状态
     */
    private Integer state = 1;

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getIsRead() {
        return isRead;
    }

    public void setIsRead(Integer isRead) {
        this.isRead = isRead;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
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

    public String getCreateUserId() {
        return createUserId;
    }

    public void setCreateUserId(String createUserId) {
        this.createUserId = createUserId;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}