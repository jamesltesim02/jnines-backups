package nbm.cash.seamless.utils.other;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.Date;

/**
 * @Description 日志工具类
 * @ClassName LogUtils
 * @Author New
 * @Date 2019/11/27 16:29
 * @Version V1.0
 **/
@Configuration
public class LogUtils {

    private static String SYSTEM_NAME;

    private static String MACHINE_NUM;

    @Value("${log.system.name}")
    public void setSYSTEM_NAME(String SYSTEM_NAME) {
        this.SYSTEM_NAME = SYSTEM_NAME;
    }

    @Value("${log.machine.num}")
    public void setMACHINE_NUM(String MACHINE_NUM) {
        this.MACHINE_NUM = MACHINE_NUM;
    }

    public static String getLogStart(String level) {
        return DateUtils.getFullDate(new Date()) + " " + level + " " + SYSTEM_NAME + "-" + MACHINE_NUM;
    }
}