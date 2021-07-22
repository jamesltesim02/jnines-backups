package nbm.cash.admin.modular.controller;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.common.utils.token.JwtUtil;
import nbm.cash.admin.modular.request.notice.AddNoticePost;
import nbm.cash.admin.modular.request.notice.NoticeQuery;
import nbm.cash.admin.modular.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description 公告接口
 * @ClassName NoticeController
 * @Author New
 * @Date 2019/12/15 16:22
 * @Version V1.0
 **/
@RestController
@RequestMapping("/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    //String userId,Integer type,Integer state, Integer pageIndex, Integer pageSize

    @RequestMapping("/getNoticeList")
    @ResponseBody
    public WebMessage getNoticeList(NoticeQuery model) {
            return noticeService.findNoticeList(model);
    }

    @RequestMapping("/addNotice")
    @ResponseBody
    public WebMessage addNotice(@RequestBody AddNoticePost post, HttpServletRequest request){
        String token = request.getHeader("Authorization");
        post.setUserId(JwtUtil.sign(JwtUtil.getUserId(token)));
        return noticeService.addNotice(post);
    }

    @RequestMapping("/delNotice")
    @ResponseBody
    public WebMessage delNoticeList(String id){
        return noticeService.delNoticeList(id);
    }

    @RequestMapping("/updateNotice")
    @ResponseBody
    public WebMessage updateNotice(@RequestBody AddNoticePost post){
        return noticeService.updateNotice(post);
    }
}