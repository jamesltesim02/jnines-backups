package nbm.cash.seamless.request;

import java.math.BigDecimal;
import java.util.List;

/**
 * @Description 注单数组模型
 * @ClassName BetModel
 * @Author New
 * @Date 2019/11/8 16:51
 * @Version V1.0
 **/
public class BetModel {

    /**
     * 串关注单号
     */
    private Long comboId;

    /**
     * 串关每注注单金额，单式无意义
     */
    private BigDecimal betAmount;

    /**
     * 若是串关则为num串一,或者num串M
     */
    private Integer num;

    /**
     * 注数
     */
    private Integer cnt;

    /**
     * 欧盘格式的赔率
     */
    private BigDecimal oddsEuro;

    /**
     * 串关每注明细
     */
    private List<ComboModel> comboItems;

    /**
     * 结算金额
     */
    private BigDecimal payment;

    public BigDecimal getPayment() {
        return payment;
    }

    public void setPayment(BigDecimal payment) {
        this.payment = payment;
    }

    /***/

    public Long getComboId() {
        return comboId;
    }

    public void setComboId(Long comboId) {
        this.comboId = comboId;
    }

    public BigDecimal getBetAmount() {
        return betAmount;
    }

    public void setBetAmount(BigDecimal betAmount) {
        this.betAmount = betAmount;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public Integer getCnt() {
        return cnt;
    }

    public void setCnt(Integer cnt) {
        this.cnt = cnt;
    }

    public BigDecimal getOddsEuro() {
        return oddsEuro;
    }

    public void setOddsEuro(BigDecimal oddsEuro) {
        this.oddsEuro = oddsEuro;
    }

    public List<ComboModel> getComboItems() {
        return comboItems;
    }

    public void setComboItems(List<ComboModel> comboItems) {
        this.comboItems = comboItems;
    }
}