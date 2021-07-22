package nbm.cash.seamless.sys.exception;

import com.alibaba.fastjson.JSON;
import nbm.cash.seamless.utils.http.RespCodeEnum;
import nbm.cash.seamless.utils.http.WebMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * @Description 全局异常处理
 * @ClassName CommonExceptionAdvice
 * @Author New
 * @Date 2019/11/21 12:05
 * @Version V1.0
 **/
@ControllerAdvice
public class CommonExceptionAdvice {

    protected static final Logger logger = LogManager.getLogger(CommonExceptionAdvice.class);

    @ResponseBody
    @ExceptionHandler(value = Exception.class)
    public WebMessage errorHandler(HttpServletRequest request, Exception ex) {
        logger.info("参数：" + JSON.toJSONString(request.getParameterMap()) + "; Exception:", ex);
        return WebMessage.construct(RespCodeEnum.ERROR);
    }
}