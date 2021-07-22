package nbm.cash.admin.modular.request.role;

/**
 * @Description
 * @ClassName RolePost
 * @Author New
 * @Date 2019/12/26 14:41
 * @Version V1.0
 **/
public class RolePost {

    private String _id;

    private String roleName;

    private String note;

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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
