package nbm.cash.admin.modular.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Description 首页
 * @ClassName MainIndexController
 * @Author New
 * @Date 2019/12/15 15:00
 * @Version V1.0
 **/
@RequestMapping("/index")
@Controller
public class MainIndexController {

    /**
     * 登陆成功跳转首页
     * @return
     */
    @RequestMapping("/main")
    public String index(){
        return "main";
    }
}