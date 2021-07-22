package nbm.cash.admin.common.utils.other;

import org.springframework.util.DigestUtils;

/**
 * @Description 密码加密
 * @ClassName MD5Util
 * @Author New
 * @Date 2019/12/15 14:17
 * @Version V1.0
 **/
public class MD5Util {

    private static final String slat = "&%5123***&&%%$$#@";

    public static String getMD5(String str) {
        String base = str + "/" + slat;
        String md5 = DigestUtils.md5DigestAsHex(base.getBytes());
        return md5;
    }
}