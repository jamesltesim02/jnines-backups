package nbm.cash.seamless.entity;

import java.math.BigDecimal;

/**
 * @Description 周月统计数据
 * @ClassName WeekMonthData
 * @Author New
 * @Date 2019/11/19 12:04
 * @Version V1.0
 **/
public class WeekMonthData {

    /**
     * 当月总单数
     */
    private Integer betCountMonth = 0;

    /**
     * 当周总单数
     */
    private Integer betCountWeek = 0;

    /**
     * 当月赢得单数
     */
    private Integer betWinMonth = 0;

    /**
     * 当周赢得单数
     */
    private Integer betWinWeek = 0;

    /**
     * 当月总投注额
     */
    private BigDecimal betAmountMonth = BigDecimal.ZERO;

    /**
     * 当月总返还
     */
    private BigDecimal betReturnMonth = BigDecimal.ZERO;

    /**
     * 当周总投注额
     */
    private BigDecimal betAmountWeek = BigDecimal.ZERO;

    /**
     * 当周总返还
     */
    private BigDecimal betReturnWeek = BigDecimal.ZERO;

    public Integer getBetCountMonth() {
        return betCountMonth;
    }

    public void setBetCountMonth(Integer betCountMonth) {
        this.betCountMonth = betCountMonth;
    }

    public Integer getBetCountWeek() {
        return betCountWeek;
    }

    public void setBetCountWeek(Integer betCountWeek) {
        this.betCountWeek = betCountWeek;
    }

    public Integer getBetWinMonth() {
        return betWinMonth;
    }

    public void setBetWinMonth(Integer betWinMonth) {
        this.betWinMonth = betWinMonth;
    }

    public Integer getBetWinWeek() {
        return betWinWeek;
    }

    public void setBetWinWeek(Integer betWinWeek) {
        this.betWinWeek = betWinWeek;
    }

    public BigDecimal getBetAmountMonth() {
        return betAmountMonth;
    }

    public void setBetAmountMonth(BigDecimal betAmountMonth) {
        this.betAmountMonth = betAmountMonth;
    }

    public BigDecimal getBetReturnMonth() {
        return betReturnMonth;
    }

    public void setBetReturnMonth(BigDecimal betReturnMonth) {
        this.betReturnMonth = betReturnMonth;
    }

    public BigDecimal getBetAmountWeek() {
        return betAmountWeek;
    }

    public void setBetAmountWeek(BigDecimal betAmountWeek) {
        this.betAmountWeek = betAmountWeek;
    }

    public BigDecimal getBetReturnWeek() {
        return betReturnWeek;
    }

    public void setBetReturnWeek(BigDecimal betReturnWeek) {
        this.betReturnWeek = betReturnWeek;
    }

}