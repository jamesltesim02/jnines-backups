package nbm.cash.admin.common.utils.http;

import nbm.cash.admin.common.utils.token.JwtUtil;

import javax.servlet.http.HttpServletRequest;

public class UserUtil {

    public static String getUserId(HttpServletRequest request){
        String token = request.getHeader("Authorization");
        return JwtUtil.getUserId(token);
    }
}