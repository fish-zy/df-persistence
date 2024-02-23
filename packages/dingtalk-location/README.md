# @df-persistence/dingtalk-location v1.0.0

  获取相关钉钉的当前定位
  

## Installation

  Using npm:

  ```shell
  $ npm i --save @df-persistence/dingtalk-location
  ```

  ```js
    import { getDingTalkLocation } from '@df-persistence/dingtalk-location';
  ```

  For example:

  ```js
  getDingTalkLocation({
    DFTracer,//DFZipkinCreateWebEntry生成的对象，有的话，必须传值，没有非必填
    localServiceName, //服务名，非必填
    timeout: 1000, // 也可以不传任何参数，timeout是超时时间
    jsApiList: [
      'runtime.info',
      'biz.contact.choose',
      'device.notification.confirm',
      'device.notification.alert',
      'device.notification.prompt',
      'biz.ding.post',
      'device.geolocation.get',
      "device.geolocation.checkPermission",
    ], // 默认就有，可以不传任何参数
    registerUrl:'', // 后台获取注册签名的url,可以不传，不传用默认的
    domain: '',//环境变量url，可以不传，默认线上
  }).then((res) => {
    const {code, data, errMsg} = res;
    if(code =='0'){
      const {latitude, longitude} = data;
      // your code
    }else {
      // your code
    }
  }).catch((err) => {
    console.log(err);
  })

