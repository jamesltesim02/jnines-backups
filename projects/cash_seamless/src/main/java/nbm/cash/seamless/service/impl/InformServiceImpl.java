package nbm.cash.seamless.service.impl;

import nbm.cash.seamless.entity.*;
import nbm.cash.seamless.request.notice.InfoModel;
import nbm.cash.seamless.request.notice.NoticeReadPost;
import nbm.cash.seamless.service.InformService;
import nbm.cash.seamless.utils.http.WebMessage;
import nbm.cash.seamless.utils.other.PageBean;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Description
 * @ClassName InformserviceImpl
 * @Author New
 * @Date 2019/11/21 11:29
 * @Version V1.0
 **/
@Service("informService")
public class InformServiceImpl implements InformService {

    protected static final Logger logger = LogManager.getLogger(InformServiceImpl.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public WebMessage getNoticeList(InfoModel model) {
        Query query = Query.query(Criteria.where("state").is(1));
        if(model.getUserId() != null && model.getUserId().length() > 0){
            query.addCriteria(new Criteria().orOperator(Criteria.where("userId").is(model.getUserId()), Criteria.where("type").lt(3)));
        } else {
            query.addCriteria(Criteria.where("type").lt(3));
        }
        List<NoticeEntity> countList = mongoTemplate.find(query, NoticeEntity.class);
        query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
        query.with(Sort.by(Sort.Order.desc("createTime")));
        List<NoticeEntity> noticeList = mongoTemplate.find(query, NoticeEntity.class);
        if(model.getUserId() != null && model.getUserId().length() > 0){
            for (NoticeEntity notice : noticeList) {
                Query isRead = Query.query(Criteria.where("userId").is(model.getUserId()).and("noticeId").is(notice.get_id() ));
                if(mongoTemplate.exists(isRead, ReadNotice.class)){
                    notice.setIsRead(1);
                } else {
                    notice.setIsRead(0);
                }
            }
        }

        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), Long.valueOf(countList.size()), noticeList);
        return WebMessage.success(pg);
    }

    @Override
    public WebMessage getNoticeById(InfoModel model) {
        Query query = Query.query(Criteria.where("_id").is(model.getId()));
        NoticeEntity notice = mongoTemplate.findOne(query, NoticeEntity.class);
        if(model.getUserId() != null && model.getUserId().length() > 0){
            Query isRead = Query.query(Criteria.where("userId").is(model.getUserId()).and("noticeId").is(model.getId()));
            boolean flag = mongoTemplate.exists(isRead, ReadNotice.class);
            if(!flag){
                mongoTemplate.insert(new ReadNotice(model.getUserId(), model.getId()));
            }
        }
        return WebMessage.success(notice);
    }

    @Override
    public WebMessage setNoticeRead(NoticeReadPost model) {
        List<ReadNotice> readList = new ArrayList<ReadNotice>();
        for (String noticeId: model.getInfoIdList()) {
            readList.add(new ReadNotice(model.getUserId(), noticeId));
        }

        if(readList.size() > 0){
            mongoTemplate.insertAll(readList);
        }
        return WebMessage.success();
    }

    @Override
    public WebMessage getHotNewsList(InfoModel model) {
        Query query = Query.query(Criteria.where("state").is(1));
        List<HotNewsEntity> countList = mongoTemplate.find(query, HotNewsEntity.class);
        query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
        query.with(Sort.by(Sort.Order.desc("createTime")));
        List<HotNewsEntity> noticeList = mongoTemplate.find(query, HotNewsEntity.class);
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), Long.valueOf(countList.size()), noticeList);
        return WebMessage.success(pg);
    }

    @Override
    public WebMessage findHotNewsById(InfoModel model) {
        Query query = Query.query(Criteria.where("_id").is(model.getId()));
        HotNewsEntity hotNews = mongoTemplate.findOne(query, HotNewsEntity.class);
        if (hotNews != null) {
            Update update = new Update();
            update.inc("popularity", 1);
            mongoTemplate.upsert(query, update, HotNewsEntity.class);
        }
        return WebMessage.success(hotNews);
    }

    @Override
    public WebMessage findBannerList(InfoModel model) {
        Query query = Query.query(Criteria.where("state").is(1));
        query.with(Sort.by(Sort.Order.asc("orderNo")));
        List<BannerEntity> bannerList = mongoTemplate.find(query, BannerEntity.class);
        return WebMessage.success(bannerList);
    }

}