package nbm.cash.seamless.service;

import nbm.cash.seamless.request.task.BetTaskModel;
import nbm.cash.seamless.request.task.FollowTaskModel;
import nbm.cash.seamless.request.task.SettleTaskModel;

/**
 * @Description 统计任务服务接口
 * @ClassName TaskService
 * @Author New
 * @Date 2019/11/18 15:28
 * @Version V1.0
 **/
public interface TaskService {

    /**
     * 跟单成功后统计任务实际处理方法
     *
     * @param bet
     * @return
     */
    public Boolean followTaskService(FollowTaskModel bet);

    /**
     * 下单成功后统计任务实际处理方法
     *
     * @param model
     * @return
     */
    public Boolean betTaskService(BetTaskModel model);

    /**
     * 结算成功后统计任务实际处理方法
     *
     * @param model
     * @return
     */
    public Boolean settleTaskService(SettleTaskModel model);

}