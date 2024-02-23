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
exports.dingTalkRegister = void 0;
/* eslint-disable indent */
const axios_1 = require("axios");
const utils_1 = require("@df-persistence/utils");
const zipkin_1 = require("@df-persistence/zipkin");
const dingTalkRegister = (props) => {
    const { jsApiList, registerUrl, onRegisterBefore, DFTracer, localServiceName, domain } = props || {};
    const jsApiListTarget = jsApiList || [
        'runtime.info',
        'biz.contact.choose',
        'device.notification.confirm',
        'device.notification.alert',
        'device.notification.prompt',
        'biz.ding.post',
        'device.geolocation.get',
        "device.geolocation.checkPermission",
    ];
    const pinUrl = domain ? `${domain}${utils_1.DDAndQWRegisterPath}` : utils_1.DDAndQWRegisterPath;
    const domainUrl = registerUrl || pinUrl;
    onRegisterBefore && onRegisterBefore();
    return new Promise((resolve, reject) => {
        (0, utils_1.loadScript)('//g.alicdn.com/dingding/dingtalk-jsapi/2.10.3/dingtalk.open.js', 'dd')
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            const { dd } = window;
            const url = window.location.href.split('#')[0];
            axios_1.default.post(domainUrl, {
                platformCode: 'DD',
                url,
            }).then((res) => {
                const { code, data: thisData, msg } = res === null || res === void 0 ? void 0 : res.data;
                const data = thisData && typeof thisData == 'string' ? JSON.parse(thisData) : thisData;
                if (code === "0") {
                    (0, zipkin_1.setInfoOnline)({
                        title: '获取DingTalk鉴权配置 成功',
                        tag: {
                            code: 'success',
                        },
                        DFTracer,
                        localServiceName
                    });
                    dd.config({
                        agentId: data === null || data === void 0 ? void 0 : data.agentId,
                        corpId: data === null || data === void 0 ? void 0 : data.corpId,
                        timeStamp: data === null || data === void 0 ? void 0 : data.timeStamp,
                        nonceStr: data === null || data === void 0 ? void 0 : data.nonceStr,
                        signature: data === null || data === void 0 ? void 0 : data.signature,
                        jsApiList: jsApiListTarget,
                    });
                    dd.ready(() => {
                        console.log('DingTalk注册 成功');
                        (0, zipkin_1.setInfoOnline)({
                            title: 'DingTalk注册 成功',
                            tag: {
                                code: 'success',
                            },
                            DFTracer,
                            localServiceName
                        });
                        resolve({ code: '0', data: true });
                    });
                    dd.error((err) => {
                        (0, zipkin_1.setInfoOnline)({
                            title: `DingTalk_24001: ${(err === null || err === void 0 ? void 0 : err.errMsg) || 'DingTalksdk注册错误'}`,
                            tag: {
                                err,
                            },
                            DFTracer,
                            localServiceName
                        });
                        resolve({
                            code: '24001',
                            errMsg: `DingTalk_24001: ${(err === null || err === void 0 ? void 0 : err.errMsg) || 'DingTalksdk注册错误'}`,
                        });
                    });
                }
                else {
                    (0, zipkin_1.setInfoOnline)({
                        title: 'DingTalk: 获取钉钉鉴权配置失败',
                        tag: {
                            err: { msg },
                        },
                        DFTracer,
                        localServiceName
                    });
                    resolve({
                        code: '24002',
                        errMsg: 'DingTalk: 获取钉钉鉴权配置失败',
                    });
                }
            })
                .catch((err) => {
                (0, zipkin_1.setInfoOnline)({
                    title: 'DingTalk: 获取钉钉签名失败',
                    tag: {
                        err,
                    },
                    DFTracer,
                    localServiceName
                });
                resolve({
                    code: '23002',
                    errMsg: 'DingTalk: 获取钉钉签名失败',
                });
            });
        })).catch((err) => {
            console.log('loadScript err: ', err);
            (0, zipkin_1.setInfoOnline)({
                title: 'DingTalk: sdk加载失败',
                tag: {
                    err,
                },
                DFTracer,
                localServiceName
            });
            resolve({
                code: '23003',
                errMsg: 'DingTalk: sdk加载失败',
            });
        });
    });
};
exports.dingTalkRegister = dingTalkRegister;
