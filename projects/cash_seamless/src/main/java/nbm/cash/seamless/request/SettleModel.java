package nbm.cash.seamless.request;

import java.math.BigDecimal;
import java.util.List;

/**
 * @Description 结算请求参数
 * @ClassName SettleModel
 * @Author New
 * @Date 2019/11/8 17:10
 * @Version V1.0
 **/
public class SettleModel {

    /**
     * 商户会员编号
     */
    private String userId;

    /**
     * 订单号
     */
    private String ticketId;

    /**
     * 注单类型
     */
    private Integer betType;

    /**
     * 结算总金额（含本金）
     */
    private BigDecimal totalPayment;

    /**
     * 是否重新结算:
     */
    private Integer isReBill;

    /**
     * 如果结算成功，此注单的期望状态
     */
    private Integer ticketStatusIfSuccess;

    /**
     * 结算时间
     */
    private Long billTime;

    /**
     * 结算结果
     */
    private Integer opRst;

    /**
     * 结算投注项数组
     */
    private List<OptionSettle> optionArray;

    /**
     * 是否抽佣
     */
    private Integer isRake;

    /**
     * 佣金比率
     */
    private Double rakeRate;

    /**
     * 注单数组
     */
    private List<BetModel> betList;

    public List<BetModel> getBetList() {
        return betList;
    }

    public void setBetList(List<BetModel> betList) {
        this.betList = betList;
    }

    public Double getRakeRate() {
        return rakeRate;
    }

    public void setRakeRate(Double rakeRate) {
        this.rakeRate = rakeRate;
    }

    public Integer getIsRake() {
        return isRake;
    }

    public void setIsRake(Integer isRake) {
        this.isRake = isRake;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public Integer getBetType() {
        return betType;
    }

    public void setBetType(Integer betType) {
        this.betType = betType;
    }

    public BigDecimal getTotalPayment() {
        return totalPayment;
    }

    public void setTotalPayment(BigDecimal totalPayment) {
        this.totalPayment = totalPayment;
    }

    public Integer getIsReBill() {
        return isReBill;
    }

    public void setIsReBill(Integer isReBill) {
        this.isReBill = isReBill;
    }

    public Integer getTicketStatusIfSuccess() {
        return ticketStatusIfSuccess;
    }

    public void setTicketStatusIfSuccess(Integer ticketStatusIfSuccess) {
        this.ticketStatusIfSuccess = ticketStatusIfSuccess;
    }

    public Integer getOpRst() {
        return opRst;
    }

    public void setOpRst(Integer opRst) {
        this.opRst = opRst;
    }

    public Long getBillTime() {
        return billTime;
    }

    public void setBillTime(Long billTime) {
        this.billTime = billTime;
    }

    public List<OptionSettle> getOptionArray() {
        return optionArray;
    }

    public void setOptionArray(List<OptionSettle> optionArray) {
        this.optionArray = optionArray;
    }
}