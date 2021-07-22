package nbm.cash.admin.common.utils.token;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @Description Token相关
 * @ClassName TokenUtil
 * @Author New
 * @Date 2019/12/19 13:42
 * @Version V1.0
 **/
public class JwtUtil {

    /**
     * 过期时间
     */
    private static final long EXPIRE_TIME = 2 * 60 * 60 * 1000;

    /**
     * token秘钥
     */
    private static final String TOKEN_SECRET = "admin";

    /**
     * 生成token
     * @param userId
     * @return
     */
    public static String sign(String userId){
        try{
            Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);
            Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
            Map<String, Object> header = new HashMap<String, Object>();
            header.put("typ", "JWT");
            header.put("alg", "HS256");
            return JWT.create().withHeader(header).withClaim("userId", userId).withExpiresAt(date).sign(algorithm);
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * 验证token有效性
     * @param token
     * @return
     */
    public static boolean verify(String token){
        try{
            Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT jwt = verifier.verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 获取Token中的userId
     * @param token
     * @return
     */
    public static String getUserId(String token){
        try{
            DecodedJWT verifier = JWT.decode(token);
            return verifier.getClaim("userId").asString();
        } catch (Exception e) {
            return "";
        }
    }

}