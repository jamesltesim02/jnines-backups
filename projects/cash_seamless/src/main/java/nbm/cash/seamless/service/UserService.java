package nbm.cash.seamless.service;

import nbm.cash.seamless.request.UserModel;
import nbm.cash.seamless.utils.http.WebMessage;

import java.io.IOException;

public interface UserService {

    public WebMessage queryUserInfo(String id,String balance,String token);

    public WebMessage updateUser(UserModel model);

}
