package nbm.cash.seamless.request;

/**
 * @Description 获取赛果
 * @ClassName ScoreModel
 * @Author New
 * @Date 2019/12/2 17:46
 * @Version V1.0
 **/
public class ScoreModel {

    private Integer lang;

    private Integer matchDay;

    private Integer[] sportIds;

    public ScoreModel(Integer lang, Integer matchDay, Integer[] sportIds) {
        this.lang = lang;
        this.matchDay = matchDay;
        this.sportIds = sportIds;
    }

    public Integer getLang() {
        return lang;
    }

    public void setLang(Integer lang) {
        this.lang = lang;
    }

    public Integer getMatchDay() {
        return matchDay;
    }

    public void setMatchDay(Integer matchDay) {
        this.matchDay = matchDay;
    }

    public Integer[] getSportIds() {
        return sportIds;
    }

    public void setSportIds(Integer[] sportIds) {
        this.sportIds = sportIds;
    }
}