"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wxRegister = void 0;
const axios_1 = require("axios");
const platform_1 = require("@df-persistence/platform");
const utils_1 = require("@df-persistence/utils");
const zipkin_1 = require("@df-persistence/zipkin");
const wxRegister = (props) => {
    const { jsApiList, registerUrl, onRegisterBefore, DFTracer, localServiceName, domain } = props || {};
    const jsApiListTarget = jsApiList || [
        'scanQRCode',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'getLocation',
        'shareAppMessage',
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareAppMessage',
    ];
    const pinUrl = domain ? `${domain}${utils_1.WxRegisterPath}` : utils_1.WxRegisterPath;
    const domainUrl = registerUrl || pinUrl;
    onRegisterBefore && onRegisterBefore();
    return new Promise((resolve, reject) => {
        (0, utils_1.loadScript)('//res.wx.qq.com/open/js/jweixin-1.6.0.js', 'wx')
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            //@ts-ignore
            const wx = window === null || window === void 0 ? void 0 : window.wx;
            const url = window.location.href.split('#')[0];
            const { name } = platform_1.default;
            const caller = name == platform_1.nameEnum.WxWork ? 2 : 1;
            axios_1.default.post(domainUrl, {
                caller,
                url,
            }).then((res) => {
                const { code, body: data, msg } = res === null || res === void 0 ? void 0 : res.data;
                console.log(code, data, msg, res, '获取微信鉴权-----------');
                if (code != 0) {
                    (0, zipkin_1.setInfoOnline)({
                        title: 'Wechat: 获取微信鉴权配置失败',
                        tag: {
                            err: { msg },
                        },
                        DFTracer,
                        localServiceName
                    });
                    resolve({
                        code: '22002',
                        errMsg: 'Wechat: 获取微信鉴权配置失败',
                    });
                }
                else {
                    (0, zipkin_1.setInfoOnline)({
                        title: 'Wechat: 获取微信鉴权配置 成功',
                        tag: {
                            code: 'success',
                        },
                        DFTracer,
                        localServiceName
                    });
                    console.log(wx, '获取微信鉴权wx-----------');
                    if (wx) {
                        wx.config({
                            debug: false,
                            appId: data === null || data === void 0 ? void 0 : data.appId,
                            timestamp: data === null || data === void 0 ? void 0 : data.timestamp,
                            nonceStr: data === null || data === void 0 ? void 0 : data.nonceStr,
                            signature: data === null || data === void 0 ? void 0 : data.signature,
                            jsApiList: jsApiListTarget, // 必填，需要使用的JS接口列表
                        });
                        wx.ready(() => {
                            console.log('wxchat 成功');
                            (0, zipkin_1.setInfoOnline)({
                                title: 'wxchat注册 成功',
                                tag: {
                                    code: 'success',
                                },
                                DFTracer,
                                localServiceName
                            });
                            resolve({ code: '0', data: true });
                        });
                        wx.error((err) => {
                            console.log('error----01: ', err);
                            (0, zipkin_1.setInfoOnline)({
                                title: `Wechat_22001: ${(err === null || err === void 0 ? void 0 : err.errMsg) || 'wechat sdk注册错误'}`,
                                tag: {
                                    err,
                                },
                                DFTracer,
                                localServiceName
                            });
                            resolve({
                                code: '22001',
                                errMsg: `Wechat_22001: ${(err === null || err === void 0 ? void 0 : err.errMsg) || 'wechat sdk注册错误'}`,
                            });
                        });
                    }
                }
            }).catch((err) => {
                (0, zipkin_1.setInfoOnline)({
                    title: 'Wechat: 获取微信鉴权配置异常',
                    tag: {
                        err,
                    },
                    DFTracer,
                    localServiceName
                });
                resolve({
                    code: '22003',
                    errMsg: 'Wechat: 获取微信鉴权配置异常',
                });
            });
        })).catch((err) => {
            console.log('loadScript err: ', err);
            (0, zipkin_1.setInfoOnline)({
                title: 'Wechat: sdk加载失败',
                tag: {
                    err,
                },
                DFTracer,
                localServiceName
            });
            resolve({
                code: '22007',
                errMsg: 'Wechat: sdk加载失败',
            });
        });
    });
};
exports.wxRegister = wxRegister;
