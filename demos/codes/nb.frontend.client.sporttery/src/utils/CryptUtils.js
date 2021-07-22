import CryptoJS from 'crypto-js';
import store from '@/store';

/**
 * 加密
 *
 * @param {string} value
 *    加密内容
 * @param {string} key
 *    加密key
 *
 * @returns {string}
 *    加密后的结果
 */
export const encrypt = (value, key = store.state.app.cryptKey) => {
  const encrypted = CryptoJS.DES.encrypt(
    value,
    CryptoJS.enc.Utf8.parse(key),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  );

  return encodeURIComponent(encrypted.toString());
};


/**
 * 解密
 *
 * @param {string} value
 *    解密内容
 * @param {string} key
 *    解密key
 *
 * @returns {string}
 *    解密后的结果
 */
export const decrypt = (value, key = store.state.app.cryptKey) => {
  const decrypted = CryptoJS.DES.decrypt(
    value,
    key,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
};
