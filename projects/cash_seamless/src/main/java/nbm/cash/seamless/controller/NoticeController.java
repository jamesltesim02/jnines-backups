package nbm.cash.seamless.controller;

import nbm.cash.seamless.request.notice.InfoModel;
import nbm.cash.seamless.request.notice.NoticeReadPost;
import nbm.cash.seamless.service.InformService;
import nbm.cash.seamless.utils.http.WebMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description 公告、新闻相关
 * @ClassName NoticeController
 * @Author New
 * @Date 2019/11/21 10:06
 * @Version V1.0
 **/
@RestController
@RequestMapping("/info")
public class NoticeController extends BaseController{

    @Autowired
    private InformService informService;

    /**
     * 查询公告列表
     *
     * @param pageSize
     * @param pageIndex
     * @return
     */
    @RequestMapping("/findNoticeList")
    @ResponseBody
    public WebMessage getNoticeList(Integer pageSize, Integer pageIndex, HttpServletRequest request) {
        return informService.getNoticeList(new InfoModel(pageSize, pageIndex, tokenToUser(request)));
    }

    /**
     * 根据ID查询公告详情
     *
     * @param id
     * @return
     */
    @RequestMapping("/findNoticeById")
    @ResponseBody
    public WebMessage getNoticeById(String id, HttpServletRequest request) {
        return informService.getNoticeById(new InfoModel(id, tokenToUser(request)));
    }

    /**
     * 批量设置公告、私信已阅读
     * @param model
     * @return
     */
    @RequestMapping("/setReadNotice")
    @ResponseBody
    public WebMessage setNoticeRead(@RequestBody NoticeReadPost model){
        return informService.setNoticeRead(model);
    }

    /**
     * 查询热门新闻列表
     *
     * @param pageSize
     * @param pageIndex
     * @return
     */
    @RequestMapping("/findHotNewsList")
    @ResponseBody
    public WebMessage getHotNewsList(Integer pageSize, Integer pageIndex) {
        return informService.getHotNewsList(new InfoModel(pageSize, pageIndex));
    }

    /**
     * 根据ID查询新闻详情
     *
     * @param id
     * @return
     */
    @RequestMapping("/findHotNewsById")
    @ResponseBody
    public WebMessage findHotNewsById(String id) {
        return informService.findHotNewsById(new InfoModel(id));
    }

    /**
     * 查询banner列表
     *
     * @param pageSize
     * @param pageIndex
     * @return
     */
    @RequestMapping("/findBannerList")
    @ResponseBody
    public WebMessage findBannerList(Integer pageSize, Integer pageIndex) {
        return informService.findBannerList(new InfoModel(pageSize, pageIndex));
    }

}