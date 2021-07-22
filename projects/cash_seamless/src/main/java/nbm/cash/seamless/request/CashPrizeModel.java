package nbm.cash.seamless.request;

/**
 * @Description 兑换商品参数
 * @ClassName CashPrizeModel
 * @Author New
 * @Date 2019/12/13 18:37
 * @Version V1.0
 **/
public class CashPrizeModel{

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 商品ID
     */
    private String wareId;

    /**
     * 商品数量
     */
    private Integer wareNum;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getWareId() {
        return wareId;
    }

    public void setWareId(String wareId) {
        this.wareId = wareId;
    }

    public Integer getWareNum() {
        return wareNum;
    }

    public void setWareNum(Integer wareNum) {
        this.wareNum = wareNum;
    }
}
