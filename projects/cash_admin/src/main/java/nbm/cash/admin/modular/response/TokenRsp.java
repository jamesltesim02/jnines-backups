package nbm.cash.admin.modular.response;

/**
 * @Description
 * @ClassName TokenRsp
 * @Author New
 * @Date 2019/12/19 18:00
 * @Version V1.0
 **/
public class TokenRsp {

    public TokenRsp() {

    }

    public TokenRsp(String token) {
        this.token = token;
    }

    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}