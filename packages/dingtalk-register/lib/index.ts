/* eslint-disable indent */
import axios from "axios";
import { loadScript, RegisterOption, DDAndQWRegisterPath } from '@df-persistence/utils';
import { setInfoOnline } from '@df-persistence/zipkin';

export const dingTalkRegister = (props?: RegisterOption) => {
  const { jsApiList, registerUrl, onRegisterBefore, DFTracer, localServiceName, domain } = props || {};
  const jsApiListTarget = jsApiList || [
    'runtime.info',
    'biz.contact.choose',
    'device.notification.confirm',
    'device.notification.alert',
    'device.notification.prompt',
    'biz.ding.post',
    'device.geolocation.get',
    "device.geolocation.checkPermission",
  ];

  const pinUrl = domain ? `${domain}${DDAndQWRegisterPath}` : DDAndQWRegisterPath;

  const domainUrl =
    registerUrl || pinUrl;
  onRegisterBefore && onRegisterBefore();
  return new Promise((resolve, reject) => {
    loadScript(
      '//g.alicdn.com/dingding/dingtalk-jsapi/2.10.3/dingtalk.open.js',
      'dd'
    )
      .then(async () => {
        // @ts-ignore
        const { dd } = window;
        const url = window.location.href.split('#')[0]
        axios.post(domainUrl, {
          platformCode: 'DD',
          url,
        }).then((res: any) => {
          const { code, data: thisData, msg } = res?.data;
          const data = thisData && typeof thisData == 'string' ? JSON.parse(thisData) : thisData;
          if (code === "0") {
            setInfoOnline({
              title: '获取DingTalk鉴权配置 成功',
              tag: {
                code: 'success',
              },
              DFTracer,
              localServiceName
            });
            dd.config({
              agentId: data?.agentId, // 必填，微应用ID
              corpId: data?.corpId, // 必填，企业ID
              timeStamp: data?.timeStamp, // 必填，生成签名的时间戳
              nonceStr: data?.nonceStr, // 必填，自定义固定字符串。
              signature: data?.signature, // 必填，签名
              jsApiList: jsApiListTarget,
            });
            dd.ready(() => {
              console.log('DingTalk注册 成功')
              setInfoOnline({
                title: 'DingTalk注册 成功',
                tag: {
                  code: 'success',
                },
                DFTracer,
                localServiceName
              });
              resolve({ code: '0', data: true })
            })
            dd.error((err: any) => {
              setInfoOnline({
                title: `DingTalk_24001: ${err?.errMsg || 'DingTalksdk注册错误'}`,
                tag: {
                  err,
                },
                DFTracer,
                localServiceName
              });
              resolve({
                code: '24001',
                errMsg: `DingTalk_24001: ${err?.errMsg || 'DingTalksdk注册错误'}`,
              })
            })
          } else {
            setInfoOnline({
              title: 'DingTalk: 获取钉钉鉴权配置失败',
              tag: {
                err: { msg },
              },
              DFTracer,
              localServiceName
            });
            resolve({
              code: '24002',
              errMsg: 'DingTalk: 获取钉钉鉴权配置失败',
            });
          }
        })
          .catch((err: any) => {
            setInfoOnline({
              title: 'DingTalk: 获取钉钉签名失败',
              tag: {
                err,
              },
              DFTracer,
              localServiceName
            });
            resolve({
              code: '23002',
              errMsg: 'DingTalk: 获取钉钉签名失败',
            })
          });
      }).catch((err: any) => {
        console.log('loadScript err: ', err)
        setInfoOnline({
          title: 'DingTalk: sdk加载失败',
          tag: {
            err,
          },
          DFTracer,
          localServiceName
        });
        resolve({
          code: '23003',
          errMsg: 'DingTalk: sdk加载失败',
        })
      })
  });
};

