package nbm.cash.seamless.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.client.result.UpdateResult;
import nbm.cash.seamless.entity.BetEntity;
import nbm.cash.seamless.entity.UserEntity;
import nbm.cash.seamless.entity.WeekMonthData;
import nbm.cash.seamless.request.task.BaseTaskModel;
import nbm.cash.seamless.request.task.BetTaskModel;
import nbm.cash.seamless.request.task.FollowTaskModel;
import nbm.cash.seamless.request.task.SettleTaskModel;
import nbm.cash.seamless.service.TaskService;
import nbm.cash.seamless.utils.other.DataUtils;
import nbm.cash.seamless.utils.other.DateUtils;
import nbm.cash.seamless.utils.other.LogUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

/**
 * @Description 统计服务类
 * @ClassName TaskServiceImpl
 * @Author New
 * @Date 2019/11/18 15:29
 * @Version V1.0
 **/
@Service("taskService")
public class TaskServiceImpl implements TaskService {

    protected static final Logger logger = LogManager.getLogger(TaskServiceImpl.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Transactional
    @Override
    public Boolean followTaskService(FollowTaskModel model) {
        try {
            Query query = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
            BetEntity bet = mongoTemplate.findOne(query, BetEntity.class);

            Update update = new Update();
            update.set("followCount", bet.getFollowCount() + 1);
            update.set("followAmount", bet.getFollowAmount().add(model.getOrderAmount()));
            UpdateResult result = mongoTemplate.updateFirst(query, update, BetEntity.class);
            if (result != null && result.getModifiedCount() == 1) {
                return true;
            }
        } catch (Exception e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[统计跟单数和跟单总金额出错：]" + JSON.toJSONString(model), e);
        }
        return false;
    }

    @Override
    public Boolean betTaskService(BetTaskModel model) {
        //下单成功，统计下单用户的下单总数以及下单总金额
        try {
            // 查询下单用户
            Query query = Query.query(Criteria.where("userId").is(model.getUserId()));
            UserEntity user = mongoTemplate.findOne(query, UserEntity.class);
            Update update = new Update();
            update.set("betCount", user.getBetCount() + 1);
            update.set("totalBetAmount", user.getTotalBetAmount().add(model.getOrderAmount()));

            UpdateResult result = mongoTemplate.upsert(query, update, UserEntity.class);
            if (result != null && result.getModifiedCount() == 1) {
                return true;
            }
        } catch (Exception e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[统计下单总数和下单总金额出错：]" + JSON.toJSONString(model), e);
        }
        return false;
    }

    @Transactional
    @Override
    public Boolean settleTaskService(SettleTaskModel model) {
        //注意，二次结算不处理
        if (model.getIsReBill() == 1) {
            return true;
        }

        // 结算成功后，统计用户的相关数据
        // 如果此单为方案，还需统计方案相关数据
        try {
            // 查询注单详细信息
            Query queryBet = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
            BetEntity bet = mongoTemplate.findOne(queryBet, BetEntity.class);
            if (bet == null) {
                return false;
            }

            // 查询下单用户
            Query queryUser = Query.query(Criteria.where("userId").is(bet.getUserId()));
            UserEntity user = mongoTemplate.findOne(queryUser, UserEntity.class);

            Update updateUser = new Update(); // 更新用户信息相关值
            updateUser.set("totalReturn", user.getTotalReturn().add(model.getTotalPayment())); // 总返还金额
            updateUser.set("settleWeek", user.getSettleWeek() + 1); // 本周已结算单数
            updateUser.set("settleMonth", user.getSettleMonth() + 1); // 本月已结算单数

            if (bet.getSettlement().compareTo(bet.getBetAmount()) > 0) {
                updateUser.set("winBetCount", user.getWinBetCount() + 1); // 赢得单数
                updateUser.set("totalWinAmount", user.getTotalWinAmount().add(model.getTotalPayment().subtract(bet.getBetAmount())));
            }

            if (bet.getTicketType() == 2) {
                user.setPlanReturn(user.getPlanReturn().add(model.getTotalPayment())); // 方案返还金额
                updateUser.set("planReturn", user.getPlanReturn()); // 方案返还金额
                updateUser.set("commission", user.getCommission().add(bet.getRecCommission()));

                WeekMonthData data = JSON.toJavaObject(JSONObject.parseObject(user.getWeekMonthData()), WeekMonthData.class); // 周、月统计数据
                data.setBetReturnMonth(data.getBetReturnMonth().add(model.getTotalPayment())); // 累加月返还
                data.setBetReturnWeek(data.getBetReturnWeek().add(model.getTotalPayment())); // 累加周返还

                if (bet.getSettlement().compareTo(bet.getBetAmount()) > 0) {
                    data.setBetWinMonth(data.getBetWinMonth() + 1); // 累加月赢单数
                    data.setBetWinWeek(data.getBetWinWeek() + 1); // 累加周赢单数

                    updateUser.set("winPlanCount", user.getWinPlanCount() + 1); // 赢的方案数
                    updateUser.set("totalLongRed", user.getTotalLongRed() + bet.getFollowCount()); // 累计带红人数
                    updateUser.set("weekRed", user.getWeekRed() + bet.getFollowCount()); // 周带红
                    updateUser.set("monthRed", user.getMonthRed() + bet.getFollowCount()); // 月带红
                    updateUser.set("currentHit", user.getCurrentHit() + 1); // 当前连红
                    // 如果当前连红数大于历史连红数，更新历史连红
                    if ((user.getCurrentHit() + 1) > user.getHistoryHit()) {
                        updateUser.set("historyHit", user.getCurrentHit() + 1); // 历史连红
                    }

                    updateUser.set("monthHit", user.getMonthHit() + 1); //月连红
                    updateUser.set("weekHit", user.getWeekHit() + 1); //周连红
                } else {
                    Query bet3Query = Query.query(Criteria.where("userId").is(bet.getUserId()).and("planTime").gt(bet.getPlanTime()).and("ticketType").is(2).and("betState").is(3));
                    bet3Query.with(Sort.by(Sort.Order.desc("planTime")));
                    List<BetEntity> betList = mongoTemplate.find(bet3Query, BetEntity.class);
                    if (betList != null && betList.size() > 0) {
                        int count = 0;
                        for (BetEntity betModel : betList) {
                            if (betModel.getSettleResult() > 1) {
                                count++;
                            } else {
                                break;
                            }
                        }
                        user.setCurrentHit(count); // 设置当前连红

                        //查询此用户所有已结算的方案
                        Query all = Query.query(Criteria.where("userId").is(bet.getUserId()).and("ticketType").is(2).and("betState").is(3));
                        all.with(Sort.by(Sort.Order.desc("planTime")));
                        List<BetEntity> allBet = mongoTemplate.find(all, BetEntity.class);

                        updateUser.set("historyHit", countLongRed(allBet, "all")); // 历史连红
                        updateUser.set("monthHit", countLongRed(allBet, "month")); //月连红
                        updateUser.set("weekHit", countLongRed(allBet, "week")); //周连红
                    } else {
                        user.setCurrentHit(0); // 清空当前连红
                    }
                }

                Query bet10Query = Query.query(Criteria.where("userId").is(bet.getUserId()).and("ticketType").is(2).and("betState").is(3));
                bet10Query.skip(0).limit(10);
                bet10Query.with(Sort.by(Sort.Order.desc("planTime")));
                List<BetEntity> bet10List = mongoTemplate.find(bet10Query, BetEntity.class);

                if (bet10List != null && bet10List.size() > 0) {
                    int count = 0;
                    for (BetEntity bet10 : bet10List) {
                        if (bet10.getSettlement().compareTo(bet10.getBetAmount()) > 0) {
                            count++;
                        }
                    }
                    updateUser.set("recentHit", bet10List.size() + "-" + count); // 近10单战绩
                }

                updateUser.set("planRate", DataUtils.except(user.getWinPlanCount(), user.getTotalPlan())); // 发单命中率
                updateUser.set("planReturnRate", DataUtils.except(user.getPlanReturn(), user.getPlanBetAmount())); // 方案返还率
                updateUser.set("betRateMonth", DataUtils.except(data.getBetWinMonth(), data.getBetCountMonth())); // 月命中率
                updateUser.set("betRateWeek", DataUtils.except(data.getBetWinWeek(), data.getBetCountWeek())); // 周命中率
                updateUser.set("betReturnRateMonth", DataUtils.except(data.getBetReturnMonth().subtract(data.getBetAmountMonth()), data.getBetAmountMonth())); // 月盈利率
                updateUser.set("betReturnRateWeek", DataUtils.except(data.getBetReturnWeek().subtract(data.getBetAmountWeek()), data.getBetAmountWeek())); // 周盈利率
                updateUser.set("weekMonthData", JSON.toJSONString(data));
            }

            updateUser.set("betRate", DataUtils.except(user.getWinBetCount(), user.getBetCount())); // 总命中率
            updateUser.set("betReturnRate", DataUtils.except(user.getTotalReturn(), user.getTotalBetAmount())); //总的盈利率

            // 更新
            UpdateResult resultUser = mongoTemplate.upsert(queryUser, updateUser, UserEntity.class);

            if (resultUser != null && resultUser.getModifiedCount() == 1) {
                return true;
            }
        } catch (Exception e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[结算统计出错：]" + JSON.toJSONString(model), e);
        }
        return false;
    }

    /**
     * 统计最高历史连红
     *
     * @param betList
     * @return
     */
    private Integer countLongRed(List<BetEntity> betList, String type) {
        Integer count = 0; // 当前连红
        Integer high = 0; // 历史最高
        if ("all".equals(type)) {
            for (BetEntity bet : betList) {
                if (bet.getSettleResult() > 1) {
                    count++;
                } else {
                    if (count > high) {
                        high = count;
                    }
                    count = 0;
                }
            }
        } else if ("month".equals(type)) {
            Long endLine = DateUtils.getMonthLong(new Date());
            for (BetEntity bet : betList) {
                if (bet.getPlanTime() < endLine) {
                    if (bet.getSettleResult() > 1) {
                        count++;
                    } else {
                        if (count > high) {
                            high = count;
                        }
                        count = 0;
                    }
                } else {
                    break;
                }
            }
        } else if ("week".equals(type)) {
            Long endLine = DateUtils.getWeekLong(new Date());
            for (BetEntity bet : betList) {
                if (bet.getPlanTime() < endLine) {
                    if (bet.getSettleResult() > 1) {
                        count++;
                    } else {
                        if (count > high) {
                            high = count;
                        }
                        count = 0;
                    }
                } else {
                    break;
                }
            }
        }
        return high;
    }
}