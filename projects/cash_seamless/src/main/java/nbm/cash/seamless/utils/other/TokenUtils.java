package nbm.cash.seamless.utils.other;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description token工具类
 * @ClassName TokenUtils
 * @Author New
 * @Date 2019/11/22 10:38
 * @Version V1.0
 **/
public class TokenUtils {

    /**
     * 根据用户请求，从请求头里面获取用户token
     *
     * @param request
     * @return
     */
    public static String getToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return token;
    }
}