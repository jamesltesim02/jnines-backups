package nbm.cash.admin.modular.request.hotnews;

/**
 * 新增新闻
 */
public class HotNewsPost {

    private String _id;

    private String title;

    private String content;

    private String thumbnail;

    private String url;

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

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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