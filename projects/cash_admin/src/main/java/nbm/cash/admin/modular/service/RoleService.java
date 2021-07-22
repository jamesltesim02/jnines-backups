package nbm.cash.admin.modular.service;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.request.role.RolePost;
import nbm.cash.admin.modular.request.role.RoleQuery;

public interface RoleService {

    /**
     * 条件查询角色
     * @param model
     * @return
     */
    public WebMessage getRoleList(RoleQuery model);

    public WebMessage delRole(String id);

    public WebMessage addRole(RolePost model);
}
