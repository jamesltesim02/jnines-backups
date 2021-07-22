package nbm.cash.seamless.request.ranking;

import nbm.cash.seamless.request.BaseModel;


public class RanKingModel extends BaseModel {

    private String userId;

    private String timeRange = "week";

    public String getTimeRange() {
        return timeRange;
    }

    public void setTimeRange(String timeRange) {
        this.timeRange = timeRange;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public RanKingModel() {
    }

    public RanKingModel(String timeRange, int pageSize, int pageIndex) {
        this.timeRange = timeRange;
        this.setPageIndex(pageIndex);
        this.setPageSize(pageSize);
    }

}
