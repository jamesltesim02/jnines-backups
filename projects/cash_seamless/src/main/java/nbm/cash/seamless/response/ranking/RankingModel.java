package nbm.cash.seamless.response.ranking;

public class RankingModel {

    private long userId;

    private String userName;

    private String header;

    private Double betReturnRateWeek;

    private Double betReturnRateMonth;

    private Double betRateWeek;

    private Double betRateMonth;

    private Integer weekHit;

    private Integer monthHit;

    private Integer weekRed;

    private Integer monthRed;

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public Double getBetReturnRateWeek() {
        return betReturnRateWeek;
    }

    public void setBetReturnRateWeek(Double betReturnRateWeek) {
        this.betReturnRateWeek = betReturnRateWeek;
    }

    public Double getBetReturnRateMonth() {
        return betReturnRateMonth;
    }

    public void setBetReturnRateMonth(Double betReturnRateMonth) {
        this.betReturnRateMonth = betReturnRateMonth;
    }

    public Double getBetRateWeek() {
        return betRateWeek;
    }

    public void setBetRateWeek(Double betRateWeek) {
        this.betRateWeek = betRateWeek;
    }

    public Double getBetRateMonth() {
        return betRateMonth;
    }

    public void setBetRateMonth(Double betRateMonth) {
        this.betRateMonth = betRateMonth;
    }

    public Integer getWeekHit() {
        return weekHit;
    }

    public void setWeekHit(Integer weekHit) {
        this.weekHit = weekHit;
    }

    public Integer getMonthHit() {
        return monthHit;
    }

    public void setMonthHit(Integer monthHit) {
        this.monthHit = monthHit;
    }

    public Integer getWeekRed() {
        return weekRed;
    }

    public void setWeekRed(Integer weekRed) {
        this.weekRed = weekRed;
    }

    public Integer getMonthRed() {
        return monthRed;
    }

    public void setMonthRed(Integer monthRed) {
        this.monthRed = monthRed;
    }
}
