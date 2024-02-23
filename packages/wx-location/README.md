# @df-persistence/wx-location v1.0.0

  获取微信和微信小程序的当前定位
  

## Installation

  Using npm:

  ```shell
  $ npm i --save @df-persistence/wx-location
  ```

  ```js
    import { getWechatLocation } from '@df-persistence/wx-location';
  ```

  For example:

  ```js
  getWechatLocation({
    DFTracer,//DFZipkinCreateWebEntry生成的对象，有的话，必须传值，没有非必填
    localServiceName, //服务名，非必填
    timeout: 1000, // 也可以不传任何参数，timeout是超时时间
    jsApiList: [
    'scanQRCode',
    'hideMenuItems',
    'showMenuItems',
    'hideAllNonBaseMenuItem',
    'getLocation',
    'shareAppMessage',
    'updateAppMessageShareData',
    'updateTimelineShareData',
    'onMenuShareAppMessage',
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

