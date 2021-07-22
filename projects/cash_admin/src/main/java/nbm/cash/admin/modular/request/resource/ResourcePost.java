package nbm.cash.admin.modular.request.resource;

/**
 * @Description
 * @ClassName ResourcePost
 * @Author New
 * @Date 2019/12/27 11:34
 * @Version V1.0
 **/
public class ResourcePost {

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
    private String parentId;

    /**
     * 排序用
     */
    private Integer resourceNo;

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
}
