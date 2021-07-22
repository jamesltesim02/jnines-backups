package nbm.cash.admin.modular.service;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.entity.RoleResource;
import nbm.cash.admin.modular.request.resource.ResourcePost;
import nbm.cash.admin.modular.request.resource.ResourceQuery;

/**
 * @Description
 * @ClassName ResourceService
 * @Author New
 * @Date 2019/12/26 16:33
 * @Version V1.0
 **/
public interface ResourceService {

    public WebMessage getResourceList(ResourceQuery model);

    public WebMessage addResource(RoleResource model);

    public WebMessage updateResource(ResourcePost model);

    public WebMessage delResource(String id);
}