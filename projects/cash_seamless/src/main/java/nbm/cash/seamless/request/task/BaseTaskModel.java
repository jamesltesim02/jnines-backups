package nbm.cash.seamless.request.task;

import java.math.BigDecimal;

/**
 * @Description 统计任务基础参数
 * @ClassName BaseTaskModel
 * @Author New
 * @Date 2019/11/18 15:08
 * @Version V1.0
 **/
public class BaseTaskModel {

    /**
     * 注单ID
     */
    private String ticketId;

    /**
     * 下单金额
     */
    private BigDecimal orderAmount;

    /**
     * 统计出错次数
     */
    private Integer count = 0;

    public BaseTaskModel() {

    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public BigDecimal getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(BigDecimal orderAmount) {
        this.orderAmount = orderAmount;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}