package nbm.cash.admin.modular.request;

/**
 * @Description 登陆请求参数
 * @ClassName LoginPost
 * @Author New
 * @Date 2019/12/12 17:27
 * @Version V1.0
 **/
public class LoginPost {

    private String userName;

    private String passWord;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassWord() {
        return passWord;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }
}