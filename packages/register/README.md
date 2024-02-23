# @df-persistence/register v1.0.0

  相关平台的注册，目前支持钉钉、小程序、微信、企微
  

## Installation

  Using npm:

  ```shell
  $ npm i --save @df-persistence/register
  ```

  ```js
    import { toRegister } from '@df-persistence/register';
  ```

  For example:

  ```js
  toRegister({ 
    DFTracer,//DFZipkinCreateWebEntry生成的对象，有的话，必须传值，没有非必填
    localServiceName, //服务名，非必填
    jsApiList: [], // 相关平台的功能，默认就有，可以不传任何参数
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

