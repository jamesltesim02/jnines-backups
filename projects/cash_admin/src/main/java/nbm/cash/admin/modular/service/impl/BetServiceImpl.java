package nbm.cash.admin.modular.service.impl;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.admin.common.utils.other.PageBean;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.entity.BetEntity;
import nbm.cash.admin.modular.entity.OptionEntity;
import nbm.cash.admin.modular.request.BetPost;
import nbm.cash.admin.modular.service.BetService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @program: cash_admin
 * @description: 注单查询
 * @author: Mr.Nat
 * @create: 2019-12-13 17:12
 **/
@Service("betService")
public class BetServiceImpl implements BetService {

    protected static final Logger logger = LogManager.getLogger(BetServiceImpl.class);

    @Autowired
    private MongoTemplate mongoTemplate;
    @Override
    public WebMessage query(BetPost post) {
        Query query =new Query();
        if(post.getStartTime()!=null && post.getEndTime()!=null){
            query.addCriteria(new Criteria().andOperator(Criteria.where("betTime").gt(post.getStartTime()),Criteria.where("betTime").lt(post.getEndTime())));
        } else {
            if(post.getStartTime()!=null){
                query.addCriteria( Criteria.where("betTime").gt(post.getStartTime()));
            }else if(post.getEndTime()!=null){
                query.addCriteria(Criteria.where("betTime").lt(post.getEndTime()));
            }
        }
        if(post.getEndTime()!=null){
            query.addCriteria(Criteria.where("betTime").lt(post.getEndTime()));
        }


        if(post.getUserId()!=null&&!"".equals(post.getUserId())){
            query.addCriteria(Criteria.where("userId").is(post.getUserId()));
        }
        if(post.getTicketId()!=null&&!"".equals(post.getTicketId())){
            query.addCriteria(Criteria.where("ticketId").is(post.getTicketId()));
        }
        if(post.getSettleResult()!=null){
            query.addCriteria(Criteria.where("settleResult").is(post.getSettleResult()));
        }
        if(post.getBetType()!=null){
            query.addCriteria(Criteria.where("betType").is(post.getBetType()));
        }
        if(post.getBetState()!=null){
            query.addCriteria(Criteria.where("betState").is(post.getBetState()));
        }
        int count = this.mongoTemplate.find(query, BetEntity.class).size();
        query.skip((post.getPageIndex() - 1) * post.getPageSize()).limit(post.getPageSize());
        query.with(Sort.by(Sort.Order.desc("betTime")));
        List<BetEntity> list = this.mongoTemplate.find(query, BetEntity.class);
        List<BetEntity> rspList =new ArrayList<BetEntity>();
        for (BetEntity bet: list) {
            bet.setOptionArray(JSONObject.parseArray(bet.getOptions(), OptionEntity.class));
            bet.setOptions(null);
            rspList.add(bet);
        }

        PageBean pg = new PageBean(post.getPageIndex(), post.getPageSize(), Long.valueOf(count), rspList);
        return WebMessage.success(pg);
    }
}
