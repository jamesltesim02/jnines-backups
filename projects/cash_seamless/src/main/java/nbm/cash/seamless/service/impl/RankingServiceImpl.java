package nbm.cash.seamless.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import nbm.cash.seamless.entity.UserEntity;
import nbm.cash.seamless.request.PageModel;
import nbm.cash.seamless.request.ranking.RanKingModel;
import nbm.cash.seamless.response.ranking.RankingModel;
import nbm.cash.seamless.service.RankingService;
import nbm.cash.seamless.utils.http.WebMessage;
import nbm.cash.seamless.utils.other.DbPageable;
import nbm.cash.seamless.utils.other.PageBean;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @program: cash_seamless
 * @description: 榜单查询接口
 * @author: Mr.Nat
 * @create: 2019-11-19 10:16
 **/
@Service("rankingService")
public class RankingServiceImpl implements RankingService {

    protected static final Logger logger = LogManager.getLogger(PlanServiceImpl.class);

    @Autowired
    private MongoTemplate template;

    /**
     * 盈利榜
     *
     * @param model
     * @return
     */
    @Override
    public WebMessage QueryProfitRanking(RanKingModel model) {
        Query query = new Query();
        String param = "betReturnRateWeek";
        if ("month".equals(model.getTimeRange())) {
            param = "betReturnRateMonth";
        }
        DbPageable pageable = new DbPageable();
        PageModel pm = new PageModel();
        pm.setPageNumber(model.getPageIndex());
        pm.setPageSize(model.getPageSize());
        List<Sort.Order> orders = new ArrayList<>();  //排序
        orders.add(new Sort.Order(Sort.Direction.DESC, param));
        pm.setSort(Sort.by(orders));
        pageable.setPage(pm);
        Criteria userCri = Criteria.where("userState").is(1).and(param).gt(0);
        AggregationOperation userMatch = Aggregation.match(userCri);
        AggregationOperation fiel = Aggregation.project("userId", "userName", "header", param, "nickName");
        Aggregation aggregation = Aggregation.newAggregation(userMatch, fiel, Aggregation.sort(pageable.getSort()),
                Aggregation.skip(pageable.getPageNumber() > 1 ? (pageable.getPageNumber() - 1) * pageable.getPageSize() : 0),
                Aggregation.limit(pageable.getPageSize()));
        Aggregation counts = Aggregation.newAggregation(userMatch);
        Long count = new Long(template.aggregate(counts, "user", DBObject.class).getMappedResults().size());
        List<JSONObject> results = template.aggregate(aggregation, "user", JSONObject.class).getMappedResults();
        List<JSONObject> rs = new ArrayList<>();
        for (JSONObject ob : results) {
            ob.put("_id", ob.getString("_id"));
            ob.put("value", ob.getString(param));
            rs.add(ob);
        }
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), count, rs);
        return WebMessage.success(pg);
    }

    /**
     * 命中榜
     *
     * @param model
     * @return
     */
    @Override
    public WebMessage QueryBetRateRanking(RanKingModel model) {
        Query query = new Query();
        String param = "betRateWeek";
        if ("month".equals(model.getTimeRange())) {
            param = "betRateMonth";
        }
        DbPageable pageable = new DbPageable();
        PageModel pm = new PageModel();
        pm.setPageNumber(model.getPageIndex());
        pm.setPageSize(model.getPageSize());
        List<Sort.Order> orders = new ArrayList<>();  //排序
        orders.add(new Sort.Order(Sort.Direction.DESC, param));
        pm.setSort(Sort.by(orders));
        pageable.setPage(pm);
        Criteria userCri = Criteria.where("userState").is(1).and(param).gt(0);
        AggregationOperation userMatch = Aggregation.match(userCri);
        AggregationOperation fiel = Aggregation.project("userId", "userName", "header", param, "nickName");
        Aggregation aggregation = Aggregation.newAggregation(userMatch, fiel, Aggregation.sort(pageable.getSort()),
                Aggregation.skip(pageable.getPageNumber() > 1 ? (pageable.getPageNumber() - 1) * pageable.getPageSize() : 0),
                Aggregation.limit(pageable.getPageSize()));
        Aggregation counts = Aggregation.newAggregation(userMatch);
        Long count = new Long(template.aggregate(counts, "user", JSONObject.class).getMappedResults().size());
        List<JSONObject> results = template.aggregate(aggregation, "user", JSONObject.class).getMappedResults();
        List<JSONObject> rs = new ArrayList<>();
        for (JSONObject ob : results) {
            ob.put("_id", ob.getString("_id"));
            ob.put("value", ob.getString(param));
            rs.add(ob);
        }
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), count, rs);
        return WebMessage.success(pg);
    }

    /**
     * 连红榜
     *
     * @param model
     * @return
     */
    @Override
    public WebMessage QueryHitRanking(RanKingModel model) {
        Query query = new Query();
        String param = "weekHit";
        if ("month".equals(model.getTimeRange())) {
            param = "monthHit";
        }
        DbPageable pageable = new DbPageable();
        PageModel pm = new PageModel();
        pm.setPageNumber(model.getPageIndex());
        pm.setPageSize(model.getPageSize());
        List<Sort.Order> orders = new ArrayList<>();  //排序
        orders.add(new Sort.Order(Sort.Direction.DESC, param));
        pm.setSort(Sort.by(orders));
        pageable.setPage(pm);
        Criteria userCri = Criteria.where("userState").is(1).and(param).gt(0);
        AggregationOperation userMatch = Aggregation.match(userCri);
        AggregationOperation fiel = Aggregation.project("userId", "userName", "header", param, "nickName");
        Aggregation aggregation = Aggregation.newAggregation(userMatch, fiel, Aggregation.sort(pageable.getSort()),
                Aggregation.skip(pageable.getPageNumber() > 1 ? (pageable.getPageNumber() - 1) * pageable.getPageSize() : 0),
                Aggregation.limit(pageable.getPageSize()));
        Aggregation counts = Aggregation.newAggregation(userMatch);
        Long count = new Long(template.aggregate(counts, "user", JSONObject.class).getMappedResults().size());
        List<JSONObject> results = template.aggregate(aggregation, "user", JSONObject.class).getMappedResults();
        List<JSONObject> rs = new ArrayList<>();
        for (JSONObject ob : results) {
            ob.put("_id", ob.getString("_id"));
            ob.put("value", ob.getString(param));
            rs.add(ob);
        }
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), count, rs);
        return WebMessage.success(pg);
    }

    /**
     * 带红榜
     *
     * @param model
     * @return
     */
    @Override
    public WebMessage QueryRedRanking(RanKingModel model) {
        Query query = new Query();
        String param = "weekRed";

        if ("month".equals(model.getTimeRange())) {
            param = "monthRed";
        }
        DbPageable pageable = new DbPageable();
        PageModel pm = new PageModel();
        pm.setPageNumber(model.getPageIndex());
        pm.setPageSize(model.getPageSize());
        List<Sort.Order> orders = new ArrayList<>();  //排序
        orders.add(new Sort.Order(Sort.Direction.DESC, param));
        pm.setSort(Sort.by(orders));
        pageable.setPage(pm);
        Criteria userCri = Criteria.where("userState").is(1).and(param).gt(0);
        AggregationOperation userMatch = Aggregation.match(userCri);
        AggregationOperation fiel = Aggregation.project("userId", "userName", "header", param, "nickName");
        Aggregation aggregation = Aggregation.newAggregation(userMatch, fiel, Aggregation.sort(pageable.getSort()),
                Aggregation.skip(pageable.getPageNumber() > 1 ? (pageable.getPageNumber() - 1) * pageable.getPageSize() : 0),
                Aggregation.limit(pageable.getPageSize()));
        Aggregation counts = Aggregation.newAggregation(userMatch);
        Long count = new Long(template.aggregate(counts, "user", JSONObject.class).getMappedResults().size());
        List<JSONObject> results = template.aggregate(aggregation, "user", JSONObject.class).getMappedResults();
        List<JSONObject> rs = new ArrayList<>();
        for (JSONObject ob : results) {
            ob.put("_id", ob.getString("_id"));
            ob.put("value", ob.getString(param));
            rs.add(ob);
        }
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), count, rs);
        return WebMessage.success(pg);
    }

}
