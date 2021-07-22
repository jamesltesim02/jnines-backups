package nbm.cash.seamless.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

/**
 * @Description 限额
 * @ClassName QuotaEntity
 * @Author New
 * @Date 2019/12/19 10:56
 * @Version V1.0
 **/
@Document(collection = "follow_quota")
public class QuotaEntity {

    private String _id;

    /**
     * 单式串关几串几
     */
    private Integer num;

    /**
     * 最高赔付
     */
    private BigDecimal compensate;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public BigDecimal getCompensate() {
        return compensate;
    }

    public void setCompensate(BigDecimal compensate) {
        this.compensate = compensate;
    }
}