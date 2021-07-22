package nbm.cash.seamless.request.task;

import java.math.BigDecimal;

/**
 * @Description 结算任务参数
 * @ClassName SettleTaskModel
 * @Author New
 * @Date 2019/11/19 11:05
 * @Version V1.0
 **/
public class SettleTaskModel extends BaseTaskModel {

    /**
     * 结算金额
     */
    private BigDecimal totalPayment;

    /**
     * 是否为重新结算：1为重新结算，0为第 一次结算
     */
    private Integer isReBill;

    public SettleTaskModel() {

    }

    public SettleTaskModel(String ticketId, BigDecimal totalPayment, Integer isReBill) {
        this.setTicketId(ticketId);
        this.totalPayment = totalPayment;
        this.isReBill = isReBill;
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
}