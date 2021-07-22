package nbm.cash.admin.modular.service;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.entity.AdminUser;
import nbm.cash.admin.modular.request.admin.AdminPost;
import nbm.cash.admin.modular.request.admin.AdminQuery;
import nbm.cash.admin.modular.request.admin.SetAdminRolePost;

public interface AdminService {

    public WebMessage getAdminList(AdminQuery model);

    public WebMessage addAdminUser(AdminUser model);

    public WebMessage delAdmin(String id);

    public WebMessage updateAdmin(AdminPost model);

    public WebMessage setAdminRole(SetAdminRolePost model);
}