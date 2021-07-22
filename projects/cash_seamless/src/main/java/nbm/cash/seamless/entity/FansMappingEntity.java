package nbm.cash.seamless.entity;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @program: cash_seamless
 * @description: 关注映射表
 * @author: Mr.Nat
 * @create: 2019-12-03 21:06
 **/
@Document(collection = "fans_mapping")
public class FansMappingEntity {
    /**
     * Mongo必须自带的id字段
     */
    private String _id;

    /**
     * 用户id
     */
    private String myUserId;

    /**
     * 关注id
     */
    private String focusId;

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
}
