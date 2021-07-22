package nbm.cash.admin.common.utils.other;

/**
 * @Description
 * @ClassName StringUtil
 * @Author New
 * @Date 2019/12/13 16:29
 * @Version V1.0
 **/
public class StringUtil {

    /**
     * 判断字符串是否为空
     * @param str
     * @return
     */
    public static boolean isEmpty(String str){
        if(str != null && str.trim().length() > 0){
            return false;
        }
        return true;
    }
}