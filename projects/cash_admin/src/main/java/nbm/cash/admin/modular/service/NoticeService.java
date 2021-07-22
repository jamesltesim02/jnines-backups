package nbm.cash.admin.modular.service;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.request.notice.AddNoticePost;
import nbm.cash.admin.modular.request.notice.NoticeQuery;

/**
 * @Description 公告
 * @ClassName NoticeService
 * @Author New
 * @Date 2019/12/15 16:31
 * @Version V1.0
 **/
public interface NoticeService {

    /**
     * 获取公告列表
     * @param model
     * @return
     */
    public WebMessage findNoticeList(NoticeQuery model);

    /**
     * 新增公告
     * @param post
     * @return
     */
    public WebMessage addNotice(AddNoticePost post);

    /**
     * 删除
     * @param id
     * @return
     */
    public WebMessage delNoticeList(String id);

    /**
     * 修改公告
     * @param post
     * @return
     */
    public WebMessage updateNotice(AddNoticePost post);
}