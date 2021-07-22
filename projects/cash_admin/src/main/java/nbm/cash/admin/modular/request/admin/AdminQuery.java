package nbm.cash.admin.modular.request.admin;

import nbm.cash.admin.common.BasePost;

/**
 * @Description 查询用户信息参数
 * @ClassName AdminQu
 * @Author New
 * @Date 2019/12/26 10:43
 * @Version V1.0
 **/
public class AdminQuery extends BasePost {

    private String userName;

    private String roleId;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }
}