package nbm.cash.admin.common.model;

import java.io.Serializable;

/**
 * @Description 已登录用户信息
 * @ClassName LoginUserInfo
 * @Author New
 * @Date 2019/12/12 16:36
 * @Version V1.0
 **/
public class LoginUserInfo implements Serializable {

    private String userId;

    private String userName;

    private String nickName;

    public LoginUserInfo(){

    }

    public LoginUserInfo(String userId, String userName, String nickName){
        this.userId = userId;
        this.userName = userName;
        this.nickName = nickName;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
}