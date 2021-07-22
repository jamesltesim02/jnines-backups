package nbm.cash.seamless.controller;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.service.SeamlessService;
import nbm.cash.seamless.utils.redis.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Date;

/**
 * @Description 基础控制器
 * @ClassName BaseController
 * @Author New
 * @Date 2019/11/22 10:50
 * @Version V1.0
 **/
@RestController
public class BaseController {

    @Autowired
    private SeamlessService seamlessService;

    @Autowired
    private RedisUtil redisUtil;

    public String tokenToUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return this.getUserId(token);
    }

    public String getUserId(String token) {
        try {
            Object obj = redisUtil.get(token);
            if (obj == null) {
                JSONObject json = seamlessService.getBalance(token);
                if (json.getIntValue("code") == 200) {
                    return json.getJSONObject("data").getString("customerId");
                }
            } else {
                return obj.toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}