package nbm.cash.admin.modular.response;

/**
 * @program: cash_admin
 * @description: option
 * @author: Mr.Nat
 * @create: 2019-12-18 14:27
 **/
public class OptionRsp {
    /**
     * 体育项编号
     */
    private Integer sportNo;

    /**
     * 联赛名
     */
    private String tourName;

    /**
     * 比赛 ID
     */
    private Long macthId;

    /**
     * 比赛名称
     */
    private String macthName;

    /**
     * 玩法类型
     */
    private Integer gameType;

    /**
     * 比分角球或者罚牌
     */
    private Integer groupType;

    /**
     * 投注项 ID
     */
    private Long optionId;

    /**
     * 投注项名称
     */
    private String betOption;

    /**
     * 与groupType相关的当时主队得分
     */
    private Integer insHomeScore;

    /**
     * 与groupType相关的当时客队得
     */
    private Integer insAwayScore;

    /**
     * 由OddsFormat定义格式的注单赔率
     */
    private Double oddsView;

    /**
     * 水位格式,固定为欧赔
     */
    private Integer oddsFormat;

    /**
     * Option的betStage
     */
    private Integer betStage;

    /**
     * 投注项描述
     */
    private String betBar;

    /**
     * 比赛粗略开始时间
     */
    private Long matchStartTime;

    /**
     * 比赛结果
     */
    private Integer setResult;

    public Integer getSportNo() {
        return sportNo;
    }

    public void setSportNo(Integer sportNo) {
        this.sportNo = sportNo;
    }

    public String getTourName() {
        return tourName;
    }

    public void setTourName(String tourName) {
        this.tourName = tourName;
    }

    public Long getMacthId() {
        return macthId;
    }

    public void setMacthId(Long macthId) {
        this.macthId = macthId;
    }

    public String getMacthName() {
        return macthName;
    }

    public void setMacthName(String macthName) {
        this.macthName = macthName;
    }

    public Integer getGameType() {
        return gameType;
    }

    public void setGameType(Integer gameType) {
        this.gameType = gameType;
    }

    public Integer getGroupType() {
        return groupType;
    }

    public void setGroupType(Integer groupType) {
        this.groupType = groupType;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public String getBetOption() {
        return betOption;
    }

    public void setBetOption(String betOption) {
        this.betOption = betOption;
    }

    public Integer getInsHomeScore() {
        return insHomeScore;
    }

    public void setInsHomeScore(Integer insHomeScore) {
        this.insHomeScore = insHomeScore;
    }

    public Integer getInsAwayScore() {
        return insAwayScore;
    }

    public void setInsAwayScore(Integer insAwayScore) {
        this.insAwayScore = insAwayScore;
    }

    public Double getOddsView() {
        return oddsView;
    }

    public void setOddsView(Double oddsView) {
        this.oddsView = oddsView;
    }

    public Integer getOddsFormat() {
        return oddsFormat;
    }

    public void setOddsFormat(Integer oddsFormat) {
        this.oddsFormat = oddsFormat;
    }

    public Integer getBetStage() {
        return betStage;
    }

    public void setBetStage(Integer betStage) {
        this.betStage = betStage;
    }

    public String getBetBar() {
        return betBar;
    }

    public void setBetBar(String betBar) {
        this.betBar = betBar;
    }

    public Long getMatchStartTime() {
        return matchStartTime;
    }

    public void setMatchStartTime(Long matchStartTime) {
        this.matchStartTime = matchStartTime;
    }

    public Integer getSetResult() {
        return setResult;
    }

    public void setSetResult(Integer setResult) {
        this.setResult = setResult;
    }
}
