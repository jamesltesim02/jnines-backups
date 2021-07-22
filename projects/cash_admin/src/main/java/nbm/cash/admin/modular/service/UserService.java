package nbm.cash.admin.modular.service;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.entity.AdminUser;
import nbm.cash.admin.modular.request.LoginPost;

/**
 * @Description 用户相关接口
 * @ClassName UserService
 * @Author New
 * @Date 2019/12/13 10:51
 * @Version V1.0
 **/
public interface UserService {

    public AdminUser login(LoginPost post);

    public WebMessage getNavBar(String userId);

    public void test(String userId);

}