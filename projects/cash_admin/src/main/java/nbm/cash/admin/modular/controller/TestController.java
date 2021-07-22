package nbm.cash.admin.modular.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @Description
 * @ClassName TestController
 * @Author New
 * @Date 2019/12/13 11:33
 * @Version V1.0
 **/
@RequestMapping("/test")
@Controller
public class TestController {

    @RequestMapping("")
    @ResponseBody
    public String test(){
        return  "Hello Word!";
    }
}