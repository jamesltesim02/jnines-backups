package nbm.cash.seamless;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * @program: cash_seamless
 * @description: test
 * @author: Mr.Nat
 * @create: 2019-11-29 15:59
 **/
public class test {

    public static void main(String[] args) {


            Calendar calendar = Calendar.getInstance();
            long createTime = calendar.getTimeInMillis();
            System.out.println(createTime);   //1541235267116
            SimpleDateFormat form1 = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss");
            String res = form1.format(createTime);
            System.out.println(res);  //2018-11-03 16-54-27

            calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) + 7);
            System.out.println(calendar.getTimeInMillis()+"///////////////////////////////////");   //1541840067116

            Date today = calendar.getTime();
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss");
            String result = format.format(today);
            System.out.println(result);  //2018-11-10 16-54-27


    }

}
