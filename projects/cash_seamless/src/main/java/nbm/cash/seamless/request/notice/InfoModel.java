package nbm.cash.seamless.request.notice;

import nbm.cash.seamless.request.BaseModel;

/**
 * @Description 公告、新闻查询参数
 * @ClassName NoticeModel
 * @Author New
 * @Date 2019/11/21 11:07
 * @Version V1.0
 **/
public class InfoModel extends BaseModel {

    /**
     * ID
     */
    private String id;

    /**
     * 用户ID
     */
    private String userId;

    public InfoModel() {

    }

    public InfoModel(String id) {
        this.id = id;
    }

    public InfoModel(String id, String userId) {
        this.id = id;
        this.userId = userId;
    }

    public InfoModel(Integer pageSize, Integer pageIndex) {
        this.setPageSize(pageSize);
        this.setPageIndex(pageIndex);
    }

    public InfoModel(Integer pageSize, Integer pageIndex, String userId) {
        this.userId = userId;
        this.setPageSize(pageSize);
        this.setPageIndex(pageIndex);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}