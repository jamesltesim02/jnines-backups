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
public class BetSaveTask {

    //队列大小
    private final int QUEUE_LENGTH = 10000 * 10;
    //基于内存的阻塞队列
    private BlockingQueue<BetEntity> queue = new LinkedBlockingQueue<BetEntity>(QUEUE_LENGTH);
    //创建计划任务执行器
    private ScheduledExecutorService es = Executors.newScheduledThreadPool(1);

    protected static final Logger logger = LogManager.getLogger(BetSaveTask.class);
    @Autowired
    private SeamlessService seamlessService;
    private static BetSaveTask betSaveTask;

    @PostConstruct //通过@PostConstruct实现初始化bean之前进行的操作
    public void init() {
        betSaveTask = this;
        betSaveTask.seamlessService = this.seamlessService;
        // 初使化时将已静态化的testService实例化
    }

    /**
     * 构造函数，执行execute方法
     */
    public BetSaveTask() {
        execute();
    }

    /**
     * 添加信息至队列中
     *
     * @param bet
     */
    public void addQueue(BetEntity bet) {
        logger.info(LogUtils.getLogStart("INFO") + " 下单成功后添加注单到队列" + JSONObject.toJSONString(bet));
        queue.add(bet);
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
                            BetEntity bet = queue.take();
                            logger.info(LogUtils.getLogStart("INFO") + " 取出队列注单保存" + JSONObject.toJSONString(bet));
                            betSaveTask.seamlessService.saveBet(bet);
                        }
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

        }, 0, 1, TimeUnit.MINUTES);
    }
}
