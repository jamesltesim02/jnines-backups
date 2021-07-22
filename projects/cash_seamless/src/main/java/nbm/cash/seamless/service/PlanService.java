package nbm.cash.seamless.service;

import nbm.cash.seamless.request.BaseModel;
import nbm.cash.seamless.request.plan.BetModel;
import nbm.cash.seamless.request.plan.FellowModel;
import nbm.cash.seamless.request.plan.PlanBaseModel;
import nbm.cash.seamless.request.plan.PublishModel;
import nbm.cash.seamless.utils.http.WebMessage;
import nbm.cash.seamless.utils.other.PageBean;

/**
 * @Description 方案相关服务接口
 * @ClassName PlanService
 * @Author New
 * @Date 2019/11/13 10:56
 * @Version V1.0
 **/
public interface PlanService {

    /**
     * 发布方案接口
     *
     * @param model
     * @return
     */
    public WebMessage publishPlan(PublishModel model);

    /**
     * 跟单接口
     *
     * @param model
     * @return
     */
    public WebMessage followPlan(FellowModel model);

    /**
     * 晒单接口
     *
     * @param model
     * @return
     */
    public WebMessage showPlan(PlanBaseModel model);

    /**
     * 查询热门方案
     *
     * @return
     */
    public WebMessage queryHotPlan(PlanBaseModel model);

    /**
     * 查询热门方案详情
     *
     * @return
     */
    public WebMessage queryHotPlanDetails(String ticketId,String tiken);

    /**
     * 查询热门方案跟单列表
     *
     * @return
     */
    public PageBean getBetFollows(PlanBaseModel model);

    /**
     * 查询用户注单列表
     *
     * @param model
     * @return
     */
    public WebMessage findBetList(BetModel model);

    /**
     * 查询用户个人热门方案
     *
     * @return
     */
    public WebMessage queryUserHotPlan(PlanBaseModel model);

    public void test();

}