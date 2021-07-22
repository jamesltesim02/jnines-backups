package nbm.cash.seamless.request;

/**
 * @Description 取消注单
 * @ClassName CancelModel
 * @Author New
 * @Date 2019/11/8 17:34
 * @Version V1.0
 **/
public class CancelModel {

    /**
     * 订单号
     */
    private String ticketId;

    /**
     * 注单金额
     */
    private Double betAmount;

    /**
     * 用户的商户唯一ID
     */
    private String userId;

    /**
     * 盈利（未包含本金的纯盈利）
     */
    private Double profit;

    /**
     * 取消原因
     */
    private String msg;

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public Double getBetAmount() {
        return betAmount;
    }

    public void setBetAmount(Double betAmount) {
        this.betAmount = betAmount;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}