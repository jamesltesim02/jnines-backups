package nbm.cash.seamless.queue;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.entity.UserEntity;
import nbm.cash.seamless.service.SeamlessService;
import nbm.cash.seamless.utils.other.LogUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * @Description 定时任务
 * @ClassName TimerTask
 * @Author New
 * @Date 2019/11/18 17:21
 * @Version V1.0
 **/
@Component
@Configuration
@EnableScheduling
public class TimerTask {

    protected static final Logger logger = LogManager.getLogger(TimerTask.class);

    @Autowired
    private SeamlessService seamlessService;

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 清空每周统计
     * 每周一0点5分执行
     */
    @Scheduled(cron = "0 1 0 ? * MON")
    private void setWeekStatistics() {
        logger.info(LogUtils.getLogStart("INFO") + "周一重置周统计数据" + "TimerTask.class");
        Query query = new Query();
        Update update = new Update();
        update.set("betRateWeek", 0.0);
        update.set("betReturnRateWeek", 0.0);
        update.set("weekHit", 0);
        update.set("weekRed", 0);

        update.set("settleWeek", 0);
        update.set("weekMonthData.$.betCountWeek", 0);
        update.set("weekMonthData.$.betWinWeek", 0);
        update.set("weekMonthData.$.betAmountWeek", BigDecimal.ZERO);
        update.set("weekMonthData.$.betReturnWeek", BigDecimal.ZERO);
        mongoTemplate.upsert(query, update, UserEntity.class);
    }

    /**
     * 清空每月统计
     * 每月一号0点5分执行
     */
    @Scheduled(cron = "0 1 0 1 * ?")
    private void setMonthStatistics() {
        logger.info(LogUtils.getLogStart("INFO") + "[每月重置月统计数据]" + "TimerTask.class");
        Query query = Query.query(Criteria.where("userId").gt(0));
        Update update = new Update();
        update.set("betRateMonth", 0.0);
        update.set("betReturnRateMonth", 0.0);
        update.set("monthHit", 0);
        update.set("monthRed", 0);

        update.set("settleMonth", 0);
        update.set("weekMonthData.$.betCountMonth", 0);
        update.set("weekMonthData.$.betWinMonth", 0);
        update.set("weekMonthData.$.betAmountMonth", BigDecimal.ZERO);
        update.set("weekMonthData.$.betReturnMonth", BigDecimal.ZERO);
        mongoTemplate.upsert(query, update, UserEntity.class);
    }

    @Scheduled(cron = "* */5 * * * ?")
    private void token() {
        //logger.info(LogUtils.getLogStart("INFO") + "[保证Token不失效]" + "Token");
        try {
            //JSONObject obj = seamlessService.getBalance("bfc4cdcd41b549b9b3dca05547e759ac");
            //logger.info(LogUtils.getLogStart("INFO") + "[保证Token不失效]" + obj.toJSONString());
        } catch (Exception e) {

        }
    }
}