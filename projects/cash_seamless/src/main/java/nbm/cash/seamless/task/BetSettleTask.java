package nbm.cash.seamless.task;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.entity.BetEntity;
import nbm.cash.seamless.request.SettleFollowTicketModel;
import nbm.cash.seamless.request.SettleModel;
import nbm.cash.seamless.service.SeamlessService;
import nbm.cash.seamless.utils.other.LogUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.concurrent.*;

@Component
public class BetSettleTask {
    //队列大小
    private final int QUEUE_LENGTH = 10000 * 10;
    //基于内存的阻塞队列
    private BlockingQueue<SettleFollowTicketModel> queue = new LinkedBlockingQueue<SettleFollowTicketModel>(QUEUE_LENGTH);
    //创建计划任务执行器
    private ScheduledExecutorService es = Executors.newScheduledThreadPool(1);

    protected static final Logger logger = LogManager.getLogger(BetSaveTask.class);
    @Autowired
    private SeamlessService seamlessService;
    private static BetSettleTask betSettleTask;

    @PostConstruct //通过@PostConstruct实现初始化bean之前进行的操作
    public void init() {
        betSettleTask = this;
        betSettleTask.seamlessService = this.seamlessService;
        // 初使化时将已静态化的testService实例化
    }


    /**
     * 构造函数，执行execute方法
     */
    public BetSettleTask() {
        execute();
    }

    /**
     * 添加信息至队列中
     *
     * @param
     */
    public void addQueue(SettleFollowTicketModel model) {
        logger.info(LogUtils.getLogStart("INFO") + " 跟单注单添加注单到结算队列" + JSONObject.toJSONString(model));
        queue.add(model);
    }

    /**
     * 初始化执行
     */
    public void execute() {
        //每两分钟执行一次
        es.scheduleWithFixedDelay(new Runnable() {
            public void run() {
                try {
                    if (queue.size() > 0) {
                        for (int i = 0; i < queue.size(); i++) {
                            SettleFollowTicketModel model = queue.take();
                            logger.info(LogUtils.getLogStart("INFO") + " 结算跟单注单" + JSONObject.toJSONString(model));
                            betSettleTask.seamlessService.settleBet(model);
                        }
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }, 0, 1, TimeUnit.MINUTES);
    }

}
