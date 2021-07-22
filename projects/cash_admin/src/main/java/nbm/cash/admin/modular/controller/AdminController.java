package nbm.cash.admin.modular.controller;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.entity.AdminUser;
import nbm.cash.admin.modular.request.admin.AdminPost;
import nbm.cash.admin.modular.request.admin.AdminQuery;
import nbm.cash.admin.modular.request.admin.SetAdminRolePost;
import nbm.cash.admin.modular.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @RequestMapping("/getAdminList")
    @ResponseBody
    public WebMessage getAdminList(AdminQuery model){
        return adminService.getAdminList(model);
    }

    @RequestMapping("/addAdminUser")
    @ResponseBody
    public WebMessage addAdminUser(@RequestBody AdminPost model){
        return adminService.addAdminUser(new AdminUser(model));
    }

    @RequestMapping("/delAdmin")
    @ResponseBody
    public WebMessage delAdmin(String id){
        return adminService.delAdmin(id);
    }

    @RequestMapping("/updateAdmin")
    @ResponseBody
    public WebMessage updateAdmin(@RequestBody AdminPost model){
        return  adminService.updateAdmin(model);
    }

}