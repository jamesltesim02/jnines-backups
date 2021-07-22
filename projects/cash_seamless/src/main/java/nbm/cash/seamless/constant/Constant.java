package nbm.cash.seamless.constant;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ConfigurationProperties(prefix = "path")
@PropertySource("classpath:constant.properties")
public class Constant {
    private String queryAccount;
    private String order;
    private String billing;
    private String queryTicket;
    private String cancelTicket;
    private String matchScore;

    public String getQueryAccount() {
        return queryAccount;
    }

    public void setQueryAccount(String queryAccount) {
        this.queryAccount = queryAccount;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public String getBilling() {
        return billing;
    }

    public void setBilling(String billing) {
        this.billing = billing;
    }

    public String getQueryTicket() {
        return queryTicket;
    }

    public void setQueryTicket(String queryTicket) {
        this.queryTicket = queryTicket;
    }

    public String getCancelTicket() {
        return cancelTicket;
    }

    public void setCancelTicket(String cancelTicket) {
        this.cancelTicket = cancelTicket;
    }

    public String getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(String matchScore) {
        this.matchScore = matchScore;
    }
}
