import axios from "axios";
import { loadScript, RegisterOption, DDAndQWRegisterPath } from '@df-persistence/utils';
import { setInfoOnline } from '@df-persistence/zipkin';

export const wxWorkRegister = (props?: RegisterOption) => {
  const { jsApiList, registerUrl, onRegisterBefore, DFTracer, localServiceName, domain } = props || {};
  const jsApiListTarget = jsApiList || [
    'scanQRCode',
    'getLocation',
    'closeWindow',
    'hideMenuItems',
    'showMenuItems',
    'hideAllNonBaseMenuItem',
    'hideOptionMenu',
    'onMenuShareAppMessage',
    'onMenuShareWechat',
    'onMenuShareTimeline',
    'shareWechatMessage',
  ];
  const pinUrl = domain ? `${domain}${DDAndQWRegisterPath}` : DDAndQWRegisterPath;
  const domainUrl =
    registerUrl || pinUrl;
  onRegisterBefore && onRegisterBefore();
  return new Promise((resolve, reject) => {
    loadScript('//res.wx.qq.com/open/js/jweixin-1.6.0.js', 'wx')
      .then(async () => {
        //@ts-ignore
        const wx = window?.wx;
        const url = window.location.href.split('#')[0]
        axios.post(domainUrl, {
          platformCode: 'QW',
          url,
        }).then((res: any) => {
          const { code, data: thisData, msg } = res?.data;
          const data = thisData && typeof thisData == 'string' ? JSON.parse(thisData) : thisData;
          console.log(code, wx, data, msg, res, '获取企业微信鉴权-----------')
          if (code != 0) {
            setInfoOnline({
              title: 'wxWork: 获取企业微信鉴权配置失败',
              tag: {
                err: { msg },
              },
              DFTracer,
              localServiceName
            })
            resolve({
              code: '24002',
              errMsg: 'wxWork: 获取企业微信鉴权配置失败',
            })
          } else if (data === null) {
            setInfoOnline({
              title: 'wxWork: 获取企业微信鉴权配置为空',
              tag: {
                error: { msg: 'wxWork: 获取企业微信鉴权配置为空' },
              },
              DFTracer,
              localServiceName
            });
            resolve({
              code: '2400null',
              errMsg: 'wxWork: 获取企业微信鉴权配置为空',
            })
          } else {
            setInfoOnline({
              title: 'wxWork: 获取企业微信鉴权配置 成功',
              tag: {
                code: 'success',
              },
              DFTracer,
              localServiceName
            });
            wx.config({
              beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: data?.corpId, // 必填，公众号的唯一标识
              timestamp: data?.timeStamp, // 必填，生成签名的时间戳
              nonceStr: data?.nonceStr, // 必填，生成签名的随机串
              signature: data?.signature, // 必填，签名
              jsApiList: jsApiListTarget, // 必填，需要使用的JS接口列表
            })
            wx.ready(() => {
              console.log('wxWork 成功')
              setInfoOnline({
                title: 'wxWork注册 成功',
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
                title: `wxWork_24001: ${err?.errMsg || 'wxWork sdk注册错误'}`,
                tag: {
                  err,
                },
                DFTracer,
                localServiceName
              })
              resolve({
                code: '24001',
                errMsg: `wxWork_24001: ${err?.errMsg || 'wxWork sdk注册错误'}`,
              })
            })
          }
        }).catch((err: any) => {
          console.log('loadScript err: ', err)
          setInfoOnline({
            title: 'wxWork: 获取企业微信鉴权配置异常',
            tag: {
              err,
            },
            DFTracer,
            localServiceName
          })
          resolve({
            code: '24003',
            errMsg: 'wxWork: 获取企业微信鉴权配置异常',
          })
        })

      }).catch((err: any) => {
        console.log('loadScript err: ', err)
        setInfoOnline({
          title: 'wxWork: sdk加载失败',
          tag: {
            err,
          },
          DFTracer,
          localServiceName
        })
        resolve({
          code: '24004',
          errMsg: 'wxWork: sdk加载失败',
        })
      })
  })
}