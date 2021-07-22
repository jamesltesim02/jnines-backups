package nbm.cash.seamless.request.plan;

import java.math.BigDecimal;

/**
 * @Description 发单模型参数
 * @ClassName PublishModel
 * @Author New
 * @Date 2019/11/12 11:25
 * @Version V1.0
 **/
public class PublishModel extends PlanBaseModel {

    /**
     * 最小跟单金额
     */
    private BigDecimal minFollowAmount = BigDecimal.valueOf(2);

    /**
     * 是否抽佣
     */
    private Integer isRake = 1;

    /**
     * 抽佣比率
     */
    private Double rakeRate = 0.1;

    /**
     * 保底赔率
     */
    private Double ensureOdds;

    public BigDecimal getMinFollowAmount() {
        return minFollowAmount;
    }

    public void setMinFollowAmount(BigDecimal minFollowAmount) {
        this.minFollowAmount = minFollowAmount;
    }

    public Integer getIsRake() {
        return isRake;
    }

    public void setIsRake(Integer isRake) {
        this.isRake = isRake;
    }

    public Double getRakeRate() {
        return rakeRate;
    }

    public void setRakeRate(Double rakeRate) {
        this.rakeRate = rakeRate;
    }

    public Double getEnsureOdds() {
        return ensureOdds;
    }

    public void setEnsureOdds(Double ensureOdds) {
        this.ensureOdds = ensureOdds;
    }
}