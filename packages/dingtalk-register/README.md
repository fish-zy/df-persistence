# @df-persistence/dingtalk-register v1.0.0

  钉钉注册
  

## Installation

  Using npm:

  ```shell
  $ npm i --save @df-persistence/dingtalk-register
  ```

  ```js
    import { dingTalkRegister } from '@df-persistence/dingtalk-register';
  ```

  For example:

  ```js
  dingTalkRegister({
    DFTracer,//DFZipkinCreateWebEntry生成的对象，有的话，必须传值，没有非必填
    localServiceName, //服务名，非必填
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
    const {code, errMsg} = res;
    if(code =='0'){
      // your code
    }else {
      // your code
    }
  }).catch((err) => {
    console.log(err);
  })

