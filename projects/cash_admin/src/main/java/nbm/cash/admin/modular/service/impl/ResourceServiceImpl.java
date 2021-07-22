package nbm.cash.admin.modular.service.impl;

import com.mongodb.client.result.UpdateResult;
import nbm.cash.admin.common.utils.http.RespCodeEnum;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.other.PageBean;
import nbm.cash.admin.common.utils.other.StringUtil;
import nbm.cash.admin.modular.entity.AdminUser;
import nbm.cash.admin.modular.entity.RoleEntity;
import nbm.cash.admin.modular.entity.RoleResource;
import nbm.cash.admin.modular.request.resource.ResourcePost;
import nbm.cash.admin.modular.request.resource.ResourceQuery;
import nbm.cash.admin.modular.service.ResourceService;
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
import java.util.regex.Pattern;

/**
 * @Description
 * @ClassName ResourceServiceImpl
 * @Author New
 * @Date 2019/12/26 16:36
 * @Version V1.0
 **/
@Service("resourceService")
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public WebMessage getResourceList(ResourceQuery model) {
        Query query = new Query();
        if(!StringUtil.isEmpty(model.getResourceName())) {
            Pattern pattern=Pattern.compile(".*" + model.getResourceName() + ".*",Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where("resourceName").regex(pattern));
        }

        long count = mongoTemplate.count(query, RoleResource.class);
        query.skip((model.getPageIndex() - 1) * model.getPageSize()).limit(model.getPageSize());
        query.with(Sort.by(Sort.Order.desc("createTime")));
        List<RoleResource> resourceList = mongoTemplate.find(query, RoleResource.class);
        PageBean pg = new PageBean(model.getPageIndex(), model.getPageSize(), Long.valueOf(count), resourceList);
        return WebMessage.success(pg);
    }

    @Override
    public WebMessage addResource(RoleResource model) {
        if("root".equals(model.getParentId())){
            model.setParentRootName("根节点");
        } else {
            RoleResource parent = mongoTemplate.findById(model.getParentId(), RoleResource.class);
            if(parent != null){
                model.setParentRootName(parent.getResourceName());
            }
        }
        model.setCreateTime(System.currentTimeMillis());

        RoleResource saveModel = mongoTemplate.insert(model);
        if(saveModel != null){
            return WebMessage.success();
        }
        return WebMessage.construct(RespCodeEnum.FAIL);
    }

    @Transactional
    @Override
    public WebMessage updateResource(ResourcePost model) {
        RoleResource exist = mongoTemplate.findById(model.get_id(), RoleResource.class);
        if(exist != null) {
            Query query = new Query();
            Update update = new Update();
            if(exist.getParentId().equals(model.getParentId())) {
                query.addCriteria(Criteria.where("_id").is(model.get_id()));
                update.set("resourceName", model.getResourceName());
                update.set("name", model.getName());
                update.set("path", model.getPath());
                update.set("resourceNo", model.getResourceNo());
                UpdateResult result = mongoTemplate.updateFirst(query, update, RoleResource.class);
                if(result != null && result.getModifiedCount() == 1){
                    return WebMessage.success();
                }
            } else {
                RoleResource parent = mongoTemplate.findById(model.getParentId(), RoleResource.class);
                if(parent != null){
                    query.addCriteria(Criteria.where("_id").is(model.get_id()));
                    update.set("resourceName", model.getResourceName());
                    update.set("name", model.getName());
                    update.set("path", model.getPath());
                    update.set("resourceNo", model.getResourceNo());
                    update.set("parentId", parent.get_id());
                    update.set("parentRootName", parent.getResourceName());
                    UpdateResult result = mongoTemplate.updateFirst(query, update, RoleResource.class);
                    if(result != null && result.getModifiedCount() == 1){
                        Query queryRole = Query.query(Criteria.where("state").is(1));
                        List<RoleEntity> roleList = mongoTemplate.find(queryRole, RoleEntity.class);
                        for (RoleEntity role : roleList) {
                            boolean breakFlag = false;
                            for (RoleResource resource: role.getRoleResource()) {
                                if(resource.get_id().equals(model.get_id())){
                                    resource.setResourceName(model.getResourceName());
                                    resource.setName(model.getName());
                                    resource.setPath(model.getPath());
                                    resource.setResourceNo(model.getResourceNo());
                                    resource.setParentId(parent.getParentId());
                                    resource.setParentRootName(parent.getResourceName());
                                    breakFlag = true;
                                    break;
                                } else {
                                    for (RoleResource Res: resource.getNextResourceList()) {
                                        if(Res.get_id().equals(model.get_id())){
                                            Res.setResourceName(model.getResourceName());
                                            Res.setName(model.getName());
                                            Res.setPath(model.getPath());
                                            Res.setResourceNo(model.getResourceNo());
                                            Res.setParentId(parent.getParentId());
                                            Res.setParentRootName(parent.getResourceName());
                                            breakFlag = true;
                                            break;
                                        }
                                    }
                                }

                                if(breakFlag){
                                    break;
                                }
                            }

                            if(breakFlag){
                                Query upQuery = Query.query(Criteria.where("_id").is(role.get_id()));
                                Update up = new Update();
                                up.set("roleResource", role.getRoleResource());
                                mongoTemplate.updateFirst(upQuery, up, RoleEntity.class);
                            }
                        }

                        return WebMessage.success();
                    }
                }
            }
        }
        return WebMessage.construct(RespCodeEnum.FAIL);
    }

    @Override
    public WebMessage delResource(String id) {
        RoleResource exist = mongoTemplate.findById(id, RoleResource.class);
        if(exist != null){
            List<String> idList = new ArrayList<>();
            idList.add(id);
            Update update = new Update();
            if(exist.getName().equals("root")){
                Query queryList = Query.query(Criteria.where("parentId").is(id));
                queryList.fields().include("_id");
                List<RoleResource> list = mongoTemplate.find(queryList, RoleResource.class);
                for (RoleResource resource : list) {
                    idList.add(resource.get_id());
                }
            }
            Query up = Query.query(Criteria.where("_id").in(idList));
            update.set("state", 0);
            UpdateResult result = mongoTemplate.updateFirst(up, update, RoleResource.class);
            if(result != null && result.getModifiedCount() == idList.size()){
                Query queryRole = Query.query(Criteria.where("state").is(1));
                List<RoleEntity> roleList = mongoTemplate.find(queryRole, RoleEntity.class);
                for (RoleEntity role : roleList) {
                    boolean breakFlag = false;
                    for (RoleResource resource : role.getRoleResource()){
                        if(resource.get_id().equals(id)){
                            role.getRoleResource().remove(resource);
                            breakFlag = true;
                            break;
                        } else {
                            for (RoleResource res : resource.getNextResourceList()) {
                                if(res.get_id().equals(id)){
                                    resource.getNextResourceList().remove(res);
                                    breakFlag = true;
                                    break;
                                }
                            }
                        }

                        if(breakFlag){
                            break;
                        }
                    }

                    if(breakFlag){
                        Query upQuery = Query.query(Criteria.where("_id").is(role.get_id()));
                        Update upRole = new Update();
                        upRole.set("roleResource", role.getRoleResource());
                        mongoTemplate.updateFirst(upQuery, upRole, RoleEntity.class);
                    }
                }
                return WebMessage.success();
            }
        }
        return WebMessage.construct(RespCodeEnum.FAIL);
    }
}