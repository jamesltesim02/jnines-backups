package nbm.cash.seamless.response;

/**
 * @program: cash_seamless
 * @description: option
 * @author: Mr.Nat
 * @create: 2019-11-20 18:42
 **/
public class OptionModel {

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
    private Long matchId;

    /**
     * 比赛名称
     */
    private String matchName;

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
}
