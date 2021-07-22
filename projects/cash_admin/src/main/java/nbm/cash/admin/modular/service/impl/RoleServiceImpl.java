package nbm.cash.admin.modular.service.impl;

import com.mongodb.client.result.UpdateResult;
import nbm.cash.admin.common.utils.http.RespCodeEnum;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.other.PageBean;
import nbm.cash.admin.common.utils.other.StringUtil;
import nbm.cash.admin.modular.entity.AdminUser;
import nbm.cash.admin.modular.entity.RoleEntity;
import nbm.cash.admin.modular.request.role.RolePost;
import nbm.cash.admin.modular.request.role.RoleQuery;
import nbm.cash.admin.modular.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service("roleService")
public class RoleServiceImpl implements RoleService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public WebMessage getRoleList(RoleQuery model) {

        Query query = new Query();
        if(!StringUtil.isEmpty(model.getRoleName())) {
            Pattern pattern=Pattern.compile(".*" + model.getRoleName() + ".*",Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where("roleName").regex(pattern));
        }

        long count = mongoTemplate.count(query, RoleEntity.class);
        query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
        query.with(Sort.by(Sort.Order.desc("createTime")));

        List<RoleEntity> roleList = mongoTemplate.find(query, RoleEntity.class);
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), Long.valueOf(count), roleList);
        return WebMessage.success(pg);
    }

    @Override
    public WebMessage delRole(String id) {
        Query query = Query.query(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("state", 0);
        UpdateResult result = mongoTemplate.updateFirst(query, update, RoleEntity.class);

        if(result != null && result.getModifiedCount() == 1){
            return WebMessage.success();
        }
        return WebMessage.construct(RespCodeEnum.FAIL);
    }

    @Override
    public WebMessage addRole(RolePost model) {
        return null;
    }
}
