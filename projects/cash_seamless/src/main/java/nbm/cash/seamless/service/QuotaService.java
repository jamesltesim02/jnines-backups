package nbm.cash.seamless.service;

import nbm.cash.seamless.utils.http.WebMessage;

/**
 * @Description
 * @ClassName QuotaService
 * @Author New
 * @Date 2019/12/19 11:11
 * @Version V1.0
 **/
public interface QuotaService {

    /**
     * 获取跟单限额
     * @param num
     * @return
     */
    public WebMessage findFollowQuota(Integer num);
}