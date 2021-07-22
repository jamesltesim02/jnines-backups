package com.aestest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.aestest.xxoo.BizInfo;
import com.aestest.xxoo.BizInfoParam;
import com.aestest.utils.EncryptUtil;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

  @ResponseBody
  @RequestMapping(path="/checkValidateCode", method = RequestMethod.POST)
  public BizInfo checkValidateCode(@RequestBody BizInfoParam bizInfoParam) throws Exception {
    BizInfo bizInfo = bizInfoParam.getBizInfo();

    String mobile = EncryptUtil.Decrypt(bizInfo.getMobile());
    String validateCode = EncryptUtil.Decrypt(bizInfo.getValidateCode());

    System.out.println(mobile + ',' + validateCode);

    return new BizInfo(mobile, validateCode, bizInfo.getClientSystemCode());
  }
}
