package nbm.cash.admin.modular.request.ware;

import nbm.cash.admin.modular.entity.WareColor;
import nbm.cash.admin.modular.request.UserIdPost;

import java.util.List;

/**
 * 新增修改商品通用参数
 */
public class AddWarePost extends UserIdPost {

    private String _id;

    private String wareName;

    private String photo;

    private Integer type;

    private Integer inventory;

    private Integer needIntegral;

    private List<WareColor>  wareColor;

    private List<String> size;

    private Long validStart;

    private Long validEnd;

    private Long createTime;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getWareName() {
        return wareName;
    }

    public void setWareName(String wareName) {
        this.wareName = wareName;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getInventory() {
        return inventory;
    }

    public void setInventory(Integer inventory) {
        this.inventory = inventory;
    }

    public Integer getNeedIntegral() {
        return needIntegral;
    }

    public void setNeedIntegral(Integer needIntegral) {
        this.needIntegral = needIntegral;
    }

    public List<WareColor> getWareColor() {
        return wareColor;
    }

    public void setWareColor(List<WareColor> wareColor) {
        this.wareColor = wareColor;
    }

    public List<String> getSize() {
        return size;
    }

    public void setSize(List<String> size) {
        this.size = size;
    }

    public Long getValidStart() {
        return validStart;
    }

    public void setValidStart(Long validStart) {
        this.validStart = validStart;
    }

    public Long getValidEnd() {
        return validEnd;
    }

    public void setValidEnd(Long validEnd) {
        this.validEnd = validEnd;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
}