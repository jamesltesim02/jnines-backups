package nbm.cash.seamless.entity;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Description 商品记录
 * @ClassName ExchangeLogo
 * @Author New
 * @Date 2019/11/29 16:24
 * @Version V1.0
 **/
@Document(collection = "exchange_log")
public class ExchangeLog {

    /**
     * MongoDB自带ID
     */
    private String _id;

    /**
     * 商品ID
     */
    private String commodityId;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 数量(与type对应)：消耗积分，商品初始库存，新增加的商品数量
     */
    private Integer amount;

    /**
     * 交易类型：1为积分兑换，2为新增商品，3为增加商品库存
     */
    private Integer type;

    /**
     * 剩余商品库存
     */
    private Integer inventory;

    /**
     * 生成时间
     */
    private Long createTime;

}