package nbm.cash.seamless.utils.other;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * @Description 时间格式化工具
 * @ClassName DateUtils
 * @Author New
 * @Date 2019/11/13 13:45
 * @Version V1.0
 **/
public class DateUtils {

    public static Calendar CAL = Calendar.getInstance();

    public static DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    /**
     * 获取本周最小毫秒数
     *
     * @param date
     * @return
     */
    public static Long getWeekLong(Date date) {
        CAL.setTime(date);
        CAL.set(Calendar.DAY_OF_WEEK, 2);
        CAL.set(Calendar.HOUR_OF_DAY, 0);
        CAL.set(Calendar.MINUTE, 0);
        CAL.set(Calendar.SECOND, 0);
        CAL.set(Calendar.SECOND, 0);
        return CAL.getTime().getTime();
    }

    /**
     * 获取本月最小毫秒数
     *
     * @param date
     * @return
     */
    public static Long getMonthLong(Date date) {
        CAL.setTime(date);
        CAL.set(Calendar.DAY_OF_MONTH, 1);
        CAL.set(Calendar.HOUR_OF_DAY, 0);
        CAL.set(Calendar.MINUTE, 0);
        CAL.set(Calendar.SECOND, 0);
        CAL.set(Calendar.SECOND, 0);
        return CAL.getTime().getTime();
    }

    /**
     * 获取完整日期格式
     *
     * @param date
     * @return yyyy-MM-dd HH:mm:ss
     */
    public static String getFullDate(Date date) {
        return df.format(date);
    }

    public static void main(String[] args) {
        System.out.println(new Date().getTime());
    }

}