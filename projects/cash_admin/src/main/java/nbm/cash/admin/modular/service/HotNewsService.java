package nbm.cash.admin.modular.service;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.entity.HotNewsEntity;
import nbm.cash.admin.modular.request.hotnews.HotNewsPost;
import nbm.cash.admin.modular.request.hotnews.HotNewsQuery;

public interface HotNewsService {

    public WebMessage getHotNewsList(HotNewsQuery model);

    public WebMessage addHotNews(HotNewsEntity model);

    public WebMessage updateHotNews(HotNewsPost model);

    public WebMessage delHotNews(String id);
}
