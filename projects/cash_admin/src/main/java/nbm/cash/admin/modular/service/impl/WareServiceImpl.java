package nbm.cash.admin.modular.service.impl;

import com.mongodb.client.result.UpdateResult;
import nbm.cash.admin.common.utils.http.RespCodeEnum;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.other.PageBean;
import nbm.cash.admin.common.utils.other.StringUtil;
import nbm.cash.admin.modular.entity.WareEntity;
import nbm.cash.admin.modular.request.ware.AddWarePost;
import nbm.cash.admin.modular.request.ware.WarePost;
import nbm.cash.admin.modular.service.WareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service("wareService")
public class WareServiceImpl implements WareService {

    @Autowired
    public MongoTemplate mongoTemplate;

    @Override
    public WebMessage getWareList(WarePost model) {
        Query query = new Query();

        if(!StringUtil.isEmpty(model.getWareName())) {
            Pattern pattern=Pattern.compile(".*" + model.getWareName() + ".*",Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where("wareName").regex(pattern));
        }

        if(model.getState() < 0){
            query.addCriteria(Criteria.where("state").gt(model.getState() ));
        } else {
            query.addCriteria(Criteria.where("state").is(model.getState() ));
        }

        if(model.getType() < 0){
            query.addCriteria(Criteria.where("type").gt(model.getType()));
        } else {
            query.addCriteria(Criteria.where("type").is(model.getType()));
        }

        if(model.getStartTime() != null && model.getEndTime() != null) {
            query.addCriteria(new Criteria().andOperator(Criteria.where("createTime").gt(model.getStartTime()),Criteria.where("createTime").lt(model.getEndTime())));
        } else {
            if(model.getStartTime() != null){
                query.addCriteria(Criteria.where("createTime").gt(model.getStartTime()));
            }

            if(model.getEndTime() != null){
                query.addCriteria(Criteria.where("createTime").lt(model.getEndTime()));
            }
        }

        long count = mongoTemplate.count(query, WareEntity.class);
        query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
        query.with(Sort.by(Sort.Order.desc("createTime")));
        List<WareEntity> modelList = mongoTemplate.find(query, WareEntity.class);

        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), Long.valueOf(count), modelList);

        return WebMessage.success(pg);
    }

    @Override
    public WebMessage addWare(AddWarePost model) {
        WareEntity ware = new WareEntity();
        ware.setWareName(model.getWareName());
        ware.setPhoto(model.getPhoto());
        ware.setInventory(model.getInventory());
        ware.setNeedIntegral(model.getNeedIntegral());
        ware.setType(model.getType());
        ware.setSize(model.getSize());
        ware.setWareColor(model.getWareColor());
        ware.setValidEnd(model.getValidEnd());
        ware.setValidStart(model.getValidStart());
        ware.setWareColor(model.getWareColor());
        ware.setCreateTime(System.currentTimeMillis());
        ware.setUserId(model.getUserId());
        mongoTemplate.insert(ware);
        return WebMessage.success();
    }

    @Override
    public WebMessage updateWare(AddWarePost model) {
        Query query = Query.query(Criteria.where("_id").is(model.get_id()));
        Update update = new Update();
        update.set("wareName", model.getWareName());
        update.set("photo", model.getPhoto());
        update.set("type", model.getType());
        update.set("needIntegral", model.getNeedIntegral());
        update.set("wareColor", model.getWareColor());
        update.set("size", model.getSize());
        update.set("validStart", model.getValidStart());
        update.set("validEnd", model.getValidEnd());
        update.set("userId", model.getUserId());
        mongoTemplate.updateFirst(query, update, WareEntity.class);
        return WebMessage.success();
    }

    @Override
    public WebMessage delWareById(String id) {
        Query query = Query.query(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("state", 0);
        mongoTemplate.updateFirst(query, update, WareEntity.class);
        return WebMessage.success();
    }

    @Override
    public WebMessage updateInventory(String id, Integer inventory) {
        Query query = Query.query(Criteria.where("_id").is(id));
        Update update = new Update();
        update.inc("inventory", inventory);
        UpdateResult result = mongoTemplate.updateFirst(query, update, WareEntity.class);
        if(result != null && result.getModifiedCount() == 1){
            return WebMessage.success();
        }
        return WebMessage.construct(RespCodeEnum.FAIL);
    }
}
