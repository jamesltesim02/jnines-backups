package nbm.cash.admin.modular.service.impl;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.other.PageBean;
import nbm.cash.admin.modular.entity.*;
import nbm.cash.admin.modular.request.PlanPost;
import nbm.cash.admin.modular.service.PlanService;
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
 * @program: cash_admin
 * @description: 方案
 * @author: Mr.Nat
 * @create: 2019-12-20 11:22
 **/
@Service("planService")
public class PlanServiceImpl implements PlanService {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Override
    public WebMessage query(PlanPost post) {
        Query query =new Query();
        query.addCriteria(Criteria.where("ticketType").is(2));
        if(post.getStartTime()!=null && post.getEndTime()!=null){
            query.addCriteria(new Criteria().andOperator(Criteria.where("betTime").gt(post.getStartTime()),Criteria.where("betTime").lt(post.getEndTime())));
        } else {
            if(post.getStartTime()!=null){
                query.addCriteria(Criteria.where("planTime").gt(post.getStartTime()));
            }
            if(post.getEndTime()!=null){
                query.addCriteria( Criteria.where("planTime").lt(post.getEndTime()));
            }
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
        if(post.getBetState()!=null){
            query.addCriteria(Criteria.where("betState").is(post.getBetState()));
        }
        int count = this.mongoTemplate.find(query, PlanEntity.class).size();
        query.skip((post.getPageIndex() - 1) * post.getPageSize()).limit(post.getPageSize());
        List<Sort.Order> orders = new ArrayList<>();
        orders.add(new Sort.Order(Sort.Direction.DESC, "isTop"));
        orders.add(new Sort.Order(Sort.Direction.DESC, "planTime"));
        query.with(Sort.by(orders));
        List<PlanEntity> list = this.mongoTemplate.find(query, PlanEntity.class);
        List<PlanEntity> rspList =new ArrayList<PlanEntity>();
        for (PlanEntity bet: list) {
            bet.setOptionArray(JSONObject.parseArray(bet.getOptions(), OptionEntity.class));
            bet.setOptions(null);
            rspList.add(bet);
        }
        PageBean pg = new PageBean(post.getPageIndex(), post.getPageSize(), Long.valueOf(count), rspList);
        return WebMessage.success(pg);
    }

    @Transactional
    @Override
    public WebMessage update(PlanPost post) {
        Query queryBet = Query.query(Criteria.where("ticketId").is(post.getTicketId()));
        Query queryUser = Query.query(Criteria.where("_id").is(post.getAuditUserId()));
        AdminUser user = this.mongoTemplate.findOne(queryUser,AdminUser.class);
        Update update = new Update();
        PlanChangeRecordEntity pcr = new PlanChangeRecordEntity();
        if(post.getIsTop()!=null){
            update.set("isTop",post.getIsTop());
            pcr.setChangeType(1);
            pcr.setTicketId(post.getTicketId());
            pcr.setIsTop(post.getIsTop());
            pcr.setUserId(user.getUserName());
            pcr.setUpdateTime(post.getAuditTime());
        }
        if(post.getPlanState()!=null){
            update.set("planState",post.getPlanState());
            update.set("auditUserId",user.getUserName());
            update.set("auditTime",post.getAuditTime());
            pcr.setChangeType(3);
            pcr.setTicketId(post.getTicketId());
            pcr.setPlanState(post.getPlanState());
            pcr.setUserId(user.getUserName());
            pcr.setUpdateTime(post.getAuditTime());
        }
        if(post.getPlanContent()!=null&&!"".equals(post.getPlanContent())){
            update.set("planContent",post.getPlanContent());
            PlanEntity plan = this.mongoTemplate.findOne(queryBet,PlanEntity.class);
            pcr.setOidContent(plan.getPlanContent());
            pcr.setNewContent(post.getPlanContent());
            pcr.setChangeType(2);
            pcr.setTicketId(post.getTicketId());
            pcr.setUserId(user.getUserName());
            pcr.setUpdateTime(post.getAuditTime());
            pcr.setRemark(post.getRemark());
        }
        this.mongoTemplate.updateFirst(queryBet,update,"bet");
        this.mongoTemplate.insert(pcr);
        return WebMessage.success();
    }

}
