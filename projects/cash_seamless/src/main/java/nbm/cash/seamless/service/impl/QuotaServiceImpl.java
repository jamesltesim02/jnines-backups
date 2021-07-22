package nbm.cash.seamless.service.impl;

import nbm.cash.seamless.entity.QuotaEntity;
import nbm.cash.seamless.service.QuotaService;
import nbm.cash.seamless.utils.http.WebMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @Description
 * @ClassName QuotaServiceImpl
 * @Author New
 * @Date 2019/12/19 11:12
 * @Version V1.0
 **/
@Service("quotaService")
public class QuotaServiceImpl implements QuotaService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public WebMessage findFollowQuota(Integer num) {
        List<QuotaEntity> quotaList = new ArrayList<QuotaEntity>();
        if(num != null){
            if(num >= 6){
                num = -1;
            }
            Query query = Query.query(Criteria.where("num").is(num));
            quotaList = mongoTemplate.find(query, QuotaEntity.class);
        } else {
            quotaList = mongoTemplate.findAll(QuotaEntity.class);
        }
        return WebMessage.success(quotaList);
    }
}