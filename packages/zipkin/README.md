# @df-persistence/zipkin v1.0.0

  调用链上报

## Installation
  
  Using npm:

  ```shell
  $ npm i --save @df-persistence/zipkin
  ```

  ```js
    import { zipkinInit, setInfoOnline} from '@df-persistence/zipkin';
  ```

  zipkinInit()需要先初始化，setInfoOnline才可以用


  For example:

  ```js
  export const wxWorkRegister = (props?: RegisterOption) => {
    zipkinInit();
    // your code
    return new Promise((resolve, reject) => {
        // your code 
        // setInfoOnline(info: string, tag?: Record<string, any>)
    })
  }

  ```
 

