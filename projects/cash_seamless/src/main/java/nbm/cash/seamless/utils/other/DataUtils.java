package nbm.cash.seamless.utils.other;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;

/**
 * @Description 数据处理类
 * @ClassName DataUtils
 * @Author New
 * @Date 2019/11/19 14:45
 * @Version V1.0
 **/
public class DataUtils {

    private static DecimalFormat df = new DecimalFormat("0.0000");//格式化小数

    /**
     * 整数相除，保留4位小数
     *
     * @param divisorOne
     * @param divisorTwo
     * @return
     */
    public static double except(Integer divisorOne, Integer divisorTwo) {
        if (divisorTwo == 0) {
            return 0.0;
        }

        String num = df.format((float) divisorOne / divisorTwo);
        return Double.valueOf(num);
    }

    /**
     * BigDecimal相除，保留4位小数
     *
     * @param divisorOne
     * @param divisorTwo
     * @return
     */
    public static double except(BigDecimal divisorOne, BigDecimal divisorTwo) {
        if (divisorOne.compareTo(BigDecimal.ZERO) > 0) {
            if (divisorTwo.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal num = divisorOne.divide(divisorTwo, 4, RoundingMode.UP);
                return num.doubleValue();
            }
        }
        return 0.0;
    }
}