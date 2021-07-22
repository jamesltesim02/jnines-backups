package nbm.cash.seamless.service;

import nbm.cash.seamless.request.notice.InfoModel;
import nbm.cash.seamless.request.notice.NoticeReadPost;
import nbm.cash.seamless.utils.http.WebMessage;

/**
 * @Description 公告、新闻、消息相关接口
 * @ClassName Informservice
 * @Author New
 * @Date 2019/11/21 11:27
 * @Version V1.0
 **/
public interface InformService {

    /**
     * 获取公告列表
     *
     * @param model
     * @return
     */
    public WebMessage getNoticeList(InfoModel model);

    /**
     * 根据ID查找公告详情
     *
     * @param model
     * @return
     */
    public WebMessage getNoticeById(InfoModel model);

    /**
     * 批量设置公告、私信已阅读
     * @param model
     * @return
     */
    public WebMessage setNoticeRead(NoticeReadPost model);

    /**
     * 获取新闻列表
     *
     * @param model
     * @return
     */
    public WebMessage getHotNewsList(InfoModel model);

    /**
     * 获取新闻详情
     *
     * @param model
     * @return
     */
    public WebMessage findHotNewsById(InfoModel model);

    /**
     * 获取Banner
     *
     * @param model
     * @return
     */
    public WebMessage findBannerList(InfoModel model);
}