package nbm.cash.admin.modular.entity;

import nbm.cash.admin.modular.request.resource.ResourcePost;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * 资源表
 */
@Document(collection = "role_resource")
public class RoleResource {

    public RoleResource(){

    }

    public RoleResource(ResourcePost model) {
        this._id = model.get_id();
        this.resourceName = model.getResourceName();
        this.name = model.getName();
        this.path = model.getPath();
        this.parentId = model.getParentId() == null ? "root":model.getParentId();
        this.resourceNo = model.getResourceNo();
    }

    private String _id;

    /**
     * 名称(中文显示)
     */
    private String resourceName;

    /**
     * 英文匹配用
     */
    private String name;

    /**
     * 路径
     */
    private String path;

    /**
     * 父节点
     */
    private String parentId = "root";

    private String parentRootName = "根节点";

    /**
     * 排序用
     */
    private Integer resourceNo;

    /**
     * 创建时间
     */
    private Long createTime;

    /**
     * 状态
     */
    private Integer state;

    /**
     * 下一级资源
     */
    @Transient
    private List<RoleResource> nextResourceList;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public Integer getResourceNo() {
        return resourceNo;
    }

    public void setResourceNo(Integer resourceNo) {
        this.resourceNo = resourceNo;
    }

    public String getParentRootName() {
        return parentRootName;
    }

    public void setParentRootName(String parentRootName) {
        this.parentRootName = parentRootName;
    }

    public List<RoleResource> getNextResourceList() {
        return nextResourceList;
    }

    public void setNextResourceList(List<RoleResource> nextResourceList) {
        this.nextResourceList = nextResourceList;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }
}