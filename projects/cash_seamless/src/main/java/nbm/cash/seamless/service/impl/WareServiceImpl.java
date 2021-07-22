package nbm.cash.seamless.service.impl;

import com.mongodb.client.result.UpdateResult;
import nbm.cash.seamless.entity.IntegralLogEntity;
import nbm.cash.seamless.entity.UserEntity;
import nbm.cash.seamless.entity.WareEntity;
import nbm.cash.seamless.entity.WareLogEntity;
import nbm.cash.seamless.request.CashPrizeModel;
import nbm.cash.seamless.service.WareService;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Description
 * @ClassName CommodityServiceImpl
 * @Author New
 * @Date 2019/12/13 18:14
 * @Version V1.0
 **/
@Service("wareService")
public class WareServiceImpl implements WareService {

    protected static final Logger logger = LogManager.getLogger(WareServiceImpl.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public WebMessage findCommodityList() {
        long time = System.currentTimeMillis();
        Query query = Query.query(Criteria.where("state").is(1).and("validTimeStart").lt(time).and("validTimeEnd").gt(time));
        List<WareEntity> entityList = mongoTemplate.find(query, WareEntity.class);
        return WebMessage.success(entityList);
    }

    @Transactional
    @Override
    public WebMessage cashPrize(CashPrizeModel model) {
        model.setUserId("H88agredbull108");
        WareEntity ware = mongoTemplate.findById(model.getWareId(), WareEntity.class);
        Query query = Query.query(Criteria.where("userId").is(model.getUserId()));
        UserEntity user = mongoTemplate.findOne(query, UserEntity.class);

        if(user !=null && ware != null && ware.getInventory() > model.getWareNum() && user.getIntegral() > (model.getWareNum() * ware.getNeedIntegral())){
            // 商品兑换日志
            WareLogEntity wareLog = new WareLogEntity();
            wareLog.setWareId(model.getWareId());
            wareLog.setUserId(model.getUserId());
            wareLog.setNum(model.getWareNum());
            wareLog.setCreateTime(System.currentTimeMillis());

            // 积分日志
            IntegralLogEntity integralLog = new IntegralLogEntity();
            integralLog.setUserId(model.getUserId());
            integralLog.setIntegral(- model.getWareNum() * ware.getNeedIntegral());
            integralLog.setType(3);
            integralLog.setNote("商品兑换扣除积分");
            integralLog.setCreateTime(System.currentTimeMillis());

            Query queryWare = Query.query(Criteria.where("_id").is(model.getWareId()));
            Update update = new Update();
            update.set("inventory", ware.getInventory() - model.getWareNum());
            UpdateResult result = mongoTemplate.updateFirst(queryWare, update, WareEntity.class);
            WareLogEntity saveLog1 =  mongoTemplate.insert(wareLog);
            IntegralLogEntity saveLog2 = mongoTemplate.insert(integralLog);
            if(result.getModifiedCount() == 1 && saveLog1 != null && saveLog2 != null){
                Map<String, Integer> map = new HashMap<String, Integer>();
                map.put("inventory",ware.getInventory() - model.getWareNum());
                return WebMessage.success(map);
            }
        } else {
            return WebMessage.construct(RespCodeEnum.DATA_NOT_EXIST);
        }
        return null;
    }
}