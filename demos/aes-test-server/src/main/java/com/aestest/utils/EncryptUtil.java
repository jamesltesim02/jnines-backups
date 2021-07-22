package com.aestest.utils;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.util.Base64Utils;

public class EncryptUtil {
	private static String cKey = "GZZS123456000000";

	// 加密
	public static String Encrypt(String sSrc) throws Exception {
		if (cKey == null) {
			System.out.print("Key为空null");
			return null;
		}
		// 判断Key是否为16位
		if (cKey.length() != 16) {
			System.out.print("Key长度不是16位");
			return null;
		}
		byte[] raw = cKey.getBytes("utf-8");
		SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
		Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");// "算法/模式/补码方式"
		cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
    byte[] encrypted = cipher.doFinal(sSrc.getBytes("utf-8"));

    // 此处使用BASE64做转码功能，同时能起到2次加密的作用。
    // return new BASE64Encoder().encodeToString(encrypted);
    return new String(Base64Utils.encode(encrypted));
	}

	// 解密
	public static String Decrypt(String sSrc) throws Exception {
		try {
			// 判断Key是否正确
			if (cKey == null) {
				System.out.print("Key为空null");
				return null;
			}
			// 判断Key是否为16位
			if (cKey.length() != 16) {
				System.out.print("Key长度不是16位");
				return null;
			}
			byte[] raw = cKey.getBytes("utf-8");
			SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
			Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
			cipher.init(Cipher.DECRYPT_MODE, skeySpec);
      // byte[] encrypted1 = new Base64().decode(sSrc);// 先用base64解密
      byte[] encrypted1 = Base64Utils.decodeFromString(sSrc);
			try {
				byte[] original = cipher.doFinal(encrypted1);
				String originalString = new String(original, "utf-8");
				return originalString;
			} catch (Exception e) {
				System.out.println(e.toString());
				return null;
			}
		} catch (Exception ex) {
			System.out.println(ex.toString());
			return null;
		}
	}

	// public static void main(String[] args) throws Exception {
	// 	/*
	// 	 * 使用AES-128-ECB加密模式，key为GZZS123456000000。
	// 	 */
	// 	String cKey = "GZZS123456000000";
	// 	// 需要加密的字串
	// 	String cSrc = "wangjiaming321";
	// 	System.out.println(cSrc);
	// 	// 加密
	// 	String enString = EncryptUtil.Encrypt(cSrc);
	// 	System.out.println("加密后的字串是：" + enString);

	// 	// 解密
	// 	String DeString = EncryptUtil.Decrypt(enString);
	// 	System.out.println("解密后的字串是：" + DeString);
	// }
}
