package nbm.cash.seamless.controller;

import nbm.cash.seamless.entity.BetEntity;
import nbm.cash.seamless.request.BaseModel;
import nbm.cash.seamless.request.plan.*;
import nbm.cash.seamless.service.PlanService;
import nbm.cash.seamless.utils.http.RespCodeEnum;
import nbm.cash.seamless.utils.http.WebMessage;
import nbm.cash.seamless.utils.redis.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.Date;

/**
 * @Description
 * @ClassName CashController
 * @Author New
 * @Date 2019/11/8 16:26
 * @Version V1.0
 **/
@RequestMapping("/plan")
@RestController
public class PlanController extends BaseController {

    @Autowired
    private PlanService planService;

    /**
     * 发布方案
     *
     * @return
     */
    @RequestMapping("/publishPlan")
    @ResponseBody
    public WebMessage publishPlan(@RequestBody PublishModel model) {
        return planService.publishPlan(model);
    }

    /**
     * 跟单
     *
     * @return
     */
    @RequestMapping("/followPlan")
    @ResponseBody
    public WebMessage followPlan(@RequestBody FellowModel model, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        model.setCustomerToken(token);
        return planService.followPlan(model);
    }

    /**
     * 晒单
     *
     * @return
     */
    @RequestMapping("/showPlan")
    @ResponseBody
    public WebMessage showPlan(@RequestBody ShowModel model) {
        return planService.showPlan(model);
    }

    /**
     * 热门方案列表
     *
     * @return
     */
    @RequestMapping("/hotPlan")
    @ResponseBody
    public WebMessage hotPlan(Integer pageSize, Integer pageIndex, Integer isTop, String nickName) {
        PlanBaseModel model = new PlanBaseModel();
        model.setPageIndex(pageIndex);
        model.setPageSize(pageSize);
        model.setIsTop(isTop);
        model.setNickName(nickName);
        return planService.queryHotPlan(model);
    }

    /**
     * 热门方案详情
     *
     * @return
     */
    @RequestMapping("/hotPlanDetails")
    @ResponseBody
    public WebMessage hotPlanDetails(String ticketId,HttpServletRequest request) {
       String token = request.getHeader("Authorization");
        return planService.queryHotPlanDetails(ticketId,token);
    }

    /**
     * 热门方案跟单列表详情分页
     *
     * @return
     */
    @RequestMapping("/hotPlanFollows")
    @ResponseBody
    public WebMessage hotPlanFollows(String ticketId, int pageSize, int pageIndex) {
        PlanBaseModel model = new PlanBaseModel();
        model.setTicketId(ticketId);
        model.setPageSize(pageSize);
        model.setPageIndex(pageIndex);
        return WebMessage.success(planService.getBetFollows(model));
    }

    /**
     * 用户个人热门方案列表
     *
     * @return
     */
    @RequestMapping("/userHotPlan")
    @ResponseBody
    public WebMessage userHotPlan(Integer pageSize, Integer pageIndex, String userId, Integer sportId) {
        PlanBaseModel model = new PlanBaseModel();
        model.setPageIndex(pageIndex);
        model.setPageSize(pageSize);
        model.setUserId(userId);
        model.setSportId(sportId);
        return planService.queryUserHotPlan(model);
    }

    /**
     * 查询用户注单列表
     *
     * @param type
     * @param liveType
     * @param startTime
     * @param endTime
     * @param pageSize
     * @param pageIndex
     * @param request
     * @return
     */
    @RequestMapping("/findBetList")
    @ResponseBody
    public WebMessage findBetList(Integer type, Integer liveType, Long startTime, Long endTime, Integer pageSize, Integer pageIndex, HttpServletRequest request) {
        String userId = tokenToUser(request);
        if (userId == null) {
            return WebMessage.construct(RespCodeEnum.UNAUTHORIZED);
        }
        BetModel model = new BetModel();
        model.setUserId(userId);
        model.setLiveType(liveType);
        model.setType(type);
        model.setStartTime(startTime);
        model.setEndTime(endTime);
        model.setPageSize(pageSize);
        model.setPageIndex(pageIndex);
        return planService.findBetList(model);
    }

    @RequestMapping("/test")
    @ResponseBody
    public void test() {
        planService.test();
    }

}