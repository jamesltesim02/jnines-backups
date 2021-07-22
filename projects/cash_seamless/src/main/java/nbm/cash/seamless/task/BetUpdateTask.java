package nbm.cash.seamless.task;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.entity.BetEntity;
import nbm.cash.seamless.service.SeamlessService;
import nbm.cash.seamless.utils.other.LogUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.concurrent.*;

@Component
public class BetUpdateTask {

    //队列大小
    private final int QUEUE_LENGTH = 10000 * 10;
    //基于内存的阻塞队列
    private BlockingQueue<JSONObject> queue = new LinkedBlockingQueue<JSONObject>(QUEUE_LENGTH);
    //创建计划任务执行器
    private ScheduledExecutorService es = Executors.newScheduledThreadPool(1);

    protected static final Logger logger = LogManager.getLogger(BetUpdateTask.class);
    @Autowired
    private SeamlessService seamlessService;
    private static BetUpdateTask betUpdateTask;

    @PostConstruct //通过@PostConstruct实现初始化bean之前进行的操作
    public void init() {
        betUpdateTask = this;
        betUpdateTask.seamlessService = this.seamlessService;
        // 初使化时将已静态化的testService实例化
    }

    /**
     * 构造函数，执行execute方法
     */
    public BetUpdateTask() {
        execute();
    }

    /**
     * 添加信息至队列中
     *
     * @param ob
     */
    public void addQueue(JSONObject ob) {
        logger.info(LogUtils.getLogStart("INFO") + " 下单成功后修改注单状态队列" + ob);
        queue.add(ob);
    }

    /**
     * 初始化执行
     */
    public void execute() {
        // 每一分钟执行一次
        es.scheduleWithFixedDelay(new Runnable() {
            public void run() {
                try {
                    if (queue.size() > 0) {
                        for (int i = 0; i < queue.size(); i++) {
                            JSONObject ob = queue.take();
                            logger.info(LogUtils.getLogStart("INFO") + " 取出队列注单修改状态" + ob);
                            long count = betUpdateTask.seamlessService.UpdateBetState(ob);
                            if (count == 0) {
                                betUpdateTask.addQueue(ob);
                            }
                        }
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

        }, 0, 1, TimeUnit.MINUTES);
    }
}
