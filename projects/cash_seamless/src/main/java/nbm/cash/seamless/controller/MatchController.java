package nbm.cash.seamless.controller;

import nbm.cash.seamless.request.ScoreModel;
import nbm.cash.seamless.service.MatchService;
import nbm.cash.seamless.utils.http.WebMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description 比赛相关
 * @ClassName MatchController
 * @Author New
 * @Date 2019/12/2 17:41
 * @Version V1.0
 **/
@RequestMapping("/match")
@RestController
public class MatchController {

    @Autowired
    private MatchService matchService;

    /**
     * @param lang
     * @param matchDay
     * @param sportIds
     * @return
     */
    @RequestMapping(value = "/getMatchScore")
    @ResponseBody
    public WebMessage getMatchScore(Integer lang, Integer matchDay, Integer[] sportIds) {
        return matchService.findMatchScore(new ScoreModel(lang, matchDay, sportIds));
    }
}