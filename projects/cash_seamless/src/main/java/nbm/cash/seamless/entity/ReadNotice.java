package nbm.cash.seamless.entity;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Description 公告已阅读对应表
 * @ClassName ReadNotice
 * @Author New
 * @Date 2019/12/10 17:54
 * @Version V1.0
 **/
@Document(collection = "read_notice")
public class ReadNotice {

    /**
     * MongoDB自带ID
     */
    private String _id;

    /**
     *用户ID
     */
    private String userId;

    /**
     * 公告ID
     */
    private String noticeId;

    public ReadNotice(){

    }

    public ReadNotice(String userId, String noticeId){
        this.userId = userId;
        this.noticeId = noticeId;
    }
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

    public String getNoticeId() {
        return noticeId;
    }

    public void setNoticeId(String noticeId) {
        this.noticeId = noticeId;
    }
}