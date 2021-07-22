package nbm.cash.admin.modular.controller;

import nbm.cash.admin.common.utils.http.UserUtil;
import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.request.ware.AddWarePost;
import nbm.cash.admin.modular.request.ware.WarePost;
import nbm.cash.admin.modular.service.WareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/ware")
public class WareController {

    @Autowired
    private WareService wareService;

    /**
     * 获取商品列表
     * @param model
     * @return
     */
    @RequestMapping("/getWareList")
    @ResponseBody
    public WebMessage getWareList(WarePost model){
        return wareService.getWareList(model);
    }

    /**
     * 新增商品
     * @param model
     * @param request
     * @return
     */
    @RequestMapping("/addWare")
    @ResponseBody
    public WebMessage addWare(@RequestBody AddWarePost model, HttpServletRequest request){
        model.setUserId(UserUtil.getUserId(request));
        return wareService.addWare(model);
    }

    @RequestMapping("/updateWare")
    @ResponseBody
    public WebMessage updateWare(@RequestBody AddWarePost model, HttpServletRequest request) {
        model.setUserId(UserUtil.getUserId(request));
        return wareService.updateWare(model);
    }

    /**
     * 下架商品
     * @param id
     * @return
     */
    @RequestMapping("/delWare")
    @ResponseBody
    public WebMessage delWare(String id){
        return wareService.delWareById(id);
    }

    /**
     * 修改商品库存
     * @param id
     * @param num
     * @return
     */
    @RequestMapping("/updateInventory")
    @ResponseBody
    public WebMessage updateInventory(String id, Integer num) {
        return wareService.updateInventory(id, num);
    }
}