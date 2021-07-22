package nbm.cash.seamless.entity;

/**
 * @Description 勋章模型
 * @ClassName MedalEntity
 * @Author New
 * @Date 2019/12/3 19:44
 * @Version V1.0
 **/
public class MedalEntity {

    /**
     * 累计带红
     */
    private Integer totalRed = 0;

    /**
     * 累计中奖
     */
    private Long winAmount = 0L;

    /**
     *最高连红
     */
    private Integer historyHit = 0;

    public Integer getHistoryHit() {
        return historyHit;
    }

    public void setHistoryHit(Integer historyHit) {
        this.historyHit = historyHit;
    }

    public Integer getTotalRed() {
        return totalRed;
    }

    public void setTotalRed(Integer totalRed) {
        this.totalRed = totalRed;
    }

    public Long getWinAmount() {
        return winAmount;
    }

    public void setWinAmount(Long winAmount) {
        this.winAmount = winAmount;
    }
}