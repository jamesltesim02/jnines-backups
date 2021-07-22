package nbm.cash.admin.modular.controller;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.request.BetPost;
import nbm.cash.admin.modular.service.BetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @program: cash_admin
 * @description: 注单列表
 * @author: Mr.Nat
 * @create: 2019-12-13 10:17
 **/
@Controller
@RequestMapping("/bet")
public class BetListController {

    @Autowired
    private BetService betService;

    @RequestMapping()
    public String betList(){
        return "betList";
    }

    @ResponseBody
    @RequestMapping("/query")
    public WebMessage queryBet(@RequestBody BetPost post){
        return betService.query(post);
    }
}
