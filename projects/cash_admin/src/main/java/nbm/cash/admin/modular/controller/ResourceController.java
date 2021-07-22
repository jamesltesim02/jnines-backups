package nbm.cash.admin.modular.controller;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.entity.RoleResource;
import nbm.cash.admin.modular.request.resource.ResourcePost;
import nbm.cash.admin.modular.request.resource.ResourceQuery;
import nbm.cash.admin.modular.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description
 * @ClassName ResourceController
 * @Author New
 * @Date 2019/12/26 16:26
 * @Version V1.0
 **/
@RestController
@RequestMapping("/resource")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @RequestMapping("/getResourceList")
    @ResponseBody
    public WebMessage getResourceList(ResourceQuery model){
        return resourceService.getResourceList(model);
    }

    @RequestMapping("/addResource")
    @ResponseBody
    public WebMessage addResource(@RequestBody ResourcePost model){
        return resourceService.addResource(new RoleResource(model));
    }

    @RequestMapping("/updateResource")
    @ResponseBody
    public WebMessage updateResource(@RequestBody ResourcePost model) {
        return resourceService.updateResource(model);
    }

}