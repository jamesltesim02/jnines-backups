package nbm.cash.seamless.queue;

import com.alibaba.fastjson.JSON;
import nbm.cash.seamless.request.task.BaseTaskModel;
import nbm.cash.seamless.request.task.BetTaskModel;
import nbm.cash.seamless.request.task.SettleTaskModel;
import nbm.cash.seamless.service.TaskService;
import nbm.cash.seamless.utils.other.LogUtils;
import nbm.cash.seamless.utils.spring.SpringBeanFactoryUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @Description 结算成功后统计任务
 * @ClassName SettleQueueTask
 * @Author New
 * @Date 2019/11/19 10:41
 * @Version V1.0
 **/
public class SettleQueueTask implements Runnable {

    protected static final Logger logger = LogManager.getLogger(SettleQueueTask.class);

    private final long SLEEP_MILLIS = 30 * 1000L;

    private TaskService taskService = SpringBeanFactoryUtils.getBean("taskService");

    @Override
    public void run() {
        try {
            while (true) {
                if (QueueModel.settlement_queue.size() > 0) {
                    SettleTaskModel model = QueueModel.settlement_queue.take();
                    logger.info(LogUtils.getLogStart("INFO") + "[结算成功后统计任]" + JSON.toJSONString(model));
                    boolean falg = taskService.settleTaskService(model);
                    if (!falg) {
                        if (model.getCount() <= 3) {
                            model.setCount(model.getCount() + 1);
                            QueueModel.settlement_queue.add(model);
                        } else {
                            logger.error(LogUtils.getLogStart("FATAL") + "[结算成功后统计任：3次统计失败]" + JSON.toJSONString(model));
                        }
                    }
                } else {
                    Thread.sleep(SLEEP_MILLIS);
                }
            }
        } catch (InterruptedException e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[结算成功后统计任务线程休眠异常]" + e);
        } catch (Exception e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[结算成功后统计任务线程休眠异常]" + e);
        }
    }
}