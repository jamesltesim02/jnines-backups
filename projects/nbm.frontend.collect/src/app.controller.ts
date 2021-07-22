import { Controller, Get, Query, Req, Request } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';

import { AppService } from './app.service';

const COLLECT_IMG:string = 'data:image/gif;base64,R0lGODlhAQABAID/AP///wAAACwAAAAAAQABAAACAkQBADs='

/**
 * 客户端类型
 *
 * MoH5   -   手机端H5  
 * PcH5   -   PC端H5  
 * AndroidApp   -   android客户端  
 * AndroidH5   -   android H5  
 * IosApp   -   ios 客户端   
 * IosH5   -   ios H5  
 * QMoH5   -   快捷投注手机H5  
 * QPcH5   -   快捷投注PCH5  
 * Cocos   -   游戏终端  
 *
 */
const CLIENT_TYPES = {
  1: 'MoH5',
  2: 'PcH5',
  3: 'AndroidApp',
  4: 'AndroidH5',
  5: 'IosApp',
  6: 'IosH5',
  7: 'QMoH5',
  8: 'QPcH5',
  9: 'Cocos',
};

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  /**
   * 接收上报请求
   */
  @Get()
  collect(
    @Query() { params: paramsString } : any,
    @Req() request: Request,
    @RealIP() ip: any,
  ) {
  
    // 请求中的参数
    const params: any = JSON.parse(paramsString);
    // user-agent
    params.userAgent = request.headers['user-agent'];
    // 当前时间戳
    params.timestamp = Date.now();
    // 客户端ip
    params.clientIp = ip;
    // 转换客户端类型
    params.clientType = CLIENT_TYPES[params.clientType];

    this.appService.collect(params);

    return COLLECT_IMG;
  }
}
