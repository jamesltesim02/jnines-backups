package nbm.cash.seamless.response;

public class RespJson {

    private int code = 0;

    private String msg = "";

    private Object data = null;

    private transient Object extras;

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

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Object getExtras() {
        return extras;
    }

    public void setExtras(Object extras) {
        this.extras = extras;
    }


}
