package nbm.cash.admin.modular.request;

/**
 * @program: cash_admin
 * @description: 注单查询参数实体
 * @author: Mr.Nat
 * @create: 2019-12-13 17:04
 **/
public class BetPost extends BasePost{
    private String ticketId;

    private String userId;

    private Integer betType;

    private Integer settleResult;

    private Integer ticketType;

    private Long betTime;

    private Integer betState;

    public Integer getBetState() {
        return betState;
    }

    public void setBetState(Integer betState) {
        this.betState = betState;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getBetType() {
        return betType;
    }

    public void setBetType(Integer betType) {
        this.betType = betType;
    }

    public Integer getSettleResult() {
        return settleResult;
    }

    public void setSettleResult(Integer settleResult) {
        this.settleResult = settleResult;
    }

    public Integer getTicketType() {
        return ticketType;
    }

    public void setTicketType(Integer ticketType) {
        this.ticketType = ticketType;
    }

    public Long getBetTime() {
        return betTime;
    }

    public void setBetTime(Long betTime) {
        this.betTime = betTime;
    }
}
