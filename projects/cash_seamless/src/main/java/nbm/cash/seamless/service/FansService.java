package nbm.cash.seamless.service;

import nbm.cash.seamless.request.fans.FocusModel;
import nbm.cash.seamless.request.fans.FocusOnModel;
import nbm.cash.seamless.utils.http.WebMessage;

/**
 * @Description 粉丝服务接口
 * @ClassName FansService
 * @Author New
 * @Date 2019/11/15 13:54
 * @Version V1.0
 **/
public interface FansService {

    /**
     * 查询我的关注列表
     *
     * @param model
     * @return
     */
    public WebMessage myFocusList(FocusModel model);

    /**
     * 查询我的粉丝列表
     *
     * @param model
     * @return
     */
    public WebMessage myFansList(FocusModel model);

    /**
     * 关注
     *
     * @param model
     * @return
     */
    public WebMessage focusOnSomeOne(FocusOnModel model);

    /**
     * 取消关注
     *
     * @param model
     * @return
     */
    public WebMessage cancelFocus(FocusOnModel model);

    /**
     * 统计我的关注和我的粉丝数
     *
     * @param model
     * @return
     */
    public WebMessage fansAndFocusCount(FocusModel model);
}