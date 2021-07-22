package nbm.cash.seamless.service;

import nbm.cash.seamless.request.ScoreModel;
import nbm.cash.seamless.utils.http.WebMessage;

/**
 * @Description 比赛服务类
 * @ClassName MatchService
 * @Author New
 * @Date 2019/12/2 17:56
 * @Version V1.0
 **/
public interface MatchService {

    /**
     * 获取赛果
     *
     * @param model
     * @return
     */
    public WebMessage findMatchScore(ScoreModel model);
}