package nbm.cash.seamless.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * @Description 关注对应关系表
 * @ClassName FansMapping
 * @Author New
 * @Date 2019/11/15 15:08
 * @Version V1.0
 **/
@Document(collection = "fans_mapping")
public class FansMapping {

    /**
     * Mongo必须自带的id字段
     */
    private String _id;

    /**
     * 我的ID
     */
    private String myUserId;

    /**
     * 我关注的ID
     */
    private String focusId;

    /**
     * 创建时间
     */
    private Long createTime;

    public FansMapping() {

    }

    public FansMapping(String myUserId, String focusId) {
        this.myUserId = myUserId;
        this.focusId = focusId;
        this.createTime = new Date().getTime();
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getMyUserId() {
        return myUserId;
    }

    public void setMyUserId(String myUserId) {
        this.myUserId = myUserId;
    }

    public String getFocusId() {
        return focusId;
    }

    public void setFocusId(String focusId) {
        this.focusId = focusId;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
}