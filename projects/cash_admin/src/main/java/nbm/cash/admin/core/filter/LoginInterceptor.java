package nbm.cash.admin.core.filter;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.admin.common.constant.ConfigConstant;
import nbm.cash.admin.common.model.LoginUserInfo;
import nbm.cash.admin.common.utils.http.RespCodeEnum;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.token.JwtUtil;
import nbm.cash.admin.modular.entity.AdminUser;
import nbm.cash.admin.modular.service.impl.NoticeServiceImpl;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

/**
 * @Description 自定义拦截器必须实现HandlerInterceptor,定义一个登录拦截器，拦截需要登录的操作，若未登录则重定向至登录界面
 * @ClassName LoginInterceptor
 * @Author New
 * @Date 2019/12/12 15:41
 * @Version V1.0
 **/
@CrossOrigin(allowCredentials ="true")
public class LoginInterceptor implements HandlerInterceptor {

    protected static final Logger logger = LogManager.getLogger(LoginInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if(!"OPTIONS".equals(request.getMethod())){
            String token = request.getHeader("Authorization");
            if(JwtUtil.verify(token)){
                HttpSession session = request.getSession();
                System.out.println("session:"+ session.getId());
                String _id = JwtUtil.getUserId(token);
                Object obj = session.getAttribute(_id);
                if(obj != null){
                    AdminUser admin = (AdminUser)obj;
                    if(admin == null) {
                        returnJson(response);
                        return false;
                    }
                    return true;
                }
            }
            returnJson(response);
            return false;
        }

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }

    private void returnJson(HttpServletResponse response) {
        PrintWriter writer = null;
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        try {
            writer = response.getWriter();
            writer.write(JSONObject.toJSONString(WebMessage.construct(RespCodeEnum.SIGNATURE_INVALID)));
        } catch (IOException e){
            logger.error("拦截异常" + e);
        } finally {
            if(writer != null){
                writer.close();
            }
        }
    }
}