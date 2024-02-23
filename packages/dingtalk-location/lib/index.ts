import { dingTalkRegister } from '@df-persistence/dingtalk-register';
import { GetLocationOption, LocationTypes } from '@df-persistence/utils';
import { setInfoOnline } from '@df-persistence/zipkin'

export const getDingTalkLocation = (props?: GetLocationOption): Promise<LocationTypes> => {
  const { timeout, DFTracer, localServiceName } = props || {}
  return new Promise((resolve, reject) => {
    if (timeout) {
      setTimeout(() => {
        setInfoOnline({
          title: 'DingTalk定位超时',
          tag: {
            err: 'DingTalk定位超时',
          },
          DFTracer,
          localServiceName
        });
        reject("DingTalk定位超时");
      }, timeout);
    }
    dingTalkRegister(props).then(async (res: any) => {
      // @ts-ignore
      const { dd } = window;
      const { code, errMsg } = res || {};
      if (code == '0') {
        try {
          dd.device.geolocation.get({
            targetAccuracy: 200, // 期望定位精度半径(单位米)
            coordinate: 1, // 1：获取高德坐标 0：获取标准坐标
            withReGeocode: true, // 是否需要带有逆地理编码信息。
            useCache: true, // 默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: (result: any) => {
              const { latitude, longitude } = result;
              if (latitude && longitude) {
                setInfoOnline({
                  title: 'DingTalk定位成功',
                  tag: {
                    code: 'success',
                  },
                  DFTracer,
                  localServiceName
                });
                resolve({
                  code: '0',
                  data: {
                    latitude,
                    longitude,
                  },
                })
              } else {
                setInfoOnline({
                  title: 'DingTalk定位没有值',
                  tag: {
                    err: { result },
                  },
                  DFTracer,
                  localServiceName
                });
                resolve({ code: '23006', errMsg: 'DingTalk定位没有值' })
              }

            },
            onFail: async (err: any) => {
              setInfoOnline({
                title: 'DingTalk定位失败',
                tag: {
                  err,
                },
                DFTracer,
                localServiceName
              });
              resolve({ code: '23005', errMsg: `DingTalk: ${err}` || '请重试' })
            },
          })
        } catch (error) {
          setInfoOnline({
            title: 'DingTalk定位异常',
            tag: {
              err: error,
            },
            DFTracer,
            localServiceName
          });
          reject(error);
        }

      } else {
        resolve({ code, errMsg: errMsg })
      }

    }).catch((err) => {
      setInfoOnline({
        title: 'DingTalk注册失败',
        tag: {
          err,
        },
        DFTracer,
        localServiceName
      });
      reject(err);
    })
  })

}