package nbm.cash.seamless.utils.other;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * @Description 生成18位唯一ID
 * @ClassName UUIDUtils
 * @Author New
 * @Date 2019/11/18 11:18
 * @Version V1.0
 **/
public class UUIDUtils {

    public static AtomicInteger counter = new AtomicInteger(0);

    public static long andGer() {
        return counter.incrementAndGet();
    }

    public static long getLongUID() {
        if (counter.get() > 99999) {
            counter.set(1);
        }
        long time = System.currentTimeMillis();
        return time * 100000 + andGer();
    }

   /* public static void main(String[] args){
        System.out.println(System.currentTimeMillis());
    }*/
}