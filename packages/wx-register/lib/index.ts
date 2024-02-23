import axios from "axios";
import platforminfo, { nameEnum } from '@df-persistence/platform';
import { loadScript, RegisterOption, WxRegisterPath } from '@df-persistence/utils';
import { setInfoOnline } from '@df-persistence/zipkin';

export const wxRegister = (props?: RegisterOption) => {
  const { jsApiList, registerUrl, onRegisterBefore, DFTracer, localServiceName, domain } = props || {};
  const jsApiListTarget = jsApiList || [
    'scanQRCode',
    'hideMenuItems',
    'showMenuItems',
    'hideAllNonBaseMenuItem',
    'getLocation',
    'shareAppMessage',
    'updateAppMessageShareData',
    'updateTimelineShareData',
    'onMenuShareAppMessage',
  ];
  const pinUrl = domain ? `${domain}${WxRegisterPath}` : WxRegisterPath;
  const domainUrl =
    registerUrl || pinUrl;
  onRegisterBefore && onRegisterBefore();
  return new Promise((resolve, reject) => {
    loadScript('//res.wx.qq.com/open/js/jweixin-1.6.0.js', 'wx')
      .then(async () => {
        //@ts-ignore
        const wx = window?.wx;
        const url = window.location.href.split('#')[0];
        const { name } = platforminfo;
        const caller = name == nameEnum.WxWork ? 2 : 1;
        axios.post(domainUrl, {
          caller,
          url,
        }).then((res: any) => {
          const { code, body: data, msg } = res?.data;
          console.log(code, data, msg, res, '获取微信鉴权-----------')
          if (code != 0) {
            setInfoOnline({
              title: 'Wechat: 获取微信鉴权配置失败',
              tag: {
                err: { msg },
              },
              DFTracer,
              localServiceName
            })
            resolve({
              code: '22002',
              errMsg: 'Wechat: 获取微信鉴权配置失败',
            })
          } else {
            setInfoOnline({
              title: 'Wechat: 获取微信鉴权配置 成功',
              tag: {
                code: 'success',
              },
              DFTracer,
              localServiceName
            });
            console.log(wx, '获取微信鉴权wx-----------')
            if (wx) {
              wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data?.appId, // 必填，公众号的唯一标识
                timestamp: data?.timestamp, // 必填，生成签名的时间戳
                nonceStr: data?.nonceStr, // 必填，生成签名的随机串
                signature: data?.signature, // 必填，签名
                jsApiList: jsApiListTarget, // 必填，需要使用的JS接口列表
              })
              wx.ready(() => {
                console.log('wxchat 成功')
                setInfoOnline({
                  title: 'wxchat注册 成功',
                  tag: {
                    code: 'success',
                  },
                  DFTracer,
                  localServiceName
                });
                resolve({ code: '0', data: true })
              })
              wx.error((err: any) => {
                console.log('error----01: ', err)
                setInfoOnline({
                  title: `Wechat_22001: ${err?.errMsg || 'wechat sdk注册错误'}`,
                  tag: {
                    err,
                  },
                  DFTracer,
                  localServiceName
                })
                resolve({
                  code: '22001',
                  errMsg: `Wechat_22001: ${err?.errMsg || 'wechat sdk注册错误'}`,
                })
              })
            }

          }
        }).catch((err: any) => {
          setInfoOnline({
            title: 'Wechat: 获取微信鉴权配置异常',
            tag: {
              err,
            },
            DFTracer,
            localServiceName
          })
          resolve({
            code: '22003',
            errMsg: 'Wechat: 获取微信鉴权配置异常',
          })
        })

      }).catch((err: any) => {
        console.log('loadScript err: ', err)
        setInfoOnline({
          title: 'Wechat: sdk加载失败',
          tag: {
            err,
          },
          DFTracer,
          localServiceName
        });
        resolve({
          code: '22007',
          errMsg: 'Wechat: sdk加载失败',
        })
      });
  })
}