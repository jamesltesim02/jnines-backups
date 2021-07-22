package nbm.cash.seamless.request.notice;

import java.util.List;

/**
 * @Description 批量设置公告、私信已阅读参数
 * @ClassName NoticeReadPost
 * @Author New
 * @Date 2019/12/10 17:48
 * @Version V1.0
 **/
public class NoticeReadPost extends InfoModel {

    /**
     * 公告ID集合
     */
    private List<String> infoIdList;

    public List<String> getInfoIdList() {
        return infoIdList;
    }

    public void setInfoIdList(List<String> infoIdList) {
        this.infoIdList = infoIdList;
    }
}