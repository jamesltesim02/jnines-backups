package nbm.cash.admin.modular.service;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.request.BetPost;

public interface BetService {

    public WebMessage query(BetPost post);

}
