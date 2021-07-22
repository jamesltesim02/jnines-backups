package nbm.cash.seamless.controller;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.constant.Constant;
import nbm.cash.seamless.entity.BetEntity;
import nbm.cash.seamless.request.*;
import nbm.cash.seamless.request.integral.IntegralModel;
import nbm.cash.seamless.request.plan.FellowModel;
import nbm.cash.seamless.service.SeamlessService;
import nbm.cash.seamless.utils.http.RespCodeEnum;
import nbm.cash.seamless.utils.http.WebMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RequestMapping(value = "/seamless")
@RestController
public class SeamlessController extends BaseController {
    @Resource
    Constant constant;
    private static final Logger logger = LogManager.getLogger(SeamlessController.class);

    @Autowired
    private SeamlessService seamlessService;

    @RequestMapping(value = "/QueryAccount")
    @ResponseBody
    public JSONObject getBalance(@RequestBody TokenModel token) throws IOException {
        logger.info("seamless getBalance 获取用户余额");
        return seamlessService.getBalance(token.getToken());
    }

    /**
     * 下单
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/Order")
    @ResponseBody
    public JSONObject doBet(@RequestBody OrderPost post) throws Exception {
        logger.info("seamless doBet 下单");
        return seamlessService.doBet(post);
    }

    /**
     * 结算
     *
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/Billing")
    @ResponseBody
    public JSONObject doSettle(@RequestBody SettleModel model) throws Exception {
        logger.info("seamless doSettle 结算");
        return seamlessService.doSettle(model);
    }

    /**
     * 取消注单
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/CancelTicket")
    @ResponseBody
    public JSONObject cancelBet(@RequestBody CancelModel model) throws Exception {
        logger.info("seamless cancelBet 取消订单");
        return seamlessService.cancelBet(model);
    }

    /**
     * 查询注单
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/QueryTicket")
    @ResponseBody
    public JSONObject queryBet(@RequestBody TicketStateModel model) throws IOException {
        logger.info("seamless queryBet 查询注单状态");
        return seamlessService.queryBet(model);
    }

    /**
     * 结算跟单注单
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/settleBet")
    @ResponseBody
    public JSONObject settleBet(@RequestBody SettleFollowTicketModel model) throws IOException {
        logger.info("seamless queryBet 结算跟单注单");
        return seamlessService.settleBet(model);
    }

    /**
     * test
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/test")
    @ResponseBody
    public JSONObject test(@RequestBody SettleModel model) throws Exception {
        logger.info("seamless doSettle test");
        return seamlessService.test(model);
    }

}
