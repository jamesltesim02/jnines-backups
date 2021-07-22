package nbm.cash.admin.modular.controller;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.token.JwtUtil;
import nbm.cash.admin.modular.request.PlanPost;
import nbm.cash.admin.modular.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * @program: cash_admin
 * @description: 方案
 * @author: Mr.Nat
 * @create: 2019-12-20 10:41
 **/
@Controller
@RequestMapping("/plan")
public class PlanController {

    @Autowired
    private PlanService planService;

    @ResponseBody
    @RequestMapping("/query")
    public WebMessage queryBet(@RequestBody PlanPost post){
        return planService.query(post);
    }

    @ResponseBody
    @RequestMapping("/updatePlan")
    public WebMessage updatePlan(@RequestBody PlanPost post, HttpServletRequest request){
        String token = request.getHeader("Authorization");
        String userId = JwtUtil.getUserId(token);
        post.setAuditUserId(userId);
        post.setAuditTime(System.currentTimeMillis());
        return planService.update(post);
    }
    
}
