package nbm.cash.seamless.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import nbm.cash.seamless.constant.Constant;
import nbm.cash.seamless.request.ScoreModel;
import nbm.cash.seamless.response.Score;
import nbm.cash.seamless.service.MatchService;
import nbm.cash.seamless.utils.http.RespCodeEnum;
import nbm.cash.seamless.utils.http.SimpleHttpHelper;
import nbm.cash.seamless.utils.http.WebMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Description
 * @ClassName MatchServiceImpl
 * @Author New
 * @Date 2019/12/2 17:58
 * @Version V1.0
 **/
@Service("matchService")
public class MatchServiceImpl implements MatchService {

    protected static final Logger logger = LogManager.getLogger(MatchServiceImpl.class);

    @Resource
    Constant constant;

    @Override
    public WebMessage findMatchScore(ScoreModel model) {
        try {
            String rsp = SimpleHttpHelper.postURL(constant.getMatchScore(), JSONObject.toJSONString(model));
            if (rsp != null && rsp.length() > 0) {
                JSONObject rspJson = JSONObject.parseObject(rsp);
                if (rspJson.getIntValue("code") == 200) {
                    List<Score> scoreList = JSON.parseArray(rspJson.getString("data"), Score.class);
                    return WebMessage.success(scoreList);
                } else {
                    return WebMessage.construct(RespCodeEnum.DATA_NOT_EXIST);
                }
            } else {
                return WebMessage.construct(RespCodeEnum.DATA_NOT_EXIST);
            }
        } catch (Exception e) {
            return WebMessage.error();
        }
    }
}