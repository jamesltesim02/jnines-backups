package nbm.cash.admin.modular.service.impl;

import com.mongodb.client.result.UpdateResult;
import nbm.cash.admin.common.utils.http.RespCodeEnum;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.other.PageBean;
import nbm.cash.admin.common.utils.other.StringUtil;
import nbm.cash.admin.modular.entity.HotNewsEntity;
import nbm.cash.admin.modular.entity.RoleEntity;
import nbm.cash.admin.modular.entity.RoleResource;
import nbm.cash.admin.modular.request.hotnews.HotNewsPost;
import nbm.cash.admin.modular.request.hotnews.HotNewsQuery;
import nbm.cash.admin.modular.service.HotNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service("hotNewsService")
public class HotNewsServiceImpl implements HotNewsService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public WebMessage getHotNewsList(HotNewsQuery model) {
        Query query = new Query();
        if(!StringUtil.isEmpty(model.getTitle())) {
            Pattern pattern=Pattern.compile(".*" + model.getTitle() + ".*",Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where("title").regex(pattern));
        }

        if(model.getState() !=null){
            query.addCriteria(Criteria.where("state").is(model.getState()));
        } else {
            query.addCriteria(Criteria.where("state").gt(-1));
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

        long count = mongoTemplate.count(query, HotNewsEntity.class);
        query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
        query.with(Sort.by(Sort.Order.desc("createTime")));
        List<HotNewsEntity> resourceList = mongoTemplate.find(query, HotNewsEntity.class);
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), Long.valueOf(count), resourceList);
        return WebMessage.success(pg);
    }

    @Override
    public WebMessage addHotNews(HotNewsEntity model) {
        HotNewsEntity save = mongoTemplate.insert(model);
        if(save != null ){
            return WebMessage.success();
        }
        return WebMessage.construct(RespCodeEnum.FAIL);
    }

    @Override
    public WebMessage updateHotNews(HotNewsPost model) {
        Query query = Query.query(Criteria.where("_id").is(model.get_id()));
        Update update = new Update();
        update.set("title", model.getTitle());
        update.set("content", model.getContent());
        update.set("thumbnail", model.getThumbnail());
        update.set("url", model.getUrl());
        update.set("validStart", model.getValidStart());
        update.set("validEnd", model.getValidEnd());

        UpdateResult result = mongoTemplate.updateFirst(query, update, HotNewsEntity.class);
        if(result != null && result.getModifiedCount() == 1){
            return WebMessage.success();
        }
        return WebMessage.construct(RespCodeEnum.FAIL);
    }

    @Override
    public WebMessage delHotNews(String id) {
        Query query = Query.query(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("state", 0);

        UpdateResult result = mongoTemplate.updateFirst(query, update, HotNewsEntity.class);
        if(result != null && result.getModifiedCount() == 1){
            return WebMessage.success();
        }
        return WebMessage.construct(RespCodeEnum.FAIL);
    }
}
