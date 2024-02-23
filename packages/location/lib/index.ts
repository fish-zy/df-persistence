import platforminfo, { nameEnum } from '@df-persistence/platform';
import { RegisterOption, LocationTypes } from '@df-persistence/utils';
import { getDingTalkLocation } from '@df-persistence/dingtalk-location';
import { getAppLocation } from '@df-persistence/app-location';
import { getWechatLocation } from '@df-persistence/wx-location';
import { getWxWorkLocation } from '@df-persistence/wxwork-location';
import { setInfoOnline } from '@df-persistence/zipkin';

export const getLocation = (props?: RegisterOption): Promise<LocationTypes> => {
  const { name } = platforminfo;
  const { DFTracer, localServiceName } = props || {}
  return new Promise((resolve, reject) => {
    switch (name) {
      case nameEnum.DingTalk: getDingTalkLocation(props).then((res) => { resolve(res); }).catch((err: any) => { reject(err) }); break;
      case nameEnum.MiniProgram:
      // case nameEnum.WxWork:
      case nameEnum.WeChat: getWechatLocation(props).then((res) => { resolve(res); }).catch((err: any) => { reject(err) }); break;
      case nameEnum.WxWork: getWxWorkLocation(props).then((res) => { resolve(res); }).catch((err: any) => { reject(err) }); break;
      case nameEnum.App: getAppLocation(props).then((res) => { resolve(res) }).catch((err: any) => { reject(err) }); break;
      default: setInfoOnline({
        title: '暂不支持其他平台的定位',
        tag: {
          err: { msg: '暂不支持其他平台的定位' },
        },
        DFTracer,
        localServiceName
      });
        resolve({ code: '-1', errMsg: '暂不支持其他平台的定位' })
    }
  });
}
