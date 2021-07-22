package nbm.cash.seamless.response.fans;

/**
 * @Description 我的粉丝和我的关注统计返回参数
 * @ClassName FansAndFocusModel
 * @Author New
 * @Date 2019/11/15 16:44
 * @Version V1.0
 **/
public class FansAndFocusModel {

    private Integer fans = 0;

    private Integer Focus = 0;

    public Integer getFans() {
        return fans;
    }

    public void setFans(Integer fans) {
        this.fans = fans;
    }

    public Integer getFocus() {
        return Focus;
    }

    public void setFocus(Integer focus) {
        Focus = focus;
    }
}