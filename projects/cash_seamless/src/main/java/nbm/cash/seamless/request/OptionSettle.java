package nbm.cash.seamless.request;

/**
 * @Description 投注项结算模型
 * @ClassName optionSettle
 * @Author New
 * @Date 2019/11/8 17:14
 * @Version V1.0
 **/
public class OptionSettle {

    /**
     * 投注项 ID
     */
    private Long opId;

    /**
     * 投注项结算结果
     */
    private Integer opRst;

    public Long getOpId() {
        return opId;
    }

    public void setOpId(Long opId) {
        this.opId = opId;
    }

    public Integer getOpRst() {
        return opRst;
    }

    public void setOpRst(Integer opRst) {
        this.opRst = opRst;
    }
}