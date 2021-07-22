package nbm.cash.seamless.controller;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.request.integral.IntegralModel;
import nbm.cash.seamless.service.CallbackService;
import nbm.cash.seamless.utils.http.WebMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @program: cash_seamless
 * @description: 回调接口
 * @author: Mr.Nat
 * @create: 2019-12-10 17:03
 **/
@RequestMapping("/callback")
@RestController
public class CallBackController {

    @Autowired
    private CallbackService callbackService;
    @RequestMapping(value = "/deposit")
    @ResponseBody
    public WebMessage firstDepositIntegra(@RequestBody IntegralModel model){
        return  callbackService.firstDepositIntegra(model);
    }
}
