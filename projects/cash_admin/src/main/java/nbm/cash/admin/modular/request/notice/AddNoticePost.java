package nbm.cash.admin.modular.request.notice;

import nbm.cash.admin.common.BasePost;

/**
 * @Description 新增、修改公告接口参数
 * @ClassName NoticePost
 * @Author New
 * @Date 2019/12/15 16:46
 * @Version V1.0
 **/
public class AddNoticePost extends BasePost{

    /**
     * 修改时必传，唯一标识
     */
    private String _id;

    private String title;

    private String content;

    private Integer type;

    private Long validStart;

    private Long validEnd;

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
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
}