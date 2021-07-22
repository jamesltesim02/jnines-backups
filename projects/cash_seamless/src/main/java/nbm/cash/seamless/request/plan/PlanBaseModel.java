package nbm.cash.seamless.request.plan;

import nbm.cash.seamless.request.BaseModel;

/**
 * @Description 方案参数模型 Base
 * @ClassName PlanModel
 * @Author New
 * @Date 2019/11/13 13:33
 * @Version V1.0
 **/
public class PlanBaseModel extends BaseModel {

    /**
     * 注单ID
     */
    private String ticketId;

    /**
     * 标题
     */
    private String title;

    /**
     * 内容
     */
    private String content;

    /**
     * 是否置顶
     */
    private Integer isTop;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 用户id
     */
    private String userId;

    /**
     * 运动种类
     */
    private Integer sportId;

    public Integer getSportId() {
        return sportId;
    }

    public void setSportId(Integer sportId) {
        this.sportId = sportId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public Integer getIsTop() {
        return isTop;
    }

    public void setIsTop(Integer isTop) {
        this.isTop = isTop;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
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
}