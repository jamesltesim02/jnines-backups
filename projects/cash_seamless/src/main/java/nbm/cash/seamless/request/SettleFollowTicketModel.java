package nbm.cash.seamless.request;

import nbm.cash.seamless.entity.BetEntity;

/**
 * @program: cash_seamless
 * @description: 跟单结算参数
 * @author: Mr.Nat
 * @create: 2019-12-06 15:15
 **/
public class SettleFollowTicketModel {

    /**
     * 结算参数模型
     */
    private SettleModel settleModel;

    /**
     * 注单模型
     */
    private BetEntity betEntity;

    public SettleModel getSettleModel() {
        return settleModel;
    }

    public void setSettleModel(SettleModel settleModel) {
        this.settleModel = settleModel;
    }

    public BetEntity getBetEntity() {
        return betEntity;
    }

    public void setBetEntity(BetEntity betEntity) {
        this.betEntity = betEntity;
    }
}
