package nbm.cash.admin.modular.controller;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.request.role.RoleQuery;
import nbm.cash.admin.modular.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @RequestMapping("/getRoleList")
    @ResponseBody
    public WebMessage getRoleList(RoleQuery model){
        return roleService.getRoleList(model);
    }

    @RequestMapping("/delRole")
    @ResponseBody
    public WebMessage delRole(String id){

        return null;
    }
}