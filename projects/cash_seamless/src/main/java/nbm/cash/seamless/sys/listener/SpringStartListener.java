package nbm.cash.seamless.sys.listener;

import nbm.cash.seamless.queue.BetQueueTask;
import nbm.cash.seamless.queue.FollowQueueTask;
import nbm.cash.seamless.queue.SettleQueueTask;
import nbm.cash.seamless.utils.other.LogUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;


/**
 * @Description 组件加载进容器后，启动所有统计任务线程
 * @ClassName SpringStartListener
 * @Author New
 * @Date 2019/11/18 10:28
 * @Version V1.0
 **/
@Component
public class SpringStartListener implements ApplicationListener<ContextRefreshedEvent> {

    protected static final Logger logger = LogManager.getLogger(SpringStartListener.class);

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        logger.info(LogUtils.getLogStart("INFO") + "[项目启动，启动相关统计线程] start......");

        /** 启动下单统计线程 */
        new Thread(new BetQueueTask()).start();

        /** 启动跟单统计线程 */
        new Thread(new FollowQueueTask()).start();

        /** 启动结算统计线程 */
        new Thread(new SettleQueueTask()).start();
    }
}