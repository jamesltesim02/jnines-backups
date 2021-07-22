package nbm.cash.admin.common.utils.http;

/**
 * @Description
 * @ClassName RespCodeEnum
 * @Author New
 * @Date 2019/11/8 16:33
 * @Version V1.0
 **/
public enum RespCodeEnum {

    SUCCESS(200, "操作成功"),

    FAIL(202, "操作失败"),

    USER_NOT_EXIST(300, "用户不存在"),

    USER_BALANCE_INSUFFICIENT(301, "用户余额不足"),

    PARAMETER_ERROR(400, "参数错误"),

    SIGNATURE_INVALID(401, "签名无效，请先登录"),

    //DATA_SAVE_ERROR(401,"保存数据库失败"),

    DATA_FORMAT(402, "数据格式化错误"),

    UNAUTHORIZED(403, "无权限"),

    //UNAUTHORIZED(403, "未登陆"),

    DATA_NOT_EXIST(404, "数据不存在"),

    DATA_EXIST(409, "数据已存在"),

    TICKET_BILLED(409, "数据已存在"),



    ERROR(500, "服务器内部错误"),

    RES_DATA_FORMAT(450, "未登陆"),

    PUBLISH_OVERTIME(470, "超过截止时间，不能发单或跟单"),

    BET_AMOUNT_SMALL(471, "跟单金额小于最小跟单金额，跟单失败"),

    CAN_NOT_FOLLOW(650, "不能跟自己的单"),

    PARAM_ERROR(10004, "参数校验错误"),

    CAN_NOT_BE_DOWN(10050, "发单失败，不满足发单条件"),

    PASSWORD_ERROR(10110, "数据已存在");

    private int code;

    private String message;

    private RespCodeEnum(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}