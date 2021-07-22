package nbm.cash.admin.common;

/**
 * @Description 分页参数
 * @ClassName BasePost
 * @Author New
 * @Date 2019/12/15 16:24
 * @Version V1.0
 **/
public class BasePost {

    private String userId;

    private Integer pageSize = 10;

    private Integer pageIndex = 1;

    public BasePost(){

    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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