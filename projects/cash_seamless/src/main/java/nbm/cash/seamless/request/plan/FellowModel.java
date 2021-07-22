package nbm.cash.seamless.request.plan;

import java.math.BigDecimal;

/**
 * @Description 跟单参数模型
 * @ClassName FellowModel
 * @Author New
 * @Date 2019/11/13 13:32
 * @Version V1.0
 **/
public class FellowModel {

    /**
     * 会员 token
     */
    private String customerToken;

    /**
     * 注单ID
     */
    private String ticketId;

    /**
     * 跟单金额
     */
    private BigDecimal betAmount;

    /**
     * 货币类型
     */
    private Integer currency;

    /**
     * 请求注单的时 间戳
     */
    private Long qTime;

    public String getCustomerToken() {
        return customerToken;
    }

    public void setCustomerToken(String customerToken) {
        this.customerToken = customerToken;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public BigDecimal getBetAmount() {
        return betAmount;
    }

    public void setBetAmount(BigDecimal betAmount) {
        this.betAmount = betAmount;
    }

    public Integer getCurrency() {
        return currency;
    }

    public void setCurrency(Integer currency) {
        this.currency = currency;
    }

    public Long getqTime() {
        return qTime;
    }

    public void setqTime(Long qTime) {
        this.qTime = qTime;
    }
}