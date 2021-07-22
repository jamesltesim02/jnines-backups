package nbm.cash.admin.modular.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.util.JSON;
import nbm.cash.admin.common.utils.http.RespCodeEnum;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.entity.AdminUser;
import nbm.cash.admin.modular.entity.RoleEntity;
import nbm.cash.admin.modular.entity.RoleResource;
import nbm.cash.admin.modular.request.LoginPost;
import nbm.cash.admin.modular.service.UserService;
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

/**
 * @Description
 * @ClassName UserServiceImpl
 * @Author New
 * @Date 2019/12/13 11:04
 * @Version V1.0
 **/
@Service("userService")
public class UserServiceImpl implements UserService {

    protected static final Logger logger = LogManager.getLogger(UserServiceImpl.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public AdminUser login(LoginPost post) {
        Query query = Query.query(Criteria.where("userName").is(post.getUserName()).and("state").is(1));
        AdminUser admin = mongoTemplate.findOne(query, AdminUser.class);
        if(admin != null) {
            return admin;
        }
        return null;
    }

    @Override
    public WebMessage getNavBar(String userId) {
        AdminUser adminUser = mongoTemplate.findById(userId, AdminUser.class);
        if(adminUser != null){
            RoleEntity role = mongoTemplate.findById(adminUser.getRoleId(), RoleEntity.class);
            if(role != null){
                return WebMessage.success(role.getRoleResource());
            }
        }
        return WebMessage.construct(RespCodeEnum.DATA_NOT_EXIST);
    }

    @Override
    public void test(String userId) {
        AdminUser  adminUser = mongoTemplate.findById(userId, AdminUser.class);
        if(adminUser != null){
            RoleEntity role = mongoTemplate.findById(adminUser.getRoleId(), RoleEntity.class);
            if(role != null) {
                Query query = Query.query(Criteria.where("parentId").is("root"));
                query.with(Sort.by(Sort.Order.asc("resourceNo")));

                List<RoleResource> roleList =  mongoTemplate.find(query, RoleResource.class);
                for (RoleResource resource : roleList) {
                    Query que = new Query();
                    que.addCriteria(Criteria.where("parentId").is(resource.get_id()));
                    que.with(Sort.by(Sort.Order.asc("resourceNo")));
                    List<RoleResource> queList =  mongoTemplate.find(que, RoleResource.class);
                    if(queList != null && queList.size() > 0){
                        resource.setNextResourceList(queList);
                    }
                }

                Query queryRole = Query.query(Criteria.where("_id").is(role.get_id()));
                Update update = new Update();
                String str = JSONObject.toJSONString(roleList);
                update.set("roleResource", str);
                mongoTemplate.updateFirst(queryRole, update, RoleEntity.class);
            }
        }
    }
}