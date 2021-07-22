package nbm.cash.seamless.request;

/**
 * @Description
 * @ClassName BaseModel
 * @Author New
 * @Date 2019/11/8 16:39
 * @Version V1.0
 **/
public class BaseModel extends TokenModel {
    private Long startTime;

    private Long endTime;

    private Integer pageSize = 10;

    private Integer pageIndex = 1;

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

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }
}