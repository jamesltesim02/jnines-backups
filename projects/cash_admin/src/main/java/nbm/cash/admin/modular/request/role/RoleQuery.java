package nbm.cash.admin.modular.request.role;

import nbm.cash.admin.common.BasePost;

/**
 * @Description
 * @ClassName RoleQuery
 * @Author New
 * @Date 2019/12/26 14:36
 * @Version V1.0
 **/
public class RoleQuery extends BasePost {

    private String roleName;

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}