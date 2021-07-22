package nbm.cash.seamless.utils.http;


import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * @Description
 * @ClassName SimpleHttpHelper
 * @Author New
 * @Date 2019/11/8 16:00
 * @Version V1.0
 **/
public class SimpleHttpHelper {

    protected static final Logger log = LogManager.getLogger(SimpleHttpHelper.class);
    private static int total = 1; // 尝试次数

    public static String pushPostURL(String url, String postBody, HttpServletRequest request) {
        log.error(url + ":" + postBody);
        String rst = "";
        for (int i = 1; i <= total; i++) {
            try {
                if (url.startsWith("https")) {
                    rst = HttpsUtils.post(url, postBody, request);
                } else {
                    rst = SimpleHttpHelper.postURL(url, postBody);
                }
                log.error(rst);
            } catch (ClientProtocolException e) {
                log.error("第" + i + "次请求url::" + url + "失败,参数::" + postBody, e);
            } catch (IOException e) {
                log.error("第" + i + "次请求url::" + url + "失败,参数::" + postBody, e);
            } catch (Exception e) {
                log.error("第" + i + "次请求url::" + url + "失败,参数::" + postBody, e);
            }
        }

        return rst;
    }

    public static String pushGetURL(String url) {
        CloseableHttpClient httpCilent = HttpClients.createDefault();
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(5000)   //设置连接超时时间
                .setConnectionRequestTimeout(5000) // 设置请求超时时间
                .setSocketTimeout(5000)
                .setRedirectsEnabled(true)//默认允许自动重定向
                .build();
        HttpGet httpGet = new HttpGet(url);
        httpGet.setConfig(requestConfig);
        String srtResult = "";
        HttpResponse httpResponse;
        try {
            httpResponse = httpCilent.execute(httpGet);
            if (httpResponse.getStatusLine().getStatusCode() == 200) {
                srtResult = EntityUtils.toString(httpResponse.getEntity());//获得返回的结果
                System.out.println(srtResult);
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                httpCilent.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return srtResult;
    }

    public static String postURL(String url, String postBody) throws ClientProtocolException, IOException {
        //解决Cookie rejected
        RequestConfig globalConfig = RequestConfig.custom().setCookieSpec(CookieSpecs.IGNORE_COOKIES).build();
        CloseableHttpClient httpClient = HttpClients.custom().setDefaultRequestConfig(globalConfig).build();
        HttpPost request = new HttpPost(url);
        request.setHeader("Content-Type", "application/json");
        HttpEntity entity = new StringEntity(postBody, "utf-8");
        request.setEntity(entity);
        HttpResponse response = httpClient.execute(request);
        return EntityUtils.toString(response.getEntity());
    }
}