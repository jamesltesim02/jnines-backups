package nbm.cash.admin.modular.controller;

import nbm.cash.admin.common.utils.http.RespCodeEnum;
import nbm.cash.admin.common.utils.other.MD5Util;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.token.JwtUtil;
import nbm.cash.admin.modular.entity.AdminUser;
import nbm.cash.admin.modular.request.LoginPost;
import nbm.cash.admin.modular.response.TokenRsp;
import nbm.cash.admin.modular.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @Description 用户登录接口
 * @ClassName LoginLogController
 * @Author New
 * @Date 2019/12/12 11:04
 * @Version V1.0
 **/
@Controller
@RequestMapping("/user")
public class LoginController {

    @Autowired
    private UserService userService;

    /**
     * 登陆接口，登陆成功，保存状态
     * @param post
     * @param request
     * @return
     */
    @RequestMapping("/login")
    @ResponseBody
    public WebMessage login(@RequestBody LoginPost post, HttpServletRequest request) {
        AdminUser admin = userService.login(post);
        if(admin != null) {
            if(admin.getPassWord().equals(MD5Util.getMD5(post.getPassWord()))){
                HttpSession session = request.getSession();
                session.setAttribute(admin.get_id(), admin);
                System.out.println("session:"+ session.getId());
                admin.setToken(JwtUtil.sign(admin.get_id()));
                return WebMessage.success(admin);
            }
            return WebMessage.construct(RespCodeEnum.PASSWORD_ERROR);
        }
        return WebMessage.construct(RespCodeEnum.USER_NOT_EXIST);
    }

    @RequestMapping("/getToken")
    @ResponseBody
    public WebMessage getToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return WebMessage.success(new TokenRsp(JwtUtil.sign(JwtUtil.getUserId(token))));
    }

    @RequestMapping("/loginOut")
    @ResponseBody
    public WebMessage loginOut(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        request.getSession().removeAttribute(JwtUtil.getUserId(token));
        return WebMessage.success();
    }

    @RequestMapping("/getNavBar")
    @ResponseBody
    public WebMessage getNavBar(HttpServletRequest request){
        String token = request.getHeader("Authorization");
        return userService.getNavBar(JwtUtil.getUserId(token));
    }

    @RequestMapping("/test")
    @ResponseBody
    public WebMessage test(HttpServletRequest request){
        userService.test("5dc285143e461944157518cf");
        return null;
    }
}