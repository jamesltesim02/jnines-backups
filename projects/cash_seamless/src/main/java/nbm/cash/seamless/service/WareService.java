package nbm.cash.seamless.service;

import nbm.cash.seamless.request.CashPrizeModel;
import nbm.cash.seamless.utils.http.WebMessage;

/**
 * @Description
 * @ClassName CommodityService
 * @Author New
 * @Date 2019/12/13 18:14
 * @Version V1.0
 **/
public interface WareService {

    /**
     * 获取商品列表
     * @return
     */
    public WebMessage findCommodityList();

    /**
     * 兑奖
     * @param model
     * @return
     */
    public WebMessage cashPrize(CashPrizeModel model);
}