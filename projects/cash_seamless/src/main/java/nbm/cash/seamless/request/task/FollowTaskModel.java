package nbm.cash.seamless.request.task;

import java.math.BigDecimal;

/**
 * @Description 跟单完成统计任务所需参数
 * @ClassName followTaskModel
 * @Author New
 * @Date 2019/11/18 13:25
 * @Version V1.0
 **/
public class FollowTaskModel extends BaseTaskModel {

    /**
     * 跟单用户ID
     */
    private String userId;

    public FollowTaskModel() {

    }

    public FollowTaskModel(String ticketId, BigDecimal orderAmount, String userId) {
        this.setTicketId(ticketId);
        this.setOrderAmount(orderAmount);
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}