package nbm.cash.seamless.request;

import com.alibaba.fastjson.JSONArray;
import nbm.cash.seamless.entity.BetEntity;
import nbm.cash.seamless.request.plan.FellowModel;
import nbm.cash.seamless.utils.other.UUIDUtils;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * @Description 下单请求参数
 * @ClassName OrderPost
 * @Author New
 * @Date 2019/11/8 16:42
 * @Version V1.0
 **/
public class OrderPost {

    /**
     * 会员 token
     */
    private String customerToken;

    /**
     * 订单号
     */
    private String ticketId;

    /**
     * 订单金额
     */
    private BigDecimal orderAmount;

    /**
     * 货币类型
     */
    private Integer currency;

    /**
     * 请求注单的时间戳
     */
    private Long qTime;

    /**
     * 注单类型
     */
    private Integer betType;

    /**
     * 订单类型：1=普通注单，2=方案，3=跟单
     */
    private Integer ticketType;

    /**
     * 投注选项数组
     */
    private List<OptionModel> optionArray;

    /**
     * 注单数组
     */
    private List<BetModel> betList;

    /**
     * 跟单id
     */
    private String followTicket;

    /**
     * 用户Id
     */
    private String userId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public OrderPost() {

    }

    public OrderPost(BetEntity bet, FellowModel model) {
        this.customerToken = model.getCustomerToken();
        this.ticketId = UUIDUtils.getLongUID() + "";
        this.orderAmount = model.getBetAmount();
        this.currency = model.getCurrency();
        this.betType = bet.getBetType();
        this.optionArray = JSONArray.parseArray(bet.getOptions(), OptionModel.class);
        this.betList = JSONArray.parseArray(bet.getBets(), BetModel.class);
        this.followTicket = model.getTicketId();
        this.qTime = new Date().getTime();
    }

    public String getFollowTicket() {
        return followTicket;
    }

    public void setFollowTicket(String followTicket) {
        this.followTicket = followTicket;
    }

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

    public BigDecimal getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(BigDecimal orderAmount) {
        this.orderAmount = orderAmount;
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

    public Integer getBetType() {
        return betType;
    }

    public void setBetType(Integer betType) {
        this.betType = betType;
    }

    public Integer getTicketType() {
        return ticketType;
    }

    public void setTicketType(Integer ticketType) {
        this.ticketType = ticketType;
    }

    public List<OptionModel> getOptionArray() {
        return optionArray;
    }

    public void setOptionArray(List<OptionModel> optionArray) {
        this.optionArray = optionArray;
    }

    public List<BetModel> getBetList() {
        return betList;
    }

    public void setBetList(List<BetModel> betList) {
        this.betList = betList;
    }
}