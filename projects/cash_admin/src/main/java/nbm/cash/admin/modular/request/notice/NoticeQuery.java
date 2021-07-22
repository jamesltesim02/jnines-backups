package nbm.cash.admin.modular.request.notice;

import nbm.cash.admin.common.BasePost;

/**
 * @Description 公告查询接口参数
 * @ClassName Notice
 * @Author New
 * @Date 2019/12/15 16:27
 * @Version V1.0
 **/
public class NoticeQuery extends BasePost {

    private String title;

    /**
     * 类型
     */
    private Integer type;

    /**
     * 状态
     */
    private Integer state;

    /**
     * 查询开始时间
     */
    private Long startTime;

    /**
     * 查询结束时间
     */
    private Long endTime;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        if(type == null) {
            this.type = -1;
        } else {
            this.type = type;
        }

    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        if(state == null){
            this.state = -1;
        } else {
            this.state = state;
        }
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }
}