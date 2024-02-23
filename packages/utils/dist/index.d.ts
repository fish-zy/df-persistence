import { InfoOnlineProps } from '@df-persistence/zipkin';
export declare function load(src: string, opts?: any, cb?: () => void): void;
export declare function loadScript(url: string, name?: string): Promise<unknown>;
export interface RegisterOption extends Pick<InfoOnlineProps, 'DFTracer' | 'localServiceName'> {
    jsApiList?: string[];
    registerUrl?: string;
    onRegisterBefore?(): void;
    domain?: string;
}
export interface GetLocationOption extends RegisterOption {
    timeout?: number;
}
type NativeResTypes<T> = {
    code: string;
    data?: T;
    errMsg?: string;
};
/** 定位 */
export type LocationTypes = NativeResTypes<{
    latitude: string;
    longitude: string;
}>;
export declare const DDAndQWRegisterUrl = "https://corp.m.dongfangfuli.com/user/gateway/platform/signature";
export declare const WxRegisterUrl = "https://corp.m.dongfangfuli.com/gw/app/permission_valid_config/signature";
export declare const DDAndQWRegisterPath = "/user/gateway/platform/signature";
export declare const WxRegisterPath = "/gw/app/permission_valid_config/signature";
export {};
