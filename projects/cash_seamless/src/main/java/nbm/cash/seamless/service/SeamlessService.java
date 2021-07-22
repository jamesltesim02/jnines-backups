package nbm.cash.seamless.service;

import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.entity.BetEntity;
import nbm.cash.seamless.request.*;
import nbm.cash.seamless.request.plan.FellowModel;
import org.springframework.web.bind.annotation.RequestBody;
import java.io.IOException;

public interface SeamlessService {
    JSONObject getBalance(String token);

    JSONObject doBet(OrderPost post) ;

    JSONObject doSettle(@RequestBody SettleModel model) throws Exception;

    JSONObject cancelBet(@RequestBody CancelModel model) throws Exception;

    JSONObject queryBet(@RequestBody TicketStateModel model) throws IOException;

    BetEntity saveBet(BetEntity bet);

    JSONObject settleBet(@RequestBody SettleFollowTicketModel model) throws IOException;

    JSONObject cancelFollowBet(CancelModel model) throws IOException;

    JSONObject followPlan(OrderPost post);

    JSONObject test(SettleModel model) throws IOException;

    long UpdateBetState(JSONObject ob);

}
