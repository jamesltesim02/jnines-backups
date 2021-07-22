package nbm.cash.admin.modular.request.resource;

import nbm.cash.admin.common.BasePost;

/**
 * @Description
 * @ClassName ResourceQuery
 * @Author New
 * @Date 2019/12/26 16:34
 * @Version V1.0
 **/
public class ResourceQuery extends BasePost {

    private String resourceName;

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }
}