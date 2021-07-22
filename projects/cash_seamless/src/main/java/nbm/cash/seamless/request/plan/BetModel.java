package nbm.cash.seamless.request.plan;

import nbm.cash.seamless.request.BaseModel;

/**
 * @Description 注单查询参数
 * @ClassName BetModel
 * @Author New
 * @Date 2019/11/21 18:52
 * @Version V1.0
 **/
public class BetModel extends BaseModel {

    private String userId;

    private Integer type = 0;

    private Integer liveType = 0;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getLiveType() {
        return liveType;
    }

    public void setLiveType(Integer liveType) {
        this.liveType = liveType;
    }
}