package nbm.cash.admin.modular.service;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.request.PlanPost;

public interface PlanService {

    /**
     * 方案列表
     * @param post
     * @return
     */
    public WebMessage query(PlanPost post);

    public WebMessage update(PlanPost post);

}
