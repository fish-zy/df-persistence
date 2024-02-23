import DfHybrid from "df_hybrid";
import { GetLocationOption, LocationTypes } from '@df-persistence/utils';
import { setInfoOnline } from '@df-persistence/zipkin';

const { DFWLocation, DFWApp } = DfHybrid;

enum AppGetAuthorizedStatusType {
  // 相机权限
  Camera = "camera",
  // 访问相册权限
  Photo = "photo",
  // 麦克风
  Microphone = "microphone",
  // 定位
  Location = "location",
}

export const getAppLocation = (props?: GetLocationOption): Promise<LocationTypes> => {
  const { timeout, DFTracer, localServiceName } = props || {}
  return new Promise((resolve, reject) => {
    if (timeout) {
      setTimeout(() => {
        setInfoOnline({
          title: 'App定位超时',
          tag: {
            err: 'App定位超时',
          },
          DFTracer,
          localServiceName
        });
        reject("App定位超时");
      }, timeout);
    }
    try {
      DFWApp.appGetAuthorizedStatus({ type: AppGetAuthorizedStatusType.Location }, (res: any) => {
        if (res?.code == '0') {
          try {
            DFWLocation.appGetGpsLoc((result: any) => {
              const { code, data } = result;
              if (code == '0') {
                const { latitude, longitude } = data;
                if (latitude && longitude) {
                  setInfoOnline({
                    title: 'App定位成功',
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
                    title: 'APP定位没有值',
                    tag: {
                      err: { result },
                    },
                    DFTracer,
                    localServiceName
                  })
                  resolve({ code: '21005', errMsg: 'APP定位没有值' })
                }
              } else {
                setInfoOnline({
                  title: 'APP定位失败',
                  tag: {
                    err: { data },
                  },
                  DFTracer,
                  localServiceName
                })
                resolve({ code: '21006', errMsg: 'APP定位失败' })
              }
            })
          } catch (error) {
            setInfoOnline({
              title: 'APP定位异常',
              tag: {
                err: error,
              },
              DFTracer,
              localServiceName
            })
            reject(error);
          }

        } else {
          setInfoOnline({
            title: '百福得APP 未开启定位授权',
            tag: {
              err: { res },
            },
            DFTracer,
            localServiceName
          })
          reject("百福得APP 未开启定位授权");
        }
      })
    } catch (error) {
      setInfoOnline({
        title: '百福得APP 开启定位授权失败',
        tag: {
          err: error,
        },
        DFTracer,
        localServiceName
      })
      reject("百福得APP 开启定位授权失败");
    }

  })

}