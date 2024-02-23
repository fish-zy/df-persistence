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
exports.wxWorkRegister = void 0;
const axios_1 = require("axios");
const utils_1 = require("@df-persistence/utils");
const zipkin_1 = require("@df-persistence/zipkin");
const wxWorkRegister = (props) => {
    const { jsApiList, registerUrl, onRegisterBefore, DFTracer, localServiceName, domain } = props || {};
    const jsApiListTarget = jsApiList || [
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
    ];
    const pinUrl = domain ? `${domain}${utils_1.DDAndQWRegisterPath}` : utils_1.DDAndQWRegisterPath;
    const domainUrl = registerUrl || pinUrl;
    onRegisterBefore && onRegisterBefore();
    return new Promise((resolve, reject) => {
        (0, utils_1.loadScript)('//res.wx.qq.com/open/js/jweixin-1.6.0.js', 'wx')
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            //@ts-ignore
            const wx = window === null || window === void 0 ? void 0 : window.wx;
            const url = window.location.href.split('#')[0];
            axios_1.default.post(domainUrl, {
                platformCode: 'QW',
                url,
            }).then((res) => {
                const { code, data: thisData, msg } = res === null || res === void 0 ? void 0 : res.data;
                const data = thisData && typeof thisData == 'string' ? JSON.parse(thisData) : thisData;
                console.log(code, wx, data, msg, res, '获取企业微信鉴权-----------');
                if (code != 0) {
                    (0, zipkin_1.setInfoOnline)({
                        title: 'wxWork: 获取企业微信鉴权配置失败',
                        tag: {
                            err: { msg },
                        },
                        DFTracer,
                        localServiceName
                    });
                    resolve({
                        code: '24002',
                        errMsg: 'wxWork: 获取企业微信鉴权配置失败',
                    });
                }
                else if (data === null) {
                    (0, zipkin_1.setInfoOnline)({
                        title: 'wxWork: 获取企业微信鉴权配置为空',
                        tag: {
                            error: { msg: 'wxWork: 获取企业微信鉴权配置为空' },
                        },
                        DFTracer,
                        localServiceName
                    });
                    resolve({
                        code: '2400null',
                        errMsg: 'wxWork: 获取企业微信鉴权配置为空',
                    });
                }
                else {
                    (0, zipkin_1.setInfoOnline)({
                        title: 'wxWork: 获取企业微信鉴权配置 成功',
                        tag: {
                            code: 'success',
                        },
                        DFTracer,
                        localServiceName
                    });
                    wx.config({
                        beta: true,
                        debug: false,
                        appId: data === null || data === void 0 ? void 0 : data.corpId,
                        timestamp: data === null || data === void 0 ? void 0 : data.timeStamp,
                        nonceStr: data === null || data === void 0 ? void 0 : data.nonceStr,
                        signature: data === null || data === void 0 ? void 0 : data.signature,
                        jsApiList: jsApiListTarget, // 必填，需要使用的JS接口列表
                    });
                    wx.ready(() => {
                        console.log('wxWork 成功');
                        (0, zipkin_1.setInfoOnline)({
                            title: 'wxWork注册 成功',
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
                            title: `wxWork_24001: ${(err === null || err === void 0 ? void 0 : err.errMsg) || 'wxWork sdk注册错误'}`,
                            tag: {
                                err,
                            },
                            DFTracer,
                            localServiceName
                        });
                        resolve({
                            code: '24001',
                            errMsg: `wxWork_24001: ${(err === null || err === void 0 ? void 0 : err.errMsg) || 'wxWork sdk注册错误'}`,
                        });
                    });
                }
            }).catch((err) => {
                console.log('loadScript err: ', err);
                (0, zipkin_1.setInfoOnline)({
                    title: 'wxWork: 获取企业微信鉴权配置异常',
                    tag: {
                        err,
                    },
                    DFTracer,
                    localServiceName
                });
                resolve({
                    code: '24003',
                    errMsg: 'wxWork: 获取企业微信鉴权配置异常',
                });
            });
        })).catch((err) => {
            console.log('loadScript err: ', err);
            (0, zipkin_1.setInfoOnline)({
                title: 'wxWork: sdk加载失败',
                tag: {
                    err,
                },
                DFTracer,
                localServiceName
            });
            resolve({
                code: '24004',
                errMsg: 'wxWork: sdk加载失败',
            });
        });
    });
};
exports.wxWorkRegister = wxWorkRegister;
