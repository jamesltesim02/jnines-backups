package nbm.cash.seamless.request.plan;

import java.math.BigDecimal;

/**
 * @Description 下单成功返回用户参数
 * @ClassName UserInfo
 * @Author New
 * @Date 2019/11/14 14:47
 * @Version V1.0
 **/
public class UserInfo {

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 用户余额
     */
    private BigDecimal balance;

    /**
     * 注单编号
     */
    private Long ticketID;

    /**
     * 下单总金额
     */
    private BigDecimal amount;

    /**
     * 下单时间
     */
    private Long orderTime;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Long getTicketID() {
        return ticketID;
    }

    public void setTicketID(Long ticketID) {
        this.ticketID = ticketID;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(Long orderTime) {
        this.orderTime = orderTime;
    }
}