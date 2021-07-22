import createAxios from './createAxios';

const axios = createAxios({ baseURL: window.NBConfig.CASINO_API_URL });

/**
 * 登录
 *
 * @param {object} params
 *    登录参数
 *      {
 *        account: 账号,
 *        password: 密码
 *        terminal: 终端类型 1:H5 2:PC 3:Android 4:IOS 5其他,
 *      }
 *
 * @returns {object}
 *    登录响应结果
 *      {
 *        // 是否代理
 *        "agent": false,
 *        // 余额
 *        "balance": 800,
 *        // 邮箱是否通过验证
 *        "emailValid": false,
 *        // 可用余额
 *        "freeBalance": 800,
 *        // 账号
 *        "memberAccount": "tednb01",
 *        // 用户等级
 *        "memberLevel": 0,
 *        // 手机号是否通过验证
 *        "phoneValid": false,
 *        // 性别
 *        "sex": 0,
 *        // 登录token
 *        "token": "5986C0D511F95193C27FBB7B11848CC0ADA5C8D8C3E491AF"
 *      }
 */
export const login = params => axios.post('member/login', params);

/**
 * 获取余额
 *
 * @param {object} params
 *    用户信息参数
 */
export const getBalance = params => axios.post('seamless/QueryAccount', params);
