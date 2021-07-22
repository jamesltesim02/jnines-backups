package nbm.cash.seamless.service.impl;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.constant.Constant;
import nbm.cash.seamless.entity.FansMapping;
import nbm.cash.seamless.request.TokenModel;
import nbm.cash.seamless.request.UserModel;
import nbm.cash.seamless.service.UserService;
import nbm.cash.seamless.utils.http.RespCodeEnum;
import nbm.cash.seamless.utils.http.SimpleHttpHelper;
import nbm.cash.seamless.utils.http.WebMessage;
import nbm.cash.seamless.utils.other.LogUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @program: cash_seamless
 * @description: 用户个人信息
 * @author: Mr.Nat
 * @create: 2019-11-21 18:56
 **/
@Service("userService")
public class UserServiceImpl implements UserService {

    @Autowired
    private MongoTemplate template;

    @Resource
    Constant constant;

    protected static final Logger logger = LogManager.getLogger(UserServiceImpl.class);

    @Override
    public WebMessage queryUserInfo(String userId,String balance,String token)  {
        Query query = new Query();
        query.addCriteria(Criteria.where("myUserId").is(userId));
        List<String> fId = new ArrayList<>();
        List<FansMapping> fansMappings = template.find(query, FansMapping.class);
        for (FansMapping fans : fansMappings) {
            fId.add(fans.getFocusId());
        }
        Criteria userCri = Criteria.where("userId").is(userId);
        AggregationOperation userMatch = Aggregation.match(userCri);
        AggregationOperation fiel = Aggregation.project("userId", "userName", "header", "userLevel", "nickName", "sex", "recentHit", "integral", "focusCount", "fansCount", "commission", "betReturnRateWeek", "totalLongRed", "historyHit", "totalReturn", "settleWeek","medal");
        Aggregation aggregation = Aggregation.newAggregation(userMatch, fiel);
        List<JSONObject> results = template.aggregate(aggregation, "user", JSONObject.class).getMappedResults();
        JSONObject jb = new JSONObject();
        if (results != null) {
            if (results.size() > 0) {
                jb = results.get(0);
                if(balance!=null&&!"".equals(balance)){
                    TokenModel model = new TokenModel();
                    model.setToken(token);
                    try {
                        String rsp = SimpleHttpHelper.postURL(constant.getQueryAccount(), JSONObject.toJSONString(model));
                        JSONObject rspJson = JSONObject.parseObject(rsp);
                        JSONObject data = rspJson.getJSONObject("data");
                        if (data != null) {
                            if (!StringUtils.isEmpty(data.getString("balance"))) {
                               jb.put("balance",data.getString("balance"));
                            }
                        }
                    } catch (IOException e) {
                        logger.info(LogUtils.getLogStart("INFO") + " 查询用户余额失败" );
                        e.printStackTrace();
                    }
                }
                jb.put("_id", results.get(0).getString("_id"));
            }
        }
        jb.put("focus", fId);
        jb.put("medal",JSONObject.parseObject(jb.getString("medal")));
        return WebMessage.success(jb);
    }

    @Override
    public WebMessage updateUser(UserModel model) {
        Query query = Query.query(Criteria.where("userId").is(model.getUserId()));
        UserModel userRsp = this.template.findOne(query, UserModel.class);
        if (userRsp != null) {
            Query query1 = Query.query(Criteria.where("userId").is(model.getUserId()));
            Update update = new Update();
            UserModel userReq = new UserModel();
            if (model.getNickName() != null && !"".equals(model.getNickName())) {
                update.set("nickName", model.getNickName());
            }
            if (model.getHeader() != null && !"".equals(model.getHeader())) {
                update.set("header", model.getHeader());
            }
            if (model.getSex() != null) {
                update.set("sex", model.getSex());
            }
            this.template.updateFirst(query1, update, UserModel.class);
        }
        return WebMessage.success();
    }


}
