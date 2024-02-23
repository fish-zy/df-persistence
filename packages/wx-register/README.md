# @df-persistence/wx-register v1.0.0

  微信注册
  

## Installation

  Using npm:

  ```shell
  $ npm i --save @df-persistence/wx-register
  ```

  ```js
    import { wxRegister } from '@df-persistence/wx-register';
  ```

  For example:

  ```js
  wxRegister({
    DFTracer,//DFZipkinCreateWebEntry生成的对象，有的话，必须传值，没有非必填
    localServiceName, //服务名，非必填
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
    const {code, errMsg} = res;
    if(code =='0'){
      // your code
    }else {
      // your code
    }
  }).catch((err) => {
    console.log(err);
  })

