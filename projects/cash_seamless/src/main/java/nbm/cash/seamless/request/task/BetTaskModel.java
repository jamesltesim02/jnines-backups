package nbm.cash.seamless.request.task;

import java.math.BigDecimal;

/**
 * @Description 下单成功后统计任务参数
 * @ClassName BetTaskModel
 * @Author New
 * @Date 2019/11/18 15:07
 * @Version V1.0
 **/
public class BetTaskModel extends BaseTaskModel {

    private String userId;

    public BetTaskModel(String ticketId, String userId, BigDecimal orderAmount) {
        this.setTicketId(ticketId);
        this.userId = userId;
        this.setOrderAmount(orderAmount);
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}