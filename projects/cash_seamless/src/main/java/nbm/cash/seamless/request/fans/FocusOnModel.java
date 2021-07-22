package nbm.cash.seamless.request.fans;

/**
 * @Description 关注或取消接口参数
 * @ClassName FocusOnModel
 * @Author New
 * @Date 2019/11/14 19:25
 * @Version V1.0
 **/
public class FocusOnModel extends FocusModel {

    public FocusOnModel() {

    }

    public FocusOnModel(String userId, String focusUserId) {
        this.setUserId(userId);
        this.focusUserId = focusUserId;
    }

    /**
     * 被关注或者取消关注的用户ID
     */
    private String focusUserId;

    public String getFocusUserId() {
        return focusUserId;
    }

    public void setFocusUserId(String focusUserId) {
        this.focusUserId = focusUserId;
    }
}