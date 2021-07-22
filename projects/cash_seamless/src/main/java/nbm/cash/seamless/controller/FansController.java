package nbm.cash.seamless.controller;

import nbm.cash.seamless.request.fans.FocusModel;
import nbm.cash.seamless.request.fans.FocusOnModel;
import nbm.cash.seamless.service.FansService;
import nbm.cash.seamless.utils.http.WebMessage;
import nbm.cash.seamless.utils.other.LogUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description 粉丝相关接口
 * @ClassName FansController
 * @Author New
 * @Date 2019/11/14 19:14
 * @Version V1.0
 **/
@RequestMapping("/fans")
@RestController
public class FansController extends BaseController{

    @Autowired
    private FansService fansService;

    /**
     * 我的关注列表
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/myFocus")
    @ResponseBody
    public WebMessage myFocusList(HttpServletRequest request) {
        return fansService.myFocusList(new FocusModel(tokenToUser(request)));
    }

    /**
     * 我的粉丝列表
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/myFans")
    @ResponseBody
    public WebMessage myFansList(HttpServletRequest request) {
        return fansService.myFansList(new FocusModel(tokenToUser(request)));
    }

    /**
     * 关注
     *
     * @param model
     * @return
     */
    @RequestMapping("/focus")
    @ResponseBody
    public WebMessage focusOnSomeOne(@RequestBody FocusOnModel model) {
        return fansService.focusOnSomeOne(model);
    }

    /**
     * 取消关注
     *
     * @param model
     * @return
     */
    @RequestMapping("/cancel")
    @ResponseBody
    public WebMessage cancelFocus(@RequestBody FocusOnModel model) {
        return fansService.cancelFocus(model);
    }

    /**
     * 统计我的关注和我的粉丝数
     *
     * @param userId
     * @return
     */
    @RequestMapping("/fansAndFocus")
    @ResponseBody
    public WebMessage fansAndFocusCount(String userId) {
        return fansService.fansAndFocusCount(new FocusModel(userId));
    }

    /**
     * 心跳接口
     *
     * @return
     */
    @RequestMapping("/heartBeat")
    @ResponseBody
    public WebMessage heartBeat() {
        System.out.println(LogUtils.getLogStart("INFO"));
        return WebMessage.success();
    }

}