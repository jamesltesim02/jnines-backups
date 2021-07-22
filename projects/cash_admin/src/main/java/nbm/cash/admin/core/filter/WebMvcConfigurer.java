package nbm.cash.admin.core.filter;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

/**
 * @Description
 * @ClassName WebMvcConfigurer
 * @Author New
 * @Date 2019/12/12 15:34
 * @Version V1.0
 **/
@Configuration
class WebMvcConfigurer extends WebMvcConfigurationSupport{

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        /**
         * 拦截器按照顺序执行,如果不同拦截器拦截存在相同的URL，前面的拦截器会执行，后面的拦截器将不执行
         */
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/**")                      // 拦截所有路径
                .excludePathPatterns("/user/login", "/file/**", "/user/test");           // 白明单，不需要拦截

        super.addInterceptors(registry);
    }

    /*
     *最重要的一步：在此处指明你在拦截器中排除拦截的静态资源路径指向的是classpath下static路径
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }

    /**
     * 跨域處理
     * @param registry
     */
    @Override
    protected void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//            .allowedHeaders("header1", "header2", "header3")
//            .exposedHeaders("header1", "header2")
            .allowCredentials(true).maxAge(3600);
    }
}