import platforminfo, { nameEnum } from '@df-persistence/platform';
import { RegisterOption } from '@df-persistence/utils';
import { dingTalkRegister } from '@df-persistence/dingtalk-register';
import { wxRegister } from '@df-persistence/wx-register';
import { wxWorkRegister } from '@df-persistence/wxwork-register';
import { setInfoOnline } from '@df-persistence/zipkin';

export const toRegister = (props?: RegisterOption) => {
  const { name } = platforminfo;
  const { DFTracer, localServiceName } = props || {};
  return new Promise((resolve, reject) => {
    switch (name) {
      case nameEnum.DingTalk: dingTalkRegister(props).then((res) => { resolve(res) }).catch((err: any) => { reject(err) }); break;
      case nameEnum.MiniProgram:
      // case nameEnum.WxWork:
      case nameEnum.WeChat: wxRegister(props).then((res) => { resolve(res) }).catch((err: any) => { reject(err) }); break;
      case nameEnum.WxWork: wxWorkRegister(props).then((res) => { resolve(res) }).catch((err: any) => { reject(err) }); break;
      default: setInfoOnline({
        title: '暂不支持其他平台的注册',
        tag: {
          err: { msg: '暂不支持其他平台的注册' },
        },
        DFTracer,
        localServiceName
      });
        resolve({ code: '-1', errMsg: '暂不支持其他平台的注册' })
    }
  });
}
