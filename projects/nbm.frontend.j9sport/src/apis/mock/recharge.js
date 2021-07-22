import random from 'lodash/random';
import { makeRecords, randomCharactors, slicePage } from "./mock-util";

const now = Date.now()
const start = now - (1000 * 60 * 60 * 24 * 30);

const rechargeRecords = makeRecords({
  range: [0,200],
  filler() {
    return {
      _id: randomCharactors({min: 8, max:12}),
      transId: random(100000000000,1000000000000,false),//交易Id
      userName: randomCharactors({min: 2, max: 6}), // 用户Id
      status: random(-1,1,false),  //充值状态 1：交易成功 0:交易失败，-1:交易待定
      amount: random(0.01,8888,true),//金额
      transTime: random(start,now,false), //交易时间
      currency: 2, //币种
      fee: random(0.01,20), //手续费
      arrivalTime: random(start,now,false),//完成时间
      channelName: "DCBOX",//充值渠道 DCBOX，Bank
      protocol: "",//协议虚拟钱包协议 RC20
      ip: "65.52.170.144",
      domain: "https://j9userm.nbmm.co/",
      frontId: "10077100werw564wesfx",
      appId: null,
      compId: null,
      remark: ""
  }
  }
})

export default {
  name: 'query',
  records: rechargeRecords,
  get_queryRechargeRecord ({pageIndex = 1,pageSize = 10}) {
    return {
      code: 200,
      msg: '',
        data: {
          totalRecord: rechargeRecords.length,
          currentStart: pageIndex,
          list: rechargeRecords.slice((pageIndex - 1) * pageSize, pageIndex * pageSize),
          statisticalData: {
            "total": random(200,88888,true),
            "subtotal": random(50,1000,true)
          }
        }
    }
  }
}