package com.aestest.xxoo;

public class BizInfo {

  private String mobile;
  private String validateCode;
  private String clientSystemCode;

  public BizInfo() {}

  public BizInfo(String mobile, String validateCode, String clientSystemCode) {
    this.mobile = mobile;
    this.validateCode = validateCode;
    this.clientSystemCode = clientSystemCode;
  }

  public void setMobile(String mobile) {
    this.mobile = mobile;
  }

  public String getMobile() {
    return this.mobile;
  }

  public void setValidateCode(String validateCode) {
    this.validateCode = validateCode;
  }

  public String getValidateCode() {
    return validateCode;
  }

  public void setClientSystemCode(String clientSystemCode) {
    this.clientSystemCode = clientSystemCode;
  }

  public String getClientSystemCode() {
    return clientSystemCode;
  }
}
