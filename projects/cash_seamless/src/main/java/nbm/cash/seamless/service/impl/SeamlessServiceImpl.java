package nbm.cash.seamless.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.client.result.UpdateResult;
import nbm.cash.seamless.constant.Constant;
import nbm.cash.seamless.entity.BetEntity;
import nbm.cash.seamless.entity.IntegralLogEntity;
import nbm.cash.seamless.entity.OptionEntity;
import nbm.cash.seamless.entity.UserEntity;
import nbm.cash.seamless.queue.QueueModel;
import nbm.cash.seamless.request.*;
import nbm.cash.seamless.request.integral.IntegralModel;
import nbm.cash.seamless.request.plan.FellowModel;
import nbm.cash.seamless.request.task.BetTaskModel;
import nbm.cash.seamless.request.task.SettleTaskModel;
import nbm.cash.seamless.service.SeamlessService;
import nbm.cash.seamless.utils.http.RespCodeEnum;
import nbm.cash.seamless.utils.http.SimpleHttpHelper;
import nbm.cash.seamless.utils.http.WebMessage;
import nbm.cash.seamless.utils.other.LogUtils;
import nbm.cash.seamless.utils.other.UUIDUtils;
import nbm.cash.seamless.utils.redis.RedisUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.*;

@Component("seamlessService")
public class SeamlessServiceImpl implements SeamlessService {
    @Resource
    Constant constant;

    @Autowired
    private MongoTemplate template;

    protected static final Logger logger = LogManager.getLogger(SeamlessServiceImpl.class);

    /**
     * 表名
     */
    private static final String collectionName = "user";

    @Autowired
    private RedisUtil redisUtil;


    @Override
    public JSONObject getBalance(String token)  {
        JSONObject rspJson = new JSONObject();
        TokenModel model = new TokenModel();
        model.setToken(token);
        try {
            String rsp = SimpleHttpHelper.postURL(constant.getQueryAccount(), JSONObject.toJSONString(model));
            logger.info(LogUtils.getLogStart("INFO") + " 请求用户信息返回值" + JSONObject.toJSONString(rsp));
            if (rsp.isEmpty()) {
                rspJson.put("code", RespCodeEnum.FAIL.getCode());
                rspJson.put("msg", RespCodeEnum.FAIL.getMessage());
                return rspJson;
            }
            rspJson = JSONObject.parseObject(rsp);
            if(rspJson.getInteger("code")!=null && rspJson.getInteger("code") == 200) {
                JSONObject data = rspJson.getJSONObject("data");
                /** 设置缓存时间：2小时 */
                redisUtil.set(token, rspJson.getJSONObject("data").getString("customerId"), Long.valueOf(2 * 60 * 60 * 1000));
                Query query = Query.query(Criteria.where("userId").is(data.getString("customerId")));
                UserEntity userRsp = this.template.findOne(query, UserEntity.class);
                if (userRsp == null) {
                    UserEntity userReq = new UserEntity();
                    userReq.setBalance(data.getBigDecimal("balance "));
                    userReq.setUserId(data.getString("customerId"));
                    userReq.setNbmmUserId(UUIDUtils.getLongUID());
                    userReq.setHeader("0");
                    userReq.setNickName("匿名");
                    userReq.setUserState(1);
                    userReq.setSex(1);
                    Object test = template.insert(userReq);
                } else {
                    Query query1 = Query.query(Criteria.where("userId").is(data.getString("customerId")));
                    Update update = new Update();
                    update.set("balance", data.getBigDecimal("balance "));
                    this.template.updateFirst(query1, update, collectionName);
                }
            }
        } catch (Exception e) {
            rspJson.put("WebMessage", WebMessage.error());
            logger.error("添加用户信息失败" + e);
            return rspJson;
        }

        return rspJson;
    }


    /**
     * 投注
     *
     * @param post
     * @return
     * @throws IOException
     */
    @Transactional
    @Override
    public JSONObject doBet(OrderPost post){
        logger.info(LogUtils.getLogStart("INFO") + " 下单请求参数" + JSONObject.toJSONString(post));
        JSONObject rspJson = new JSONObject();
        DecimalFormat df = new DecimalFormat("0.00");
        //保存注单状态为未确认（1）
        Optional<OptionModel> userOp = post.getOptionArray().stream().filter(Objects::nonNull).min(Comparator.comparingLong(OptionModel::getMatchStartTime));
        OptionModel minOp = userOp.orElse(new OptionModel());
        BetEntity bet = new BetEntity();
        //跟单截止时间根据最小开赛时间向前推10分钟
        bet.setDisplayTime(minOp.getMatchStartTime() - 10 * 60 * 1000);
        bet.setTicketId(post.getTicketId());
        //bet.setUserId(post.getUserId());
        bet.setCurrency(post.getCurrency());
        bet.setBetAmount(new BigDecimal(df.format(post.getOrderAmount())));
        bet.setBetType(post.getBetType());
        //bet.setBetTime(rspJson.getJSONObject("data").getLong("orderTime"));
        bet.setBetState(1);
        bet.setBets(JSONObject.toJSONString(post.getBetList()));
        bet.setOptions(JSONObject.toJSONString(post.getOptionArray()));
        bet.setSportId(post.getOptionArray().get(0).getSportNo());
        bet.setExpectPay(new BigDecimal(df.format(post.getOrderAmount().multiply(post.getBetList().get(0).getOddsEuro()))));
        if (minOp.getMatchStartTime() > System.currentTimeMillis()) {
            bet.setLiveType(0);
        } else {
            bet.setLiveType(1);
        }
        if (post.getTicketType() != null) {
            bet.setTicketType(post.getTicketType());
        } else {
            bet.setTicketType(1);
        }
        if (post.getFollowTicket() != null && post.getFollowTicket().length() > 0) {
            bet.setFollowTicket(post.getFollowTicket());
        }
        BetEntity be = this.saveBet(bet);
        String rsp = "";
        try {
            if (be != null) {
                rsp = SimpleHttpHelper.postURL(constant.getOrder(), JSONObject.toJSONString(post));
                if (rsp.isEmpty()) {
                    rspJson.put("code", RespCodeEnum.FAIL.getCode());
                    rspJson.put("message", RespCodeEnum.FAIL.getMessage());
                    return rspJson;
                }
                logger.info(LogUtils.getLogStart("INFO") + " 下单请求返回值" + JSONObject.toJSONString(rsp));
                rspJson = JSONObject.parseObject(rsp);
                if (rspJson.getInteger("code") == 200) {
                    String userId = rspJson.getJSONObject("data").getString("userId");
                    Query queryBet = Query.query(Criteria.where("ticketId").is(post.getTicketId()));
                    Update update = new Update();
                    //下单成功修改注单状态为已确认（2）
                    Query queryUser =new Query();
                    queryUser.addCriteria(Criteria.where("userId").is(userId));
                    UserEntity user = this.template.findOne(queryUser,UserEntity.class);
                    if(user != null){
                        update.set("userType",user.getUserType());
                    }
                    update.set("betState", 2);
                    update.set("userId", userId);
                    update.set("betTime", rspJson.getJSONObject("data").getLong("orderTime"));
                    UpdateResult rs = this.template.updateFirst(queryBet, update, BetEntity.class);
                    if (rs != null) {
                        QueueModel.bet_queue.add(new BetTaskModel(post.getTicketId(), userId, post.getOrderAmount()));
                        if (rs.getModifiedCount() == 0) {
                            JSONObject ob = new JSONObject();
                            ob.put("ticketId", post.getTicketId());
                            ob.put("betState", 2);
                            ob.put("userId", rspJson.getJSONObject("data").getString("userId"));
                            ob.put("betTime", rspJson.getJSONObject("data").getLong("orderTime"));
                            QueueModel.bet_update.addQueue(ob);
                        }
                    }

                }
            } else {
                rspJson.put("code", RespCodeEnum.FAIL.getCode());
                rspJson.put("message", RespCodeEnum.FAIL.getMessage());
                return rspJson;
            }
        } catch (IOException e) {
            logger.error(LogUtils.getLogStart("INFO") + " 下单异常" + JSONObject.toJSONString(post));
            e.printStackTrace();
        }

        return rspJson;
    }

    /**
     * 结算
     *
     * @param model
     * @return
     * @throws Exception
     */
    @Transactional
    @Override
    public JSONObject doSettle(SettleModel model) throws Exception {
        logger.info(LogUtils.getLogStart("INFO") + " 结算请求参数" + JSONObject.toJSONString(model));
        JSONObject rspJson = new JSONObject();
        DecimalFormat df = new DecimalFormat("0.00");
        JSONObject amountJson = new JSONObject();
        BigDecimal totalCommission = new BigDecimal(0);
        Query query1 = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
        BetEntity bet = this.template.findOne(query1, BetEntity.class);
        if (bet != null && bet.getTicketType() == 2) {
            Query query = Query.query(Criteria.where("followTicket").is(model.getTicketId()));
            List<BetEntity> betFollows = this.template.find(query, BetEntity.class);
            /**查询是否有跟单**/
            if (!betFollows.isEmpty()) {
                if (model.getTotalPayment().compareTo(BigDecimal.ZERO) == 1 && bet.getIsRake() == 1) {
                    model.setIsRake(1);
                    model.setRakeRate(bet.getRakeRate());
                    /**有跟单。赢且需要抽佣的情况下计算佣金和结算金额*/
                    for (BetEntity entity : betFollows) {
                        amountJson = this.calculateCommission(model, entity);
                        totalCommission = totalCommission.add(amountJson.getBigDecimal("commission"));
                    }
                    model.setTotalPayment(model.getTotalPayment().add(totalCommission));
                }
                for (BetEntity entity : betFollows) {
                    SettleFollowTicketModel settleFollowTicketModel = new SettleFollowTicketModel();
                    settleFollowTicketModel.setBetEntity(entity);
                    settleFollowTicketModel.setSettleModel(model);
                    /**跟单用另外的task发起结算，不影响主单结算*/
                    QueueModel.bet_settle.addQueue(settleFollowTicketModel);
                }
                /**跟单用另外的task发起结算，不影响主单结算*/
                /*QueueModel.bet_settle.addQueue( model);*/
            }
        }
        String rsp = SimpleHttpHelper.postURL(constant.getBilling(), JSONObject.toJSONString(model));
        logger.info(LogUtils.getLogStart("INFO") + " 结算请求返回值" + JSONObject.toJSONString(rsp));
        if (rsp.isEmpty()) {
            rspJson.put("code", RespCodeEnum.FAIL.getCode());
            rspJson.put("message", RespCodeEnum.FAIL.getMessage());
            return rspJson;
        }
        rspJson = JSONObject.parseObject(rsp);
        /**结算成功修改注单信息*/
        if (rspJson.getInteger("code") == 200) {
            try {
                Query queryBet = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
                Update update = new Update();
                update.set("settlement", df.format(model.getTotalPayment()));
                update.set("betState", 3);
                update.set("recCommission", totalCommission);
                List<OptionSettle> options = model.getOptionArray();
                List<OptionEntity> obj = JSONArray.parseArray(bet.getOptions(), OptionEntity.class);
                List<OptionEntity> rsq = new ArrayList<>();
                for (OptionEntity opEntity : obj) {
                    OptionEntity oe = opEntity;
                    for (OptionSettle opSettle : options) {
                        if (opEntity.getOptionId().equals(opSettle.getOpId())) {
                            oe.setSetResult(opSettle.getOpRst());
                            break;
                        }
                    }
                    rsq.add(oe);
                }
                update.set("options", JSONArray.toJSONString(rsq));
                if (model.getTotalPayment().compareTo(bet.getBetAmount()) == 0) {
                    update.set("settleResult", 0);
                } else if (model.getTotalPayment().compareTo(bet.getBetAmount()) > 0) {
                    update.set("settleResult", 100);
                } else if (model.getTotalPayment().compareTo(bet.getBetAmount()) < 0) {
                    update.set("settleResult", -100);
                }
                this.template.updateFirst(queryBet, update, "bet");
                QueueModel.settlement_queue.add(new SettleTaskModel(model.getTicketId(), model.getTotalPayment(), model.getIsReBill()));
            } catch (Exception e) {
                rspJson.put("WebMessage", WebMessage.error());
                return rspJson;
            }
        } else {
            logger.error(LogUtils.getLogStart("ERROR") + " 结算失败" + JSONObject.toJSONString(rsp));
        }
        return rspJson;
    }

    @Override
    public JSONObject test(SettleModel model) throws IOException {
        Query query1 = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
        BetEntity bet = this.template.findOne(query1, BetEntity.class);
        List<OptionSettle> options = model.getOptionArray();
        List<OptionEntity> obj = JSONArray.parseArray(bet.getOptions(), OptionEntity.class);
        List<OptionEntity> rsq = new ArrayList<>();
        for (OptionEntity opEntity : obj) {
            OptionEntity oe = opEntity;
            for (OptionSettle opSettle : options) {
                if (opEntity.getOptionId().equals(opSettle.getOpId())) {
                    oe.setSetResult(opSettle.getOpRst());
                    break;
                }
            }
            rsq.add(oe);
        }
        Query queryBet = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
        Update update = new Update();
        update.set("options", JSONArray.toJSONString(rsq));
        this.template.updateFirst(queryBet, update, "bet");
        return null;
    }

    @Override
    public long UpdateBetState(JSONObject ob) {
        //下单成功修改注单状态为已确认（2）
        Query queryBet = Query.query(Criteria.where("ticketId").is(ob.getString("ticketId")));
        Update update = new Update();
        ob.put("betState", 2);
        ob.put("userId", ob.getString("userId"));
        ob.put("betTime", ob.getLong("orderTime"));
        return this.template.updateFirst(queryBet, update, BetEntity.class).getMatchedCount();
    }

    /**
     * 取消注单
     *
     * @param model
     * @return
     * @throws Exception
     */
    @Transactional
    @Override
    public JSONObject cancelBet(CancelModel model) throws Exception {
        logger.info(LogUtils.getLogStart("INFO") + " 取消注单请求参数" + JSONObject.toJSONString(model));
        //取消订单未做改变用户余额操作
        JSONObject rspJson = new JSONObject();
        String rsp = SimpleHttpHelper.postURL(constant.getCancelTicket(), JSONObject.toJSONString(model));
        logger.info(LogUtils.getLogStart("INFO") + " 取消注单请求返回值" + JSONObject.toJSONString(rsp));
        if (rsp.isEmpty()) {
            rspJson.put("code", RespCodeEnum.FAIL.getCode());
            rspJson.put("message", RespCodeEnum.FAIL.getMessage());
            return rspJson;
        }
        rspJson = JSONObject.parseObject(rsp);
        if (rspJson.getInteger("code") == 200) {
            try {
                Query queryBet = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
                Update update = new Update();
                update.set("betState", 4);
                this.template.updateFirst(queryBet, update, "bet");
            } catch (Exception e) {
                rspJson.put("WebMessage", WebMessage.error());
                return rspJson;
            }
        } else {
            logger.error(LogUtils.getLogStart("ERROR") + " 取消注单失败" + JSONObject.toJSONString(rsp));
        }
        return rspJson;
    }

    @Override
    public JSONObject queryBet(TicketStateModel model) throws IOException {
        String rsp = SimpleHttpHelper.postURL(constant.getQueryTicket(), JSONObject.toJSONString(model));
        JSONObject rspJson = new JSONObject();
        if (rsp.isEmpty()) {
            rspJson.put("code", RespCodeEnum.FAIL.getCode());
            rspJson.put("message", RespCodeEnum.FAIL.getMessage());
            return rspJson;
        }
        rspJson = JSONObject.parseObject(rsp);
        return rspJson;
    }

    /**
     * 下单成功后保存订单
     */
    @Override
    public BetEntity saveBet(BetEntity bet) {
        BetEntity bn = template.insert(bet);
        if (bn != null) {
            logger.info(LogUtils.getLogStart("INFO") + " 投注后保存注单成功" + JSONObject.toJSONString(bn));
        } else {
            logger.error(LogUtils.getLogStart("ERROR") + " 投注后保存注单失败" + JSONObject.toJSONString(bn));
        }
        return bn;
    }

    /**
     * 结算跟单注单
     *
     * @param model
     * @return
     * @throws IOException
     */
    @Transactional
    @Override
    public JSONObject settleBet(SettleFollowTicketModel model) throws IOException {
        JSONObject rspJson = new JSONObject();
        BetEntity followBet = model.getBetEntity();
        SettleModel betModel = model.getSettleModel();
        try {
            Query query = Query.query(Criteria.where("ticketId").is(betModel.getTicketId()));
            BetEntity bet = this.template.findOne(query, BetEntity.class);
            betModel.setRakeRate(bet.getRakeRate());
            betModel.setIsRake(bet.getIsRake());
            BigDecimal totalPayment = new BigDecimal(0);
            BigDecimal commission = new BigDecimal(0);
            SettleModel settleModel = new SettleModel();
            settleModel.setUserId(followBet.getUserId());
            settleModel.setBetType(betModel.getBetType());
            settleModel.setOpRst(betModel.getOpRst());
            settleModel.setOptionArray(betModel.getOptionArray());
            settleModel.setTicketStatusIfSuccess(betModel.getTicketStatusIfSuccess());
            settleModel.setBillTime(betModel.getBillTime());
            settleModel.setIsReBill(betModel.getIsReBill());
            settleModel.setTicketId(followBet.getTicketId());
            settleModel.setBetList(model.getSettleModel().getBetList());
            if (betModel.getTotalPayment().compareTo(BigDecimal.ZERO) == 1) {
                if (betModel.getIsRake() == 1) {
                    JSONObject rsp = this.calculateCommission(betModel, followBet);
                    commission = rsp.getBigDecimal("commission");
                    totalPayment = rsp.getBigDecimal("totalPayment");
                }
            } else {
                totalPayment = BigDecimal.valueOf(0);
                commission = BigDecimal.valueOf(0);
            }
            settleModel.setTotalPayment(totalPayment);
            logger.info(LogUtils.getLogStart("INFO") + " 跟单结算请求参数" + JSONObject.toJSONString(settleModel));
            String rsp = SimpleHttpHelper.postURL(constant.getBilling(), JSONObject.toJSONString(settleModel));
            logger.info(LogUtils.getLogStart("INFO") + " 跟单结算请求返回值" + JSONObject.toJSONString(rsp));
            rspJson = JSONObject.parseObject(rsp);
            if (rspJson.getInteger("code") == 200) {
                Query queryBet = Query.query(Criteria.where("ticketId").is(followBet.getTicketId()));
                Update update = new Update();
                update.set("settlement", totalPayment);
                update.set("betState", 3);
                update.set("payCommission", commission);
                List<OptionSettle> options = betModel.getOptionArray();
                List<OptionEntity> obj = JSONArray.parseArray(bet.getOptions(), OptionEntity.class);
                List<OptionEntity> rsq = new ArrayList<>();
                for (OptionEntity opEntity : obj) {
                    OptionEntity oe = opEntity;
                    for (OptionSettle opSettle : options) {
                        if (opEntity.getOptionId().equals(opSettle.getOpId())) {
                            oe.setSetResult(opSettle.getOpRst());
                            break;
                        }
                    }
                    rsq.add(oe);
                }
                update.set("options", JSONArray.toJSONString(rsq));
                if (betModel.getTotalPayment().compareTo(bet.getBetAmount()) == 0) {
                    update.set("settleResult", 0);
                } else if (betModel.getTotalPayment().compareTo(bet.getBetAmount()) > 0) {
                    update.set("settleResult", 100);
                } else if (betModel.getTotalPayment().compareTo(bet.getBetAmount()) < 0) {
                    update.set("settleResult", -100);
                }
                this.template.updateFirst(queryBet, update, "bet");
            } else {
                logger.error(LogUtils.getLogStart("ERROR") + " 跟单结算失败 发起重新结算" + JSONObject.toJSONString(rsp));
                QueueModel.bet_settle.addQueue(model);
            }
        } catch (IOException e) {
            QueueModel.bet_settle.addQueue(model);
            logger.error(LogUtils.getLogStart("ERROR") + "结算异常 跟单结算失败 发起重新结算");
            e.printStackTrace();
        }
        //Query query = Query.query(Criteria.where("ticketId").is(model.getFollowTicketId()).and("betState").lt(3));
       /* Query query = Query.query(Criteria.where("followTicket").is(model.getTicketId()).and("betState").lt(3));
        List<BetEntity> betFollows = this.template.find(query, BetEntity.class);
        Query query1 = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
        BetEntity bet = this.template.findOne(query1,BetEntity.class);
        model.setIsRake(bet.getIsRake());
        model.setRakeRate(bet.getRakeRate());
        for (BetEntity entity: betFollows) {
            BigDecimal totalPayment = new BigDecimal(0);
            BigDecimal commission = new BigDecimal(0);
            SettleModel settleModel = new SettleModel();
            settleModel.setUserId(entity.getUserId());
            settleModel.setBetType(model.getBetType());
            settleModel.setOpRst(model.getOpRst());
            settleModel.setOptionArray(model.getOptionArray());
            settleModel.setTicketStatusIfSuccess(model.getTicketStatusIfSuccess());
            settleModel.setBillTime(model.getBillTime());
            settleModel.setIsReBill(model.getIsReBill());
            settleModel.setTicketId(entity.getTicketId());
            if(model.getTotalPayment().compareTo(BigDecimal.ZERO)==1){
                if(model.getIsRake()==1) {
                    JSONObject rsp = this.calculateCommission(model, entity);
                    commission = rsp.getBigDecimal("commission");
                    totalPayment = rsp.getBigDecimal("totalPayment");
                }
            }else{
                totalPayment = BigDecimal.valueOf(0);
                commission = BigDecimal.valueOf(0);
            }
            settleModel.setTotalPayment(totalPayment);
            logger.info( LogUtils.getLogStart("INFO")+" 跟单结算请求参数"+JSONObject.toJSONString(settleModel));
            String  rsp =  SimpleHttpHelper.postURL(constant.getBilling(), JSONObject.toJSONString(settleModel));
            logger.info( LogUtils.getLogStart("INFO")+" 跟单结算请求返回值"+JSONObject.toJSONString(rsp));
            rspJson = JSONObject.parseObject(rsp);
            if(rspJson.getInteger("code")==200) {
                try {
                    Query queryBet = Query.query(Criteria.where("ticketId").is(entity.getTicketId()));
                    Update update = new Update();
                    update.set("settlement",totalPayment);
                    update.set("betState", 3);
                    update.set("payCommission",commission);
                    List<OptionSettle> options = model.getOptionArray();
                    List<OptionEntity> obj = JSONArray.parseArray(bet.getOptions(),OptionEntity.class);
                    List<OptionEntity> rsq =new ArrayList<>();
                    for (OptionEntity opEntity:obj) {
                        OptionEntity oe = opEntity;
                        for(OptionSettle opSettle :options){
                            if(opEntity.getOptionId().equals(opSettle.getOpId())){
                                oe.setSetResult(opSettle.getOpRst());
                                break;
                            }
                        }
                        rsq.add(oe);
                    }
                    update.set("options",JSONArray.toJSONString(rsq));
                    if(model.getTotalPayment().compareTo(bet.getBetAmount())==0){
                        update.set("setResult",0);
                    }else if (model.getTotalPayment().compareTo(bet.getBetAmount())>0){
                        update.set("setResult",100);
                    }else if(model.getTotalPayment().compareTo(bet.getBetAmount())<0){
                        update.set("setResult",-100);
                    }
                    this.template.updateFirst(queryBet, update, "bet");
                } catch (Exception e) {
                    rspJson.put("WebMessage",WebMessage.error());
                }
            }else{
                logger.error(LogUtils.getLogStart("ERROR")+" 跟单结算失败"+JSONObject.toJSONString(rsp));
                QueueModel.bet_settle.addQueue( model);
            }
        }*/
        return rspJson;
    }


    /**
     * 计算结算金额和佣金
     */
    public JSONObject calculateCommission(SettleModel model, BetEntity entity) {
        DecimalFormat df = new DecimalFormat("0.00");
        JSONObject rspJson = new JSONObject();
        BigDecimal totalPayment = new BigDecimal(0);
        BigDecimal betAmount = new BigDecimal(0);
        BigDecimal commission = new BigDecimal(0);
        int tag = 0;
        List<OptionModel> options = JSONObject.parseArray(entity.getOptions(), OptionModel.class);
        for (OptionModel option : options) {
            Integer opRst = 0;
            for (OptionSettle os : model.getOptionArray()) {
                if (option.getOptionId().equals(os.getOpId())) {
                    opRst = os.getOpRst();
                    break;
                }
            }
            if (tag == 0) {
                betAmount = entity.getBetAmount();
            } else {
                betAmount = totalPayment;
            }
            switch (opRst) {
                case 100:
                    totalPayment = betAmount.multiply(BigDecimal.valueOf(option.getOddsView()));
                    break;
                case 50:
                    totalPayment = betAmount.add((betAmount.multiply(BigDecimal.valueOf(option.getOddsView())).subtract(betAmount)).divide(BigDecimal.valueOf(2)));
                    break;
                case -50:
                    totalPayment = betAmount.divide(BigDecimal.valueOf(2));
                    break;
                case -100:
                    totalPayment = BigDecimal.valueOf(0);
                    break;
                default:
                    totalPayment = betAmount;
            }
            tag++;
        }

        if (model.getTotalPayment().compareTo(BigDecimal.ZERO) == 1 && model.getIsRake() == 1) {
            commission = (totalPayment.subtract(entity.getBetAmount())).multiply(BigDecimal.valueOf(model.getRakeRate()));
            totalPayment = totalPayment.subtract(commission);
        }
        rspJson.put("commission", df.format(commission));
        rspJson.put("totalPayment", df.format(totalPayment));
        return rspJson;
    }

    @Transactional
    @Override
    public JSONObject cancelFollowBet(CancelModel model) throws IOException {
        Query query = Query.query(Criteria.where("followTicket").is(model.getTicketId()));
        List<BetEntity> betFollows = this.template.find(query, BetEntity.class);
        JSONObject rspJson = new JSONObject();
        logger.info(LogUtils.getLogStart("INFO") + " 取消跟单注单请求参数" + JSONObject.toJSONString(model));
        for (BetEntity entity : betFollows) {
            //取消订单未做改变用户余额操作
            String rsp = SimpleHttpHelper.postURL(constant.getCancelTicket(), JSONObject.toJSONString(model));
            logger.info(LogUtils.getLogStart("INFO") + " 取消跟单注单请求返回值" + JSONObject.toJSONString(rsp));
            if (rsp.isEmpty()) {
                rspJson.put("code", RespCodeEnum.FAIL.getCode());
                rspJson.put("message", RespCodeEnum.FAIL.getMessage());
                break;
            }
            rspJson = JSONObject.parseObject(rsp);
            if (rspJson.getInteger("code") == 200) {
                try {
                    Query queryBet = Query.query(Criteria.where("ticketId").is(model.getTicketId()));
                    Update update = new Update();
                    update.set("betState", 4);
                    this.template.updateFirst(queryBet, update, "bet");
                } catch (Exception e) {
                    rspJson.put("WebMessage", WebMessage.error());
                }
            } else {
                logger.error(LogUtils.getLogStart("ERROR") + " 取消注单失败" + JSONObject.toJSONString(rsp));
            }
        }
        return rspJson;
    }

    @Override
    public JSONObject followPlan(OrderPost post) {
        JSONObject rspJson  = this.getBalance(post.getCustomerToken());
        if(rspJson.getInteger("code") != null && rspJson.getInteger("code") == 200){
            BigDecimal balance = rspJson.getJSONObject("data").getBigDecimal("balance");
           if(post.getOrderAmount().compareTo(balance)==1){
               rspJson.put("code",RespCodeEnum.USER_BALANCE_INSUFFICIENT.getCode());
               rspJson.put("msg",RespCodeEnum.USER_BALANCE_INSUFFICIENT.getMessage());
               return rspJson;
           }
            rspJson = this.doBet(post);
        }
        return rspJson;
    }


}
