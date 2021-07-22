package nbm.cash.admin.modular.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "role")
public class RoleEntity {

    private String _id;

    /**
     * 名称(中文显示)
     */
    private String roleName;

    /**
     * 英文匹配用
     */
    private String name;

    private List<RoleResource> roleResource;

    private Integer state = 1;

    private String note;

    private Long createTime;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<RoleResource> getRoleResource() {
        return roleResource;
    }

    public void setRoleResource(List<RoleResource> roleResource) {
        this.roleResource = roleResource;
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

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
}