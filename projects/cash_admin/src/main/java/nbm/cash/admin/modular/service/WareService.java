package nbm.cash.admin.modular.service;

import nbm.cash.admin.common.utils.http.WebMessage;
import nbm.cash.admin.modular.request.ware.AddWarePost;
import nbm.cash.admin.modular.request.ware.WarePost;

public interface WareService {

    public WebMessage getWareList(WarePost model);

    public WebMessage addWare(AddWarePost model);

    public WebMessage updateWare(AddWarePost model);

    public WebMessage delWareById(String id);

    public WebMessage updateInventory(String id, Integer inventory);
}