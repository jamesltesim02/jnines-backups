package nbm.cash.seamless.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.DBObject;
import com.mongodb.client.result.UpdateResult;
import nbm.cash.seamless.entity.BetEntity;
import nbm.cash.seamless.entity.UserEntity;
import nbm.cash.seamless.entity.WeekMonthData;
import nbm.cash.seamless.queue.QueueModel;
import nbm.cash.seamless.request.OrderPost;
import nbm.cash.seamless.request.PageModel;
import nbm.cash.seamless.request.plan.*;
import nbm.cash.seamless.request.task.FollowTaskModel;
import nbm.cash.seamless.service.PlanService;
import nbm.cash.seamless.service.SeamlessService;
import nbm.cash.seamless.utils.http.RespCodeEnum;
import nbm.cash.seamless.utils.http.WebMessage;
import nbm.cash.seamless.utils.other.DbPageable;
import nbm.cash.seamless.utils.other.PageBean;
import nbm.cash.seamless.utils.other.UUIDUtils;
import nbm.cash.seamless.utils.redis.RedisUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.aggregation.UnwindOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Description
 * @ClassName PlanServiceImpl
 * @Author New
 * @Date 2019/11/13 11:05
 * @Version V1.0
 **/
@Service("planService")
public class PlanServiceImpl implements PlanService {

    protected static final Logger logger = LogManager.getLogger(PlanServiceImpl.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private SeamlessService seamlessService;

    @Autowired
    private RedisUtil redisUtil;

    @Transactional
    @Override
    public WebMessage publishPlan(PublishModel model) {
        Query queryBet = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
        BetEntity bet = mongoTemplate.findOne(queryBet, BetEntity.class);
        if (bet != null) {
            /** 只有串关才能发方案 */
            if (bet.getBetType() != 2 || bet.getTicketType() != 1) {
                return WebMessage.construct(RespCodeEnum.CAN_NOT_BE_DOWN);
            }

            Long rightNow = new Date().getTime(); // 当前时间毫秒数
            //判断，当发单时间在开赛10分钟之前才允许发单
            if (bet.getDisplayTime() > rightNow) {
                Update updateBet = new Update();
                // 发单更改属性
                updateBet.set("planState", 0);
                updateBet.set("ticketType", 2);
                updateBet.set("planTitle", model.getTitle());
                updateBet.set("planContent", model.getContent());
                updateBet.set("planTime", rightNow);
                updateBet.set("isRake", model.getIsRake());
                updateBet.set("rakeRate", model.getRakeRate());
                updateBet.set("ensureOdds", model.getEnsureOdds());
                updateBet.set("minFollowAmount", model.getMinFollowAmount());

                // 发单统计属性
                updateBet.set("recCommission", BigDecimal.ZERO);
                updateBet.set("followAmount", BigDecimal.ZERO);
                updateBet.set("followCount", 0);

                Query queryUser = Query.query(Criteria.where("userId").is(bet.getUserId()));
                UserEntity user = mongoTemplate.findOne(queryUser, UserEntity.class);
                Update updateUser = new Update();
                WeekMonthData data = JSON.toJavaObject(JSONObject.parseObject(user.getWeekMonthData()), WeekMonthData.class); // 周、月统计数据
                data.setBetAmountMonth(data.getBetAmountMonth().add(bet.getBetAmount())); // 累加月投注额
                data.setBetAmountWeek(data.getBetAmountWeek().add(bet.getBetAmount())); // 累加周投注额
                data.setBetCountMonth(data.getBetCountMonth() + 1); // 累加月投单数
                data.setBetCountWeek(data.getBetCountWeek() + 1); // 累加周投注单数
                updateUser.set("weekMonthData", JSON.toJSONString(data));
                updateUser.set("usablePlan", user.getUsablePlan() + 1);
                updateUser.set("totalPlan", user.getTotalPlan() + 1);
                updateUser.set("planBetAmount", user.getPlanBetAmount().add(bet.getBetAmount()));

                UpdateResult resultBet = mongoTemplate.upsert(queryBet, updateBet, BetEntity.class);
                UpdateResult resultUser = mongoTemplate.upsert(queryUser, updateUser, UserEntity.class);

                if (resultBet != null && resultBet.getModifiedCount() == 1 && resultUser != null && resultUser.getModifiedCount() == 1) {
                    return WebMessage.success();
                } else {
                    return WebMessage.construct(RespCodeEnum.ERROR);
                }
            } else {
                return WebMessage.construct(RespCodeEnum.PUBLISH_OVERTIME);
            }
        } else {
            return WebMessage.construct(RespCodeEnum.DATA_NOT_EXIST);
        }
    }

    @Transactional
    @Override
    public WebMessage followPlan(FellowModel model) {
        Query query = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
        BetEntity bet = mongoTemplate.findOne(query, BetEntity.class);
        if (bet != null) {
            /** 跟单金额必须大于最小跟单金额 */
            if (model.getBetAmount().compareTo(bet.getMinFollowAmount()) < 0) {
                return WebMessage.construct(RespCodeEnum.BET_AMOUNT_SMALL);
            }

            // 开赛前10分钟后不允许跟单
            if (bet.getDisplayTime() > new Date().getTime()) {
                OrderPost post = new OrderPost(bet, model);
                post.setTicketType(3);
                try {
                    JSONObject obj = seamlessService.followPlan(post);
                    if (obj.getIntValue("code") == 200) {
                        UserInfo info = JSONObject.parseObject(obj.getString("data"), UserInfo.class);
                        // 跟单成功，加入跟单队列，处理统计数据
                        QueueModel.follow_queue.add(new FollowTaskModel(model.getTicketId(), model.getBetAmount(), info.getUserId()));
                        return WebMessage.success(obj.getIntValue("code"), obj.getString("message"), info);
                    } else {
                        return WebMessage.construct(RespCodeEnum.SIGNATURE_INVALID);
                    }
                } catch (Exception e) {
                    return WebMessage.error();
                }
            } else {
                return WebMessage.construct(RespCodeEnum.PUBLISH_OVERTIME);
            }
        }
        return WebMessage.construct(RespCodeEnum.DATA_NOT_EXIST);
    }

    @Transactional
    @Override
    public WebMessage showPlan(PlanBaseModel model) {
        try {
            Query query = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
            BetEntity bet = mongoTemplate.findOne(query, BetEntity.class);

            Update update = new Update();
            update.set("isShare", 1);
            update.set("shareTitle", 1);
            update.set("shareContent", 1);
            update.set("shareTime", new Date().getTime());

            mongoTemplate.updateFirst(query, update, BetEntity.class);
        } catch (Exception e) {
            return WebMessage.construct(RespCodeEnum.TICKET_BILLED);
        }
        return WebMessage.success();
    }

    @Override
    public WebMessage queryHotPlan(PlanBaseModel model) {
        DbPageable pageable = new DbPageable();
        PageModel pm = new PageModel();
        pm.setPageNumber(model.getPageIndex());
        pm.setPageSize(model.getPageSize());
        List<Sort.Order> orders = new ArrayList<>();  //排序
        orders.add(new Sort.Order(Sort.Direction.DESC, "medaLevel"));
        orders.add(new Sort.Order(Sort.Direction.DESC, "isTop"));
        orders.add(new Sort.Order(Sort.Direction.DESC, "followCount"));
        orders.add(new Sort.Order(Sort.Direction.DESC, "followAmount"));
        pm.setSort(Sort.by(orders));
        pageable.setPage(pm);
        //拼装关联信息
        LookupOperation lookupOperation = LookupOperation.newLookup().
                from("user").//关联表名
                localField("userId").//关联字段
                foreignField("userId").//主表关联字段对应的次表字段
                as("user");//查询结果集合名
        //拼装具体查询信息
        //次表
        Criteria betCri = Criteria.where("ticketType").is(2).and("betState").lt(3).and("displayTime").gt(System.currentTimeMillis()).and("planState").is(1);//只查询发过单的注单
        if (model.getIsTop() != null) {
            betCri.and("isTop").is(1);
        }
        AggregationOperation betMatch = Aggregation.match(betCri);
        //主表
        Criteria userCri = Criteria.where("user.userState").is(1);
        if (model.getNickName() != null && !"".equals(model.getNickName())) {
            userCri.and("user.nickName").regex(model.getNickName());
        }
        AggregationOperation userMatch = Aggregation.match(userCri);
        AggregationOperation fiel = Aggregation.project("user.userId", "user.userName", "user.nickName", "user.header", "user.userLevel", "user.settleWeek", "user.medaLevel", "user.betRateWeek", "user.betRateMonth", "user.monthHit", "user.userState", "user.weekHit", "ticketId", "user.currency", "betAmount", "followAmount", "followCount", "planTime", "displayTime", "planTitle", "betState", "isTop", "ticketType", "sportId", "planContent", "settlement", "recCommission","bets","planState");

        /*AggregationOperation fiel = Aggregation.project("userId","userName","userLevel","medaLevel","betRateWeek","betRateMonth","betState");*/
        UnwindOperation unwind = Aggregation.unwind("user");
        //分页查询
        Aggregation aggregation = Aggregation.newAggregation(lookupOperation, unwind, userMatch, betMatch, fiel, Aggregation.sort(pageable.getSort()),
                Aggregation.skip(pageable.getPageNumber() > 1 ? (pageable.getPageNumber() - 1) * pageable.getPageSize() : 0),
                Aggregation.limit(pageable.getPageSize()));
        //总数查询
        Aggregation counts = Aggregation.newAggregation(lookupOperation, userMatch, betMatch);
        Long count =Long.valueOf(mongoTemplate.aggregate(counts, "bet", DBObject.class).getMappedResults().size());
        List<JSONObject> results = mongoTemplate.aggregate(aggregation, "bet", JSONObject.class).getMappedResults();
        List<JSONObject> rs = new ArrayList<>();
        for (JSONObject ob : results) {
            ob.put("_id", ob.getString("_id"));
            ob.put("bets",JSONObject.parseArray(ob.getString("bets")));
            rs.add(ob);
        }
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), count, rs);
        return WebMessage.success(pg);
    }

    @Override
    public WebMessage queryHotPlanDetails(String ticketId ,String token) {
        JSONObject rsp = new JSONObject();
        Query query = Query.query(Criteria.where("ticketId").is(ticketId));
        List<BetEntity> entity = this.mongoTemplate.find(query, BetEntity.class);
        if (entity != null && entity.size() != 0) {
            LookupOperation lookupOperation = LookupOperation.newLookup().
                    from("user").//关联表名
                    localField("userId").//关联字段
                    foreignField("userId").//主表关联字段对应的次表字段
                    as("user");//查询结果集合名
            Criteria betCri = Criteria.where("ticketId").is(ticketId).and("betState").gt(1);
            AggregationOperation betMatch = Aggregation.match(betCri);
            UnwindOperation unwind = Aggregation.unwind("user");
            AggregationOperation fiel = Aggregation.project("user.userId", "user.userName", "user.nickName", "user.header", "user.userLevel", "user.settleWeek", "user.medaLevel", "user.betRateWeek", "user.betRateMonth", "user.monthHit", "user.weekHit", "ticketId", "user.currency", "betAmount", "followAmount", "followCount", "planTime", "displayTime", "planTitle", "betState", "sportId", "planContent", "settlement", "recCommission","bets","planState");
            Aggregation aggregation = Aggregation.newAggregation(lookupOperation, unwind, betMatch, fiel);
            List<JSONObject> results = mongoTemplate.aggregate(aggregation, "bet", JSONObject.class).getMappedResults();
            if (!results.isEmpty()) {
                JSONObject rs = results.get(0);
                rs.put("_id", rs.getString("_id"));
                rs.put("bets",JSONObject.parseArray(rs.getString("bets")));
                rsp.put("hotPlan", rs);
                PlanBaseModel pb = new PlanBaseModel();
                pb.setTicketId(ticketId);
                pb.setPageIndex(1);
                pb.setPageSize(10);
                PageBean pg = this.getBetFollows(pb);
                rsp.put("betFollows", pg);
            }
            String userId = "";
            if(token!=null){
                userId = redisUtil.get(token).toString();
            }
            BetEntity bet = entity.get(0);
            if (bet.getBetState() == 3 ||(userId!=null&&!"".equals(userId)&&userId.equals(bet.getUserId())) ) {
                rsp.put("options", JSONObject.parseArray(entity.get(0).getOptions()));
            }
        }


        return WebMessage.success(rsp);
    }

    @Override
    public PageBean getBetFollows(PlanBaseModel model) {
        DbPageable pageable = new DbPageable();
        PageModel pm = new PageModel();
        pm.setPageNumber(model.getPageIndex());
        pm.setPageSize(model.getPageSize());
        List<Sort.Order> orders = new ArrayList<>();  //排序
        orders.add(new Sort.Order(Sort.Direction.DESC, "betTime"));
        pm.setSort(Sort.by(orders));
        pageable.setPage(pm);
        //拼装关联信息
        LookupOperation lookupOperation = LookupOperation.newLookup().
                from("user").//关联表名
                localField("userId").//关联字段
                foreignField("userId").//主表关联字段对应的次表字段
                as("user");//查询结果集合名
        Criteria betCri = Criteria.where("followTicket").is(model.getTicketId());
        AggregationOperation betMatch = Aggregation.match(betCri);
        AggregationOperation fiel = Aggregation.project("user.userName", "user.nickName", "betAmount", "settlement", "payCommission", "betTime");
        UnwindOperation unwind = Aggregation.unwind("user");

        //分页查询
        Aggregation aggregation = Aggregation.newAggregation(lookupOperation, unwind, betMatch, fiel, Aggregation.sort(pageable.getSort()),
                Aggregation.skip(pageable.getPageNumber() > 1 ? (pageable.getPageNumber() - 1) * pageable.getPageSize() : 0),
                Aggregation.limit(pageable.getPageSize()));
        //总数查询
        Aggregation counts = Aggregation.newAggregation(lookupOperation, unwind, betMatch);
        Long count =  Long.valueOf(mongoTemplate.aggregate(counts, "bet", DBObject.class).getMappedResults().size());
        List<JSONObject> results = mongoTemplate.aggregate(aggregation, "bet", JSONObject.class).getMappedResults();
       /* List<JSONObject> rsp = new ArrayList<>();
        if(results!=null){
            for (DBObject  obj: results) {
                JSONObject jo = new JSONObject();
               obj.removeField("_id");

            }
        }*/
        List<JSONObject> rs = new ArrayList<>();
        for (JSONObject ob : results) {
            ob.put("_id", ob.getString("_id"));
            rs.add(ob);
        }
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), count, rs);
        return pg;
    }

    @Override
    public WebMessage findBetList(BetModel model) {

        Query query = Query.query(Criteria.where("userId").is(model.getUserId()));
        if (model.getStartTime() != null && model.getEndTime() != null) {
            query.addCriteria(new Criteria().andOperator(Criteria.where("betTime").gt(model.getStartTime()), Criteria.where("betTime").lt(model.getEndTime())));
        } else {
            if (model.getStartTime() != null) {
                query.addCriteria(Criteria.where("betTime").gt(model.getStartTime()));
            }

            if (model.getEndTime() != null) {
                query.addCriteria(Criteria.where("betTime").lt(model.getEndTime()));
            }
        }

        if (model.getLiveType() == 0) {
            query.addCriteria(Criteria.where("liveType").is(0));
            switch (model.getType()) {
                case 0:
                    /** 未结算 */
                    query.addCriteria(Criteria.where("betState").is(2));
                    break;

                case 1:
                    /** 赢的注单 */
                    query.addCriteria(Criteria.where("settleResult").gt(0));
                    break;

                case 2:
                    /** 输的注单 */
                    query.addCriteria(Criteria.where("settleResult").lte(0));
                    break;

                case 3:
                    /** 自购 */
                    query.addCriteria(Criteria.where("ticketType").lt(3));
                    break;

                case 4:
                    /** 跟单 */
                    query.addCriteria(Criteria.where("ticketType").is(3));
                    break;
            }
        } else {
            query.addCriteria(Criteria.where("liveType").is(1));
            switch (model.getType()) {
                case 0:
                    /** 未结算 */
                    query.addCriteria(Criteria.where("betState").is(2));
                    break;
                case 1:
                    /** 结算 */
                    query.addCriteria(Criteria.where("betState").ne(2));
                    break;
            }
        }

        //查询总条数
        List<BetEntity> countList = mongoTemplate.find(query, BetEntity.class);
        // 分页
        query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
        // 按下单时间倒序
        query.with(Sort.by(Sort.Order.desc("betTime")));
        List<BetEntity> betList = mongoTemplate.find(query, BetEntity.class);
        for (BetEntity bet : betList) {
            if(bet.getBetState() == 2 && bet.getTicketType() == 3){
                bet.setOptions("");
            }
        }
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), Long.valueOf(countList.size()), betList);
        return WebMessage.success(pg);
    }

    @Override
    public WebMessage queryUserHotPlan(PlanBaseModel model) {
        DbPageable pageable = new DbPageable();
        PageModel pm = new PageModel();
        pm.setPageNumber(model.getPageIndex());
        pm.setPageSize(model.getPageSize());
        List<Sort.Order> orders = new ArrayList<>();  //排序
        orders.add(new Sort.Order(Sort.Direction.DESC, "planTime"));
        pm.setSort(Sort.by(orders));
        pageable.setPage(pm);
        Criteria betCri = Criteria.where("userId").is(model.getUserId()).and("ticketType").is(2);
        if (model.getSportId() != null) {
            betCri.and("sportId").is(model.getSportId());
        }
        AggregationOperation betMatch = Aggregation.match(betCri);
        AggregationOperation fiel = Aggregation.project("ticketId", "betAmount", "followAmount", "followCount", "settleWeek", "planTime", "displayTime", "planTitle", "betState", "ticketType", "userId", "sportId", "planContent", "settlement", "recCommission","bets","planState");
        Aggregation aggregation = Aggregation.newAggregation(betMatch, fiel, Aggregation.sort(pageable.getSort()),
                Aggregation.skip(pageable.getPageNumber() > 1 ? (pageable.getPageNumber() - 1) * pageable.getPageSize() : 0),
                Aggregation.limit(pageable.getPageSize()));
        //总数查询
        Aggregation counts = Aggregation.newAggregation(betMatch);
        Long count = Long.valueOf(mongoTemplate.aggregate(counts, "bet", DBObject.class).getMappedResults().size());
        List<JSONObject> results = mongoTemplate.aggregate(aggregation, "bet", JSONObject.class).getMappedResults();
        List<JSONObject> rs = new ArrayList<>();
        for (JSONObject ob : results) {
            ob.put("_id", ob.getString("_id"));
            ob.put("bets",JSONObject.parseArray(ob.getString("bets")));
            rs.add(ob);
        }
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), count, rs);
        return WebMessage.success(pg);
    }

    @Override
    public void test() {
        UserEntity user1 = new UserEntity();
        user1.setUserId("H88agredbull108");
        user1.setNbmmUserId(UUIDUtils.getLongUID());
        user1.setNickName("全线飙红");
        user1.setCreateTime(System.currentTimeMillis());

        UserEntity user2 = new UserEntity();
        user2.setUserId("H88agrednet666");
        user2.setNbmmUserId(UUIDUtils.getLongUID());
        user2.setNickName("竞彩老司机");
        user2.setCreateTime(System.currentTimeMillis());

        UserEntity user3 = new UserEntity();
        user3.setUserId("H88agredbruce5");
        user3.setNbmmUserId(UUIDUtils.getLongUID());
        user3.setNickName("匿名呵呵呵");
        user3.setCreateTime(System.currentTimeMillis());

        UserEntity user4 = new UserEntity();
        user4.setUserId("H88agredconnor");
        user4.setNbmmUserId(UUIDUtils.getLongUID());
        user4.setNickName("金牌老司机");
        user4.setCreateTime(System.currentTimeMillis());

        UserEntity user5 = new UserEntity();
        user5.setUserId("H88agredted999");
        user5.setNbmmUserId(UUIDUtils.getLongUID());
        user5.setNickName("匿名");
        user5.setCreateTime(System.currentTimeMillis());

        mongoTemplate.save(user1);
        mongoTemplate.save(user2);
        mongoTemplate.save(user3);
        mongoTemplate.save(user4);
        mongoTemplate.save(user5);
    }

}