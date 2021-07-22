package nbm.cash.admin.modular.request;

/**
 * @program: cash_admin
 * @description:
 * @author: Mr.Nat
 * @create: 2019-12-13 16:55
 **/
public class BasePost {
    private Integer pageSize = 10;

    private Integer pageIndex = 1;

    private Long startTime;

    private Long endTime;

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
