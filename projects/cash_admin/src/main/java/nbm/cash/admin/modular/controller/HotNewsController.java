package nbm.cash.admin.modular.controller;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.entity.HotNewsEntity;
import nbm.cash.admin.modular.request.hotnews.HotNewsPost;
import nbm.cash.admin.modular.request.hotnews.HotNewsQuery;
import nbm.cash.admin.modular.service.HotNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hotNews")
public class HotNewsController {

    @Autowired
    private HotNewsService hotNewsService;

    @RequestMapping("/getHotNewsList")
    @ResponseBody
    public WebMessage getHotNewsList(HotNewsQuery model){
        return hotNewsService.getHotNewsList(model);
    }

    @RequestMapping("/addHotNews")
    @ResponseBody
    public WebMessage addHotNews(HotNewsPost model){
        return hotNewsService.addHotNews(new HotNewsEntity(model));
    }

    @RequestMapping("/delHotNews")
    @ResponseBody
    public WebMessage delHotNews(String id){
        return hotNewsService.delHotNews(id);
    }

    @RequestMapping("/updateHotNews")
    @ResponseBody
    public WebMessage updateHotNews(HotNewsPost model){
        return hotNewsService.updateHotNews(model);
    }

}