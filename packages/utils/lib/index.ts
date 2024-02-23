import { InfoOnlineProps } from '@df-persistence/zipkin';

function stdOnEnd(script: any, cb: any) {
  script.onload = function () {
    this.onerror = this.onload = null
    cb(null, script)
  }
  script.onerror = function () {
    // this.onload = null here is necessary
    // because even IE9 works not like others
    this.onerror = this.onload = null
    cb(new Error('Failed to load ' + this.src), script)
  }
}

function ieOnEnd(script: any, cb: any) {
  script.onreadystatechange = function () {
    if (this.readyState != 'complete' && this.readyState != 'loaded') return
    this.onreadystatechange = null
    cb(null, script) // there is no way to catch loading errors in IE8
  }
}

export function load(src: string, opts?: any, cb?: () => void) {
  const head = document.head || document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  cb = cb || function () { }

  script.type = opts.type || 'text/javascript';
  script.charset = opts.charset || 'utf8';
  script.async = 'async' in opts ? !!opts.async : true;
  script.src = src;
  if (opts.attrs) {
    for (let attr in opts.attrs) {
      script.setAttribute(attr, opts.attrs[attr]);
    }
  }

  if (opts.text) {
    script.text = '' + opts.text;
  }
  const onend = 'onload' in script ? stdOnEnd : ieOnEnd;
  onend(script, cb);
  // some good legacy browsers (firefox) fail the 'in' detection above
  // so as a fallback we always set onload
  // old IE will ignore this and new IE will set onload
  if (!script.onload) {
    stdOnEnd(script, cb);
  }

  head.appendChild(script);
}

export function loadScript(url: string, name?: string) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (name && window[name]) resolve(true);
    if (!url) reject('js 地址不存在');
    load(url, (error: any) => {
      console.log(error, 'loadScript error----')
      // @ts-ignore
      if (!window[name]) reject('这里' + name + ' sdk 属性值未获取')
      if (error) reject(`Error: ${error}`)
      resolve(true)
    })
  })
}

export interface RegisterOption extends Pick<InfoOnlineProps, 'DFTracer' | 'localServiceName'> {
  jsApiList?: string[]
  registerUrl?: string
  onRegisterBefore?(): void
  domain?: string
}

export interface GetLocationOption extends RegisterOption {
  timeout?: number
}


type NativeResTypes<T> = {
  code: string
  data?: T
  errMsg?: string
}

/** 定位 */
export type LocationTypes = NativeResTypes<{
  latitude: string
  longitude: string
  // direction: string
}>

export const DDAndQWRegisterUrl = 'https://corp.m.dongfangfuli.com/user/gateway/platform/signature';

export const WxRegisterUrl = 'https://corp.m.dongfangfuli.com/gw/app/permission_valid_config/signature';


export const DDAndQWRegisterPath = '/user/gateway/platform/signature';

export const WxRegisterPath = '/gw/app/permission_valid_config/signature';

