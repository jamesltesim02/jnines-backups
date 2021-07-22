package nbm.cash.seamless.queue;

import nbm.cash.seamless.request.task.BetTaskModel;
import nbm.cash.seamless.request.task.FollowTaskModel;
import nbm.cash.seamless.request.task.SettleTaskModel;
import nbm.cash.seamless.task.BetSaveTask;
import nbm.cash.seamless.task.BetSettleTask;
import nbm.cash.seamless.task.BetUpdateTask;

import java.util.concurrent.ArrayBlockingQueue;

/**
 * @Description 所有队列
 * @ClassName QueueModel
 * @Author New
 * @Date 2019/11/14 13:29
 * @Version V1.0
 **/
public class QueueModel {

    /**
     * 跟单成功后需要添加的队列
     */
    public static ArrayBlockingQueue<FollowTaskModel> follow_queue = new ArrayBlockingQueue<FollowTaskModel>(10000);

    /**
     * 下单成功后需要添加的队列
     */
    public static ArrayBlockingQueue<BetTaskModel> bet_queue = new ArrayBlockingQueue<BetTaskModel>(10000);

    /**
     * 结算成功后需要添加的队列
     */
    public static ArrayBlockingQueue<SettleTaskModel> settlement_queue = new ArrayBlockingQueue<SettleTaskModel>(10000);

    public static BetSaveTask bet_save = new BetSaveTask();

    public static BetSettleTask bet_settle = new BetSettleTask();

    public static BetUpdateTask bet_update = new BetUpdateTask();
}