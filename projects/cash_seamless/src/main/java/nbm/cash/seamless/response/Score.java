package nbm.cash.seamless.response;

/**
 * @Description 赛果返回数据
 * @ClassName Score
 * @Author New
 * @Date 2019/12/2 18:00
 * @Version V1.0
 **/
public class Score {

    private String matchID;

    private String matchDate;

    private String competitor1;

    private String competitor1Name;

    private String competitor2;

    private String competitor2Name;

    private String logo1;

    private String logo2;

    private Integer matchState;

    private String matchScore;

    private String resultNB;

    public String getMatchID() {
        return matchID;
    }

    public void setMatchID(String matchID) {
        this.matchID = matchID;
    }

    public String getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(String matchDate) {
        this.matchDate = matchDate;
    }

    public String getCompetitor1() {
        return competitor1;
    }

    public void setCompetitor1(String competitor1) {
        this.competitor1 = competitor1;
    }

    public String getCompetitor1Name() {
        return competitor1Name;
    }

    public void setCompetitor1Name(String competitor1Name) {
        this.competitor1Name = competitor1Name;
    }

    public String getCompetitor2() {
        return competitor2;
    }

    public void setCompetitor2(String competitor2) {
        this.competitor2 = competitor2;
    }

    public String getCompetitor2Name() {
        return competitor2Name;
    }

    public void setCompetitor2Name(String competitor2Name) {
        this.competitor2Name = competitor2Name;
    }

    public String getLogo1() {
        return logo1;
    }

    public void setLogo1(String logo1) {
        this.logo1 = logo1;
    }

    public String getLogo2() {
        return logo2;
    }

    public void setLogo2(String logo2) {
        this.logo2 = logo2;
    }

    public Integer getMatchState() {
        return matchState;
    }

    public void setMatchState(Integer matchState) {
        this.matchState = matchState;
    }

    public String getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(String matchScore) {
        this.matchScore = matchScore;
    }

    public String getResultNB() {
        return resultNB;
    }

    public void setResultNB(String resultNB) {
        this.resultNB = resultNB;
    }
}