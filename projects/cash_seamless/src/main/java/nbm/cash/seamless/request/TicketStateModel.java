package nbm.cash.seamless.request;

/**
 * @Description 查询注单状态
 * @ClassName TicketStateModel
 * @Author New
 * @Date 2019/11/8 17:29
 * @Version V1.0
 **/
public class TicketStateModel {

    /**
     * 注单ID
     */
    private String ticketId;

    /**
     * 用户ID
     */
    private String customerId;

    /**
     * 会员 token
     */
    private String token;

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}