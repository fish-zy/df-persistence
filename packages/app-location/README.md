# @df-persistence/app-location v1.0.0

  获取相关BFD APP的当前定位
  

## Installation

  Using npm:

  ```shell
  $ npm i --save @df-persistence/app-location
  ```

  ```js
    import { getAppLocation } from '@df-persistence/app-location';
  ```

  For example:

  ```js
  getAppLocation({
    DFTracer,//DFZipkinCreateWebEntry生成的对象，有的话，必须传值，没有非必填
    localServiceName, //服务名，非必填
    timeout: 1000 // 也可以不传任何参数，timeout是超时时间
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

