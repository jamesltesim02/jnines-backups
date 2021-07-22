package nbm.cash.seamless.service;

import nbm.cash.seamless.request.ranking.RanKingModel;
import nbm.cash.seamless.utils.http.WebMessage;

public interface RankingService {

    public WebMessage QueryProfitRanking(RanKingModel model);

    public WebMessage QueryBetRateRanking(RanKingModel model);

    public WebMessage QueryHitRanking(RanKingModel model);

    public WebMessage QueryRedRanking(RanKingModel model);
}
