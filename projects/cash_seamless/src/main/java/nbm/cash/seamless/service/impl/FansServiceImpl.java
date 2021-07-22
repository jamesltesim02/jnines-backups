package nbm.cash.seamless.service.impl;

import com.alibaba.fastjson.JSON;
import com.mongodb.client.result.DeleteResult;
import nbm.cash.seamless.entity.BetEntity;
import nbm.cash.seamless.entity.FansMapping;
import nbm.cash.seamless.entity.UserEntity;
import nbm.cash.seamless.request.fans.FocusModel;
import nbm.cash.seamless.request.fans.FocusOnModel;
import nbm.cash.seamless.response.fans.FansAndFocusModel;
import nbm.cash.seamless.service.FansService;
import nbm.cash.seamless.utils.http.RespCodeEnum;
import nbm.cash.seamless.utils.http.WebMessage;
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

import java.util.ArrayList;
import java.util.List;

/**
 * @Description 粉丝服务类
 * @ClassName FansServiceImpl
 * @Author New
 * @Date 2019/11/15 14:00
 * @Version V1.0
 **/
@Service("fansService")
public class FansServiceImpl implements FansService {

    protected static final Logger logger = LogManager.getLogger(FansServiceImpl.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public WebMessage myFocusList(FocusModel model) {
        try {
            if (model.getUserId() == null || model.getUserId().trim().length() == 0) {
                return WebMessage.construct(RespCodeEnum.PARAMETER_ERROR);
            }

            Query query = Query.query(Criteria.where("myUserId").is(model.getUserId()));
            List<FansMapping> mappingList = mongoTemplate.find(query, FansMapping.class);
            query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
            query.with(Sort.by(Sort.Order.asc("createTime")));

            List<String> userIdList = new ArrayList<String>();
            for (FansMapping mapping : mappingList) {
                userIdList.add(mapping.getFocusId());
            }

            Query queryUser = Query.query(Criteria.where("userId").in(userIdList));
            List<UserEntity> userList = mongoTemplate.find(queryUser, UserEntity.class);
            for (UserEntity user : userList) {
                Query queryPlan = Query.query(Criteria.where("userId").is(user.getUserId()).and("ticketType").is(2).and("displayTime").gt(System.currentTimeMillis()));
                user.setUsablePlan(Integer.valueOf(String.valueOf(mongoTemplate.count(queryPlan, BetEntity.class))));
            }

            return WebMessage.success(userList);
        } catch (Exception e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[获取我的关注列表出错：]" + JSON.toJSONString(model), e);
            return WebMessage.message(RespCodeEnum.ERROR);
        }
    }

    @Override
    public WebMessage myFansList(FocusModel model) {
        try{
            if (model.getUserId() == null || model.getUserId().trim().length() == 0) {
                return WebMessage.construct(RespCodeEnum.PARAMETER_ERROR);
            }

            Query query = Query.query(Criteria.where("focusId").is(model.getUserId()));
            List<FansMapping> mappingList = mongoTemplate.find(query, FansMapping.class);
            query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
            query.with(Sort.by(Sort.Order.asc("createTime")));

            List<String> userIdList = new ArrayList<String>();
            for (FansMapping mapping : mappingList) {
                userIdList.add(mapping.getMyUserId());
            }

            Query queryUser = Query.query(Criteria.where("userId").in(userIdList));
            List<UserEntity> userList = mongoTemplate.find(queryUser, UserEntity.class);
            for (UserEntity user : userList) {
                Query queryPlan = Query.query(Criteria.where("userId").is(user.getUserId()).and("ticketType").is(2).and("displayTime").gt(System.currentTimeMillis()));
                user.setUsablePlan(Integer.valueOf(String.valueOf(mongoTemplate.count(queryPlan, BetEntity.class))));
            }

            return WebMessage.success(userList);
        } catch (Exception e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[获取我的粉丝列表出错：]" + JSON.toJSONString(model), e);
            return WebMessage.message(RespCodeEnum.ERROR);
        }
    }

    @Transactional
    @Override
    public WebMessage focusOnSomeOne(FocusOnModel model) {
        try {

            if (model.getUserId() == null || model.getUserId().trim().length() == 0 || model.getFocusUserId() == null || model.getFocusUserId().trim().length() == 0) {
                return WebMessage.construct(RespCodeEnum.PARAMETER_ERROR);
            }

            Query query = Query.query(Criteria.where("myUserId").is(model.getUserId()).and("focusId").is(model.getFocusUserId()));
            boolean falg = mongoTemplate.exists(query, FansMapping.class);
            if (!falg) {
                mongoTemplate.save(new FansMapping(model.getUserId(), model.getFocusUserId()));

                Query queryUser = Query.query(new Criteria().orOperator(Criteria.where("userId").is(model.getUserId()), Criteria.where("userId").is(model.getFocusUserId())));
                List<UserEntity> userList = mongoTemplate.find(queryUser, UserEntity.class);
                for (UserEntity user : userList) {
                    Update update = new Update();
                    Query queryKey = new Query();
                    queryKey.addCriteria(Criteria.where("userId").is(user.getUserId()));
                    if (user.getUserId().equals(model.getUserId())) {
                        update.set("focusCount", user.getFocusCount() + 1);
                    } else if (user.getUserId().equals(model.getFocusUserId())) {
                        update.set("fansCount", user.getFansCount() + 1);
                    }
                    mongoTemplate.updateFirst(queryKey, update, UserEntity.class);
                }
                return WebMessage.success();
            } else {
                return WebMessage.construct(RespCodeEnum.DATA_EXIST);
            }
        } catch (Exception e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[关注用户出错：]" + JSON.toJSONString(model), e);
            return WebMessage.construct(RespCodeEnum.ERROR);
        }
    }

    @Transactional
    @Override
    public WebMessage cancelFocus(FocusOnModel model) {
        try {
            if (model.getUserId() == null || model.getUserId().trim().length() == 0 || model.getFocusUserId() == null || model.getFocusUserId().trim().length() == 0) {
                return WebMessage.construct(RespCodeEnum.PARAMETER_ERROR);
            }

            Query query = Query.query(Criteria.where("myUserId").is(model.getUserId()).and("focusId").is(model.getFocusUserId()));
            DeleteResult dr = mongoTemplate.remove(query, FansMapping.class);
            if (dr != null && dr.getDeletedCount() == 1) {
                Query queryUser = Query.query(new Criteria().orOperator(Criteria.where("userId").is(model.getUserId()), Criteria.where("userId").is(model.getFocusUserId())));
                List<UserEntity> userList = mongoTemplate.find(queryUser, UserEntity.class);
                for (UserEntity user : userList) {
                    Update update = new Update();
                    Query queryKey = Query.query(Criteria.where("userId").is(user.getUserId()));
                    if (user.getUserId().equals(model.getUserId())) {
                        update.inc("focusCount", -1);
                    } else if (user.getUserId().equals(model.getFocusUserId())) {
                        update.inc("fansCount", -1);
                    }
                    mongoTemplate.updateFirst(queryKey, update, UserEntity.class);
                }
            }
            return WebMessage.success();
        } catch (Exception e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[取消关注出错：]" + JSON.toJSONString(model), e);
            return WebMessage.construct(RespCodeEnum.ERROR);
        }
    }

    @Override
    public WebMessage fansAndFocusCount(FocusModel model) {
        try {
            Query queryFocus = Query.query(Criteria.where("myUserId").is(model.getUserId()));
            Query queryFans = Query.query(Criteria.where("focusId").is(model.getUserId()));
            List<FansMapping> focusList = mongoTemplate.find(queryFocus, FansMapping.class);
            List<FansMapping> fansList = mongoTemplate.find(queryFans, FansMapping.class);
            FansAndFocusModel res = new FansAndFocusModel();
            res.setFocus(focusList.size());
            res.setFans(fansList.size());
            return WebMessage.success(res);
        } catch (Exception e) {
            logger.error(LogUtils.getLogStart("FATAL") + "[统计粉丝数和关注数出错：]" + JSON.toJSONString(model), e);
            return WebMessage.construct(RespCodeEnum.ERROR);
        }
    }
}