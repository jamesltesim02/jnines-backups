package nbm.cash.admin.common.utils.http;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

/**
 * @Description
 * @ClassName WebMessage
 * @Author New
 * @Date 2019/11/8 16:29
 * @Version V1.0
 **/
@JsonInclude(Include.NON_NULL)
public class WebMessage<T> {

    private WebMessage() {
    }

    private WebMessage(RespCodeEnum code) {
        this.code = code.getCode();
        this.msg = code.getMessage();
    }

    private WebMessage(int code, String message) {
        this.code = code;
        this.msg = message;
    }

    private WebMessage(int code, String message, T date) {
        this.code = code;
        this.msg = message;
        this.data = date;
    }

    private WebMessage(RespCodeEnum code, T data) {
        this.code = code.getCode();
        this.msg = code.getMessage();
        this.data = data;
    }

    private WebMessage(RespCodeEnum code, T data, Integer countNum) {
        this.code = code.getCode();
        this.msg = code.getMessage();
        this.data = data;
    }

    /**
     * 代码
     */
    private int code;

    /**
     * 描述
     */
    private String msg;

    /**
     * 实体数据
     */
    private T data;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "WebMessage [code=" + code + ", msg=" + msg + ", data=" + data + "]";
    }

    public static final <T> WebMessage<T> message(RespCodeEnum code) {
        return new WebMessage<T>(code.getCode(), code.getMessage());
    }

    public static final <T> WebMessage<T> construct(RespCodeEnum code) {
        return new WebMessage<T>(code);
    }

    public static final <T> WebMessage<T> custom(int code, String message) {
        return new WebMessage<T>(code, message);
    }

    public static final <T> WebMessage<T> construct(RespCodeEnum code, T data) {
        return new WebMessage<T>(code, data);
    }

    public static final <T> WebMessage<T> success() {
        return construct(RespCodeEnum.SUCCESS);
    }

    public static final <T> WebMessage<T> success(String message) {
        return new WebMessage<T>(RespCodeEnum.SUCCESS.getCode(), message);
    }

    public static final <T> WebMessage<T> success(T data) {
        return construct(RespCodeEnum.SUCCESS, data);
    }

    public static final <T> WebMessage<T> success(T data, Integer countNum) {
        return new WebMessage<T>(RespCodeEnum.SUCCESS, data, countNum);
    }

    public static final <T> WebMessage<T> error() {
        return construct(RespCodeEnum.ERROR);
    }

    public static final <T> WebMessage<T> error(T data) {
        return construct(RespCodeEnum.ERROR, data);
    }

    public static final <T> WebMessage<T> success(Integer code, String message, T date) {
        return new WebMessage<T>(code, message, date);
    }
}