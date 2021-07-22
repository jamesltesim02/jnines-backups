package nbm.cash.seamless.service.impl;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.entity.IntegralLogEntity;
import nbm.cash.seamless.entity.UserEntity;
import nbm.cash.seamless.request.integral.IntegralModel;
import nbm.cash.seamless.service.CallbackService;
import nbm.cash.seamless.utils.http.RespCodeEnum;
import nbm.cash.seamless.utils.http.WebMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * @program: cash_seamless
 * @description: 回调接口
 * @author: Mr.Nat
 * @create: 2019-12-10 17:26
 **/
@Service("callbackService")
public class CallbackServiceImpl implements CallbackService {

    @Autowired
    private MongoTemplate template;

    protected static final Logger logger = LogManager.getLogger(SeamlessServiceImpl.class);
    @Transactional
    @Override
    public WebMessage firstDepositIntegra(IntegralModel model) {
        if(model.getUserId()!=null){
            Query query = Query.query(Criteria.where("userId").is(model.getUserId()));
            UserEntity userEntity = this.template.findOne(query,UserEntity.class);
            BigDecimal deposit = model.getDepositAmount();
            int integral = 0;
            if(userEntity!=null){
                IntegralLogEntity entity = new IntegralLogEntity();
                if(deposit!=null&&!"".equals(deposit)){
                    entity.setIntegral(model.getDepositAmount().intValue());
                }
                if(model.getDepositTime()!=null){
                    entity.setCreateTime(model.getDepositTime());
                }
                if(model.getUserId()!=null){
                    entity.setUserId(model.getUserId());
                }
                entity.setType(2);
                try {
                    this.template.insert(entity);
                    Query query1 = Query.query(Criteria.where("userId").is(model.getUserId()));
                    Update update = new Update();

                    if(deposit.compareTo(new BigDecimal(1000))==-1){
                        integral = deposit.multiply(BigDecimal.valueOf(0.8)).intValue();
                    }else if(deposit.compareTo(new BigDecimal(1000))==1&&deposit.compareTo(new BigDecimal(2000))==-1){
                        integral = deposit.intValue();
                    }else if(deposit.compareTo(new BigDecimal(2000))==1&&deposit.compareTo(new BigDecimal(4999))==-1){
                        integral = deposit.multiply(BigDecimal.valueOf(1.3)).intValue();
                    }else if(deposit.compareTo(new BigDecimal(5000))>=0){
                        integral = 8000;
                    }
                    update.inc("integral",deposit.intValue());
                    this.template.updateFirst(query1,update, UserEntity.class);
                } catch (Exception e) {
                    logger.error("增加积分失败");
                    return WebMessage.error();
                }
            }else {
                logger.info("用户不存在");
                return WebMessage.custom(RespCodeEnum.USER_NOT_EXIST.getCode(),RespCodeEnum.USER_NOT_EXIST.getMessage());
            }
        }else{
            return WebMessage.custom(RespCodeEnum.PARAMETER_ERROR.getCode(),RespCodeEnum.PARAMETER_ERROR.getMessage());
        }

        return WebMessage.success();
    }
}
