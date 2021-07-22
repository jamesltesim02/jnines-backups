package nbm.cash.seamless.controller;

import nbm.cash.seamless.request.ranking.RanKingModel;
import nbm.cash.seamless.service.RankingService;
import nbm.cash.seamless.utils.http.WebMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/ranking")
public class RankingController {

    @Autowired
    private RankingService rankingService;

    /**
     * 盈利榜
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/profitRanking")
    public WebMessage profitRanking(String timeRange, int pageSize, int pageIndex) {
        return rankingService.QueryProfitRanking(new RanKingModel(timeRange, pageSize, pageIndex));
    }

    /**
     * ，命中榜
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/betRateRanking")
    public WebMessage betRateRanking(String timeRange, int pageSize, int pageIndex) {
        return rankingService.QueryBetRateRanking(new RanKingModel(timeRange, pageSize, pageIndex));
    }

    /**
     * ，连红榜
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/hitRanking")
    public WebMessage hitRanking(String timeRange, int pageSize, int pageIndex) {
        return rankingService.QueryHitRanking(new RanKingModel(timeRange, pageSize, pageIndex));
    }


    /**
     * ，带红榜
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/redRanking")
    public WebMessage redRanking(String timeRange, int pageSize, int pageIndex) {
        return rankingService.QueryRedRanking(new RanKingModel(timeRange, pageSize, pageIndex));
    }

}
