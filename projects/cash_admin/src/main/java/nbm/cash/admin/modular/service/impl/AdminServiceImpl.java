package nbm.cash.admin.modular.service.impl;

import com.mongodb.client.result.UpdateResult;
import nbm.cash.admin.common.utils.http.RespCodeEnum;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.other.PageBean;
import nbm.cash.admin.common.utils.other.StringUtil;
import nbm.cash.admin.modular.entity.AdminUser;
import nbm.cash.admin.modular.entity.NoticeEntity;
import nbm.cash.admin.modular.entity.RoleEntity;
import nbm.cash.admin.modular.request.admin.AdminPost;
import nbm.cash.admin.modular.request.admin.AdminQuery;
import nbm.cash.admin.modular.request.admin.SetAdminRolePost;
import nbm.cash.admin.modular.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service("adminService")
public class AdminServiceImpl implements AdminService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public WebMessage getAdminList(AdminQuery model) {
        Query query = new Query();
        if(!StringUtil.isEmpty(model.getUserName())) {
            Pattern pattern=Pattern.compile(".*" + model.getUserName() + ".*",Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where("userName").regex(pattern));
        }

        if(!StringUtil.isEmpty(model.getRoleId())){
            query.addCriteria(Criteria.where("roleId").is(model.getRoleId()));
        }

        long count = mongoTemplate.count(query, AdminUser.class);
        query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
        query.with(Sort.by(Sort.Order.desc("createTime")));
        List<AdminUser> adminList = mongoTemplate.find(query, AdminUser.class);
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), Long.valueOf(count), adminList);
        return WebMessage.success(pg);
    }

    @Override
    public WebMessage addAdminUser(AdminUser model) {
        mongoTemplate.insert(model);
        return WebMessage.success();
    }

    @Override
    public WebMessage delAdmin(String id) {
        Query query = Query.query(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("state", 0);
        UpdateResult result = mongoTemplate.updateFirst(query, update, AdminUser.class);

        if(result != null && result.getModifiedCount() == 1){
            return WebMessage.success();
        }
        return WebMessage.construct(RespCodeEnum.FAIL);
    }

    @Override
    public WebMessage updateAdmin(AdminPost model) {
        Query query = Query.query(Criteria.where("_id").is(model.get_id()));
        Update update = new Update();
        update.set("nickName", model.getNickName());
        update.set("phone", model.getPhone());
        update.set("header", model.getHeader());
        update.set("note", model.getNote());
        UpdateResult result = mongoTemplate.updateFirst(query, update, AdminUser.class);

        if(result != null && result.getModifiedCount() == 1){
            return WebMessage.success();
        }
        return WebMessage.construct(RespCodeEnum.FAIL);
    }

    @Override
    public WebMessage setAdminRole(SetAdminRolePost model) {
        RoleEntity role = mongoTemplate.findById(model.getRoleId(), RoleEntity.class);
        if(role != null){
            Query query = Query.query(Criteria.where("_id").is(model.getAdminId()));
            Update update = new Update();
            update.set("roleId", model.getRoleId());
            update.set("roleName", role.getRoleName());

            UpdateResult result = mongoTemplate.updateFirst(query, update, AdminUser.class);
            if(result != null && result.getModifiedCount() == 1){
                return WebMessage.success();
            }
            return WebMessage.construct(RespCodeEnum.FAIL);
        }
        return WebMessage.construct(RespCodeEnum.DATA_NOT_EXIST);
    }

}
