package nbm.cash.seamless.utils.http;


import org.apache.http.*;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

/**
 * @Description
 * @ClassName HttpsUtils
 * @Author New
 * @Date 2019/11/8 16:02
 * @Version V1.0
 **/

public class HttpsUtils {

    private static final String HTTP = "http";
    private static final String HTTPS = "https";
    private static SSLConnectionSocketFactory sslsf = null;
    private static PoolingHttpClientConnectionManager cm = null;
    private static SSLContextBuilder builder = null;

    static {
        try {
            builder = new SSLContextBuilder();
            // 全部信任 不做身份鉴定
            builder.loadTrustMaterial(null, new TrustStrategy() {
                @Override
                public boolean isTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {
                    return true;
                }
            });
            sslsf = new SSLConnectionSocketFactory(builder.build(), new String[]{"SSLv2Hello", "SSLv3", "TLSv1", "TLSv1.2"}, null, NoopHostnameVerifier.INSTANCE);
            Registry<ConnectionSocketFactory> registry = RegistryBuilder.<ConnectionSocketFactory>create()
                    .register(HTTP, new PlainConnectionSocketFactory()).register(HTTPS, sslsf).build();
            cm = new PoolingHttpClientConnectionManager(registry);
            cm.setMaxTotal(200); // max connection
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * httpClient post请求
     *
     * @param url      请求url
     * @param postBody 请求实体 json/xml提交适用
     * @return 可能为空 需要处理
     * @throws Exception
     */
    public static String post(String url, String postBody, HttpServletRequest request) throws Exception {
        String result = null;
        HttpResponse httpResponse = null;
        CloseableHttpClient httpClient = null;
        try {
            httpClient = getHttpClient();
            HttpPost httpPost = new HttpPost(url);
            // 设置头信息
            httpPost.setHeader("Content-Type", "application/json");

            if (request != null) {
                httpPost.setHeader("Referer", request.getHeader("Referer"));
                httpPost.setHeader("Origin", request.getHeader("Origin"));
            }

            if (postBody != null && postBody.length() > 0) {
                HttpEntity entity = new StringEntity(postBody, "utf-8");
                httpPost.setEntity(entity);
            }
            httpResponse = httpClient.execute(httpPost);

            int statusCode = httpResponse.getStatusLine().getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                HttpEntity resEntity = httpResponse.getEntity();
                result = EntityUtils.toString(resEntity);
            } else {
                return readHttpResponse(httpResponse);
            }
        } catch (Exception e) {
            throw e;
        } finally {
            if (httpClient != null) {
                httpClient.close();
            }
        }
        return result;
    }

    public static CloseableHttpClient getHttpClient() throws Exception {
        CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(sslsf).setConnectionManager(cm)
                .setConnectionManagerShared(true).build();
        return httpClient;
    }

    public static String readHttpResponse(HttpResponse httpResponse) throws ParseException, IOException {
        StringBuilder builder = new StringBuilder();
        // 获取响应消息实体
        HttpEntity entity = httpResponse.getEntity();
        // 响应状态
        builder.append("status:" + httpResponse.getStatusLine());
        builder.append("headers:");
        HeaderIterator iterator = httpResponse.headerIterator();
        while (iterator.hasNext()) {
            builder.append("\t" + iterator.next());
        }
        // 判断响应实体是否为空
        if (entity != null) {
            String responseString = EntityUtils.toString(entity);
            builder.append("response length:" + responseString.length());
            builder.append("response content:" + responseString.replace("\r\n", ""));
        }
        return builder.toString();
    }
}
