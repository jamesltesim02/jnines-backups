package nbm.cash.admin.modular.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.List;

/**
 * @program: cash_admin
 * @description: 注单列表实体
 * @author: Mr.Nat
 * @create: 2019-12-13 16:19
 **/
@Document(collection = "bet")
public class BetEntity {
    /**
     * 注单ID
     */
    private String ticketId;


    /**
     * 用户ID(商户)
     */
    private String userId;

    /**
     * 注单金额
     */
    private BigDecimal betAmount;

    /**
     * 注单类型
     */
    private Integer betType;

    /**
     * 下注时间
     */
    private Long betTime;

    /**
     * 结算金额
     */
    private BigDecimal settlement;

    /**
     * 预计返还金额
     */
    private BigDecimal expectPay = BigDecimal.ZERO;

    /**
     * 结算结果
     */
    private Integer settleResult;

    /**
     * 状态（结算状态）
     */
    private Integer betState;

    private String options;


    private List<OptionEntity> optionArray;

    public List<OptionEntity> getOptionArray() {
        return optionArray;
    }

    public void setOptionArray(List<OptionEntity> optionArray) {
        this.optionArray = optionArray;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
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

    public BigDecimal getBetAmount() {
        return betAmount;
    }

    public void setBetAmount(BigDecimal betAmount) {
        this.betAmount = betAmount;
    }

    public Integer getBetType() {
        return betType;
    }

    public void setBetType(Integer betType) {
        this.betType = betType;
    }

    public Long getBetTime() {
        return betTime;
    }

    public void setBetTime(Long betTime) {
        this.betTime = betTime;
    }

    public BigDecimal getSettlement() {
        return settlement;
    }

    public void setSettlement(BigDecimal settlement) {
        this.settlement = settlement;
    }

    public BigDecimal getExpectPay() {
        return expectPay;
    }

    public void setExpectPay(BigDecimal expectPay) {
        this.expectPay = expectPay;
    }

    public Integer getSettleResult() {
        return settleResult;
    }

    public void setSettleResult(Integer settleResult) {
        this.settleResult = settleResult;
    }

    public Integer getBetState() {
        return betState;
    }

    public void setBetState(Integer betState) {
        this.betState = betState;
    }

}
