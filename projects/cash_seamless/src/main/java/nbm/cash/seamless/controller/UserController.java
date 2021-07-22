package nbm.cash.seamless.controller;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.request.UserModel;
import nbm.cash.seamless.service.UserService;
import nbm.cash.seamless.utils.http.RespCodeEnum;
import nbm.cash.seamless.utils.http.WebMessage;
import nbm.cash.seamless.utils.redis.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * @program: cash_seamless
 * @description: 用户
 * @author: Mr.Nat
 * @create: 2019-11-21 15:55
 **/
@RequestMapping("/user")
@RestController
public class UserController extends BaseController {
    @Autowired
    private RedisUtil redisUtil;

    @Autowired
    private UserService userService;

    /**
     * 用户个人信息
     *
     * @return
     */
    @ResponseBody
    @RequestMapping("/userInfo")
    public WebMessage userInfo(HttpServletRequest request,String balance) {
        String id = this.tokenToUser(request);
        if (id == null || "".equals(id)) {
            return WebMessage.construct(RespCodeEnum.DATA_NOT_EXIST);
        }
        return userService.queryUserInfo(id,balance,request.getHeader("Authorization"));
    }

    /**
     * 大神个人资料
     *
     * @return
     */
    @ResponseBody
    @RequestMapping("/hotUserInfo")
    public WebMessage hotUserInfo(String userId,String balance) {
        return userService.queryUserInfo(userId,balance,null);
    }

    /**
     * 修改用户信息
     *
     * @return
     */
    @ResponseBody
    @RequestMapping("/updateUser")
    public WebMessage updateUser(@RequestBody UserModel model, HttpServletRequest request) {
        String id = this.tokenToUser(request);
        if (id == null || "".equals(id)) {
            return WebMessage.construct(RespCodeEnum.DATA_NOT_EXIST);
        }
        model.setUserId(id);
        return userService.updateUser(model);
    }
}