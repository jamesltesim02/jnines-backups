package nbm.cash.seamless.request.integral;

import java.math.BigDecimal;

/**
 * @program: cash_seamless
 * @description: 积分
 * @author: Mr.Nat
 * @create: 2019-12-10 15:35
 **/
public class IntegralModel {

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 存款金额
     */
    private BigDecimal depositAmount;

    /**
     * 存款时间
     */
    private Long depositTime;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public BigDecimal getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(BigDecimal depositAmount) {
        this.depositAmount = depositAmount;
    }

    public Long getDepositTime() {
        return depositTime;
    }

    public void setDepositTime(Long depositTime) {
        this.depositTime = depositTime;
    }
}
