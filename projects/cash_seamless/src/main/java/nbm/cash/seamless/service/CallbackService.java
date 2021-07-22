package nbm.cash.seamless.service;

import nbm.cash.seamless.request.integral.IntegralModel;
import nbm.cash.seamless.utils.http.WebMessage;

public interface CallbackService {

    WebMessage firstDepositIntegra(IntegralModel model);
}
