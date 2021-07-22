package nbm.cash.admin.modular.service.impl;

import nbm.cash.admin.common.utils.other.PageBean;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.other.StringUtil;
import nbm.cash.admin.modular.entity.NoticeEntity;
import nbm.cash.admin.modular.request.notice.AddNoticePost;
import nbm.cash.admin.modular.request.notice.NoticeQuery;
import nbm.cash.admin.modular.service.NoticeService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

/**
 * @Description
 * @ClassName NoticeServiceImpl
 * @Author New
 * @Date 2019/12/15 16:32
 * @Version V1.0
 **/
@Service("noticeService")
public class NoticeServiceImpl implements NoticeService {

    protected static final Logger logger = LogManager.getLogger(NoticeServiceImpl.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public WebMessage findNoticeList(NoticeQuery model) {
        Query query = new Query();
        if(model.getState() < 0){
            query.addCriteria(Criteria.where("state").gt(-1));
        } else {
            query.addCriteria(Criteria.where("state").is(model.getState()));
        }

        if(model.getType() < 0){
            query.addCriteria(Criteria.where("type").gt(-1));
        } else {
            query.addCriteria(Criteria.where("type").is(model.getType()));
        }

        if(!StringUtil.isEmpty(model.getTitle())) {
            Pattern pattern=Pattern.compile(".*" + model.getTitle() + ".*",Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where("title").regex(pattern));
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

        long count = mongoTemplate.count(query, NoticeEntity.class);
        query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
        query.with(Sort.by(Sort.Order.desc("createTime")));
        List<NoticeEntity> modelList = mongoTemplate.find(query, NoticeEntity.class);

         PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), Long.valueOf(count), modelList);

        return WebMessage.success(pg);
    }

    @Override
    public WebMessage addNotice(AddNoticePost post) {
        NoticeEntity entity = new NoticeEntity();
        entity.setTitle(post.getTitle());
        entity.setContent(post.getContent());
        entity.setCreateTime(System.currentTimeMillis());
        entity.setType(post.getType());
        entity.setCreateUserId(post.getUserId());
        entity.setValidStart(post.getValidStart());
        entity.setValidEnd(post.getValidEnd());
        mongoTemplate.save(entity);
        return WebMessage.success();
    }

    @Override
    public WebMessage delNoticeList(String id) {
        Query query = Query.query(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("state", 0);
        mongoTemplate.updateFirst(query, update, NoticeEntity.class);
        return WebMessage.success();
    }

    @Override
    public WebMessage updateNotice(AddNoticePost post) {
        Query query = Query.query(Criteria.where("_id").is(post.get_id()));
        Update update = new Update();
        update.set("title", post.getTitle());
        update.set("content", post.getContent());
        update.set("type", post.getType());
        update.set("validStart", post.getValidStart());
        update.set("validEnd", post.getValidEnd());
        mongoTemplate.updateFirst(query, update, NoticeEntity.class);
        return WebMessage.success();
    }

}