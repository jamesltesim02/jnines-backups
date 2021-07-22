package nbm.cash.seamless.queue;

import com.alibaba.fastjson.JSON;
import nbm.cash.seamless.request.task.BetTaskModel;
import nbm.cash.seamless.request.task.FollowTaskModel;
import nbm.cash.seamless.service.TaskService;
import nbm.cash.seamless.utils.other.LogUtils;
import nbm.cash.seamless.utils.spring.SpringBeanFactoryUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @Description 下单成功后统计任务
 * @ClassName BetQueueTask
 * @Author New
 * @Date 2019/11/19 10:09
 * @Version V1.0
 **/
public class BetQueueTask implements Runnable {

    protected static final Logger logger = LogManager.getLogger(BetQueueTask.class);

    private final long SLEEP_MILLIS = 30 * 1000L;

    private TaskService taskService = SpringBeanFactoryUtils.getBean("taskService");

    @Override
    public void run() {
        try {
            while (true) {
                if (QueueModel.bet_queue.size() > 0) {
                    BetTaskModel model = QueueModel.bet_queue.take();
                    logger.info(LogUtils.getLogStart("INFO") + "[下单成功后统计任]" + JSON.toJSONString(model));
                    boolean falg = taskService.betTaskService(model);
                    if (!falg) {
                        if (model.getCount() <= 3) {
                            model.setCount(model.getCount() + 1);
                            QueueModel.bet_queue.add(model);
                        } else {
                            logger.error(LogUtils.getLogStart("FATAL") + "[下单成功后统计任:统计3次仍失败]" + JSON.toJSONString(model));
                        }
                    }
                } else {
                    Thread.sleep(SLEEP_MILLIS);
                }
            }
        } catch (InterruptedException e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[下单成功后统计任务线程休眠异常]" + e);
        } catch (Exception e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[下单成功后统计任务线程异常]" + e);
        }
    }
}