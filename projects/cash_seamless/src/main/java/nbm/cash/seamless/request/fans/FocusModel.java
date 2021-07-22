package nbm.cash.seamless.request.fans;

import nbm.cash.seamless.request.BaseModel;

/**
 * @Description 查询我关注的用户
 * @ClassName FocusModel
 * @Author New
 * @Date 2019/11/14 19:19
 * @Version V1.0
 **/
public class FocusModel extends BaseModel {

    /**
     * 当前用户ID
     */
    private String userId;

    public FocusModel() {

    }

    public FocusModel(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}