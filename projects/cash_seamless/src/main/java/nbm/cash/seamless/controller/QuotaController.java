package nbm.cash.seamless.controller;

import nbm.cash.seamless.service.QuotaService;
import nbm.cash.seamless.utils.http.WebMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description
 * @ClassName QuotaController
 * @Author New
 * @Date 2019/12/19 11:09
 * @Version V1.0
 **/
@RestController
@RequestMapping("/quota")
public class QuotaController {

    @Autowired
    private QuotaService quotaService;

    @RequestMapping("/followQuota")
    @ResponseBody
    public WebMessage getFollowQuota(Integer num){
        return quotaService.findFollowQuota(num);
    }
}