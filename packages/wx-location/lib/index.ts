import { wxRegister } from '@df-persistence/wx-register';
import { GetLocationOption, LocationTypes } from '@df-persistence/utils';
import { setInfoOnline } from '@df-persistence/zipkin';

export const getWechatLocation = (props?: GetLocationOption): Promise<LocationTypes> => {
  const { timeout, DFTracer, localServiceName } = props || {}
  return new Promise((resolve, reject) => {
    if (timeout) {
      setTimeout(() => {
        setInfoOnline({
          title: 'Wechat定位超时',
          tag: {
            err: 'Wechat定位超时',
          },
          DFTracer,
          localServiceName
        });
        reject("Wechat定位超时");
      }, timeout);
    }
    wxRegister(props).then(async (res: any) => {
      // @ts-ignore
      const { wx } = window;
      const { code, errMsg } = res || {};
      if (code == '0') {
        try {
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (result: any) => {
              const { latitude, longitude } = result;
              if (latitude && longitude) {
                setInfoOnline({
                  title: 'Wechat定位成功',
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
                  title: 'Wechat定位没有值',
                  tag: {
                    err: { result },
                  },
                  DFTracer,
                  localServiceName
                })
                resolve({ code: '22006', errMsg: 'Wechat定位没有值' })
              }

            },
            fail: async (err: any) => {
              setInfoOnline({
                title: 'Wechat定位失败',
                tag: {
                  err,
                },
                DFTracer,
                localServiceName
              })
              resolve({ code: '22004', errMsg: `Wechat: ${err?.errMsg}` || '请重试' })
            },
          })
        } catch (err) {
          setInfoOnline({
            title: 'Wechat定位异常',
            tag: {
              err,
            },
            DFTracer,
            localServiceName
          })
          reject(err);
        }

      } else {
        resolve({ code, errMsg: errMsg })
      }

    }).catch((err: any) => {
      setInfoOnline({
        title: 'Wechat注册失败',
        tag: {
          err,
        },
        DFTracer,
        localServiceName
      })
      reject(err);
    })
  })

}