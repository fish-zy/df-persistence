# @df-persistence/wxwork-register v1.0.0

  企业微信注册
  

## Installation

  Using npm:

  ```shell
  $ npm i --save @df-persistence/wxwork-register
  ```

  ```js
    import { wxWorkRegister } from '@df-persistence/wxwork-register';
  ```

  For example:

  ```js
  wxWorkRegister({
    DFTracer,//DFZipkinCreateWebEntry生成的对象，有的话，必须传值，没有非必填
    localServiceName, //服务名，非必填
    jsApiList: [
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
  ```
