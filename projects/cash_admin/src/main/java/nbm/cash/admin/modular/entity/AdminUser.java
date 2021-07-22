package nbm.cash.admin.modular.entity;

import nbm.cash.admin.common.utils.other.MD5Util;
import nbm.cash.admin.modular.request.admin.AdminPost;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

/**
 * @Description
 * @ClassName AdminUser
 * @Author New
 * @Date 2019/12/13 10:53
 * @Version V1.0
 **/
@Document(collection = "admin_user")
public class AdminUser {

    private String _id;

    private String userName;

    private String passWord;

    private String roleId;

    private String roleName;

    private String phone;

    private String header;

    private Integer state = 1;

    private String note;

    @Transient
    private String token;

    private Long createTime;

    public AdminUser(){

    }

    public AdminUser(AdminPost model){
        this.userName = model.getUserName();
        this.passWord = MD5Util.getMD5(model.getPassWord());
        this.header = model.getHeader();
        this.phone = model.getPhone();
        this.note = model.getNote();
        this.createTime = System.currentTimeMillis();
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassWord() {
        return passWord;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
}