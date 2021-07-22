package nbm.cash.seamless.controller;

import nbm.cash.seamless.request.CashPrizeModel;
import nbm.cash.seamless.service.WareService;
import nbm.cash.seamless.utils.http.WebMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description
 * @ClassName CommodityController
 * @Author New
 * @Date 2019/12/13 18:11
 * @Version V1.0
 **/
@RestController
@RequestMapping("/ware")
public class WareController extends BaseController{

    @Autowired
    private WareService wareService;

    /**
     * 获取商品列表
     * @return
     */
    @RequestMapping("/findList")
    @ResponseBody
    public WebMessage findCommodityList(){
        return wareService.findCommodityList();
    }

    /**
     * 兑换商品
     * @param model
     * @return
     */
    @RequestMapping("cashPrize")
    @ResponseBody
    public WebMessage cashPrize(@RequestBody CashPrizeModel model, HttpServletRequest request) {
        model.setUserId(tokenToUser(request));
        return wareService.cashPrize(model);
    }
}