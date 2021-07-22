/** 6-14位英文数字 */
export const loginPasswordReg= /^[A-Za-z0-9]{6,14}$/

/** 8-14位英文数字 */
export const registerPasswordReg= /^[A-Za-z0-9]{8,14}$/

/** j9开头的账号注册 */
export const j9RegisterReg =  /^j9.[A-Za-z0-9]{5,9}$/

/** 中国手机号码 */
export const phoneNumberReg = /^1(3\d|4[5-9]|5[0-35-9]|6[6]|7[2-8]|8\d|9[0-35-9])\d{8}$/

/** 数字 */
export const numberReg = /^[0-9]*$/

/** 6-14密码校验规则*/
export const loginPasswordRules = [{required: true,pattern: loginPasswordReg,message: "请输入6-14位数字和字母"}]

/** 8-14密码校验规则 */
export const registerPasswordRules = [{required: true,pattern: registerPasswordReg,message: "请输入8-14位数字和字母"}]
