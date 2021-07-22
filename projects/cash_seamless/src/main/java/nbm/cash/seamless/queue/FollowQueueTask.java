package nbm.cash.seamless.queue;

import com.alibaba.fastjson.JSON;
import nbm.cash.seamless.request.task.FollowTaskModel;
import nbm.cash.seamless.service.TaskService;
import nbm.cash.seamless.utils.other.LogUtils;
import nbm.cash.seamless.utils.spring.SpringBeanFactoryUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * @Description 跟单完成后，需统计所跟方案的跟单数以及总跟单金额
 * @ClassName FollowQueueTask
 * @Author New
 * @Date 2019/11/15 13:48
 * @Version V1.0
 **/
public class FollowQueueTask implements Runnable {

    protected static final Logger logger = LogManager.getLogger(FollowQueueTask.class);

    private final long SLEEP_MILLIS = 30 * 1000L;

    private TaskService taskService = SpringBeanFactoryUtils.getBean("taskService");

    @Override
    public void run() {
        while (true) {
            try {
                if (QueueModel.follow_queue.size() > 0) {
                    FollowTaskModel model = QueueModel.follow_queue.take();
                    logger.info(LogUtils.getLogStart("INFO") + "[跟单成功后统计任]" + JSON.toJSONString(model));
                    boolean falg = taskService.followTaskService(model);
                    if (!falg) {
                        if (model.getCount() <= 3) {
                            model.setCount(model.getCount() + 1);
                            QueueModel.follow_queue.add(model);
                        } else {
                            logger.error(LogUtils.getLogStart("FATAL") + "[跟单成功后统计任：3次统计失败] " + JSON.toJSONString(model));
                        }
                    }
                } else {
                    Thread.sleep(SLEEP_MILLIS);
                }
            } catch (InterruptedException e) {
                logger.error(LogUtils.getLogStart("FATAL") + "[跟单成功后统计任务线程休眠异常] " + e);
            } catch (Exception e) {
                logger.error(LogUtils.getLogStart("FATAL") + "[跟单成功后统计任务线程异常]" + e);
            }
        }
    }
}