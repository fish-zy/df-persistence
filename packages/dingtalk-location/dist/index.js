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
exports.getDingTalkLocation = void 0;
const dingtalk_register_1 = require("@df-persistence/dingtalk-register");
const zipkin_1 = require("@df-persistence/zipkin");
const getDingTalkLocation = (props) => {
    const { timeout, DFTracer, localServiceName } = props || {};
    return new Promise((resolve, reject) => {
        if (timeout) {
            setTimeout(() => {
                (0, zipkin_1.setInfoOnline)({
                    title: 'DingTalk定位超时',
                    tag: {
                        err: 'DingTalk定位超时',
                    },
                    DFTracer,
                    localServiceName
                });
                reject("DingTalk定位超时");
            }, timeout);
        }
        (0, dingtalk_register_1.dingTalkRegister)(props).then((res) => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            const { dd } = window;
            const { code, errMsg } = res || {};
            if (code == '0') {
                try {
                    dd.device.geolocation.get({
                        targetAccuracy: 200,
                        coordinate: 1,
                        withReGeocode: true,
                        useCache: true,
                        onSuccess: (result) => {
                            const { latitude, longitude } = result;
                            if (latitude && longitude) {
                                (0, zipkin_1.setInfoOnline)({
                                    title: 'DingTalk定位成功',
                                    tag: {
                                        code: 'success',
                                    },
                                    DFTracer,
                                    localServiceName
                                });
                                resolve({
                                    code: '0',
                                    data: {
                                        latitude,
                                        longitude,
                                    },
                                });
                            }
                            else {
                                (0, zipkin_1.setInfoOnline)({
                                    title: 'DingTalk定位没有值',
                                    tag: {
                                        err: { result },
                                    },
                                    DFTracer,
                                    localServiceName
                                });
                                resolve({ code: '23006', errMsg: 'DingTalk定位没有值' });
                            }
                        },
                        onFail: (err) => __awaiter(void 0, void 0, void 0, function* () {
                            (0, zipkin_1.setInfoOnline)({
                                title: 'DingTalk定位失败',
                                tag: {
                                    err,
                                },
                                DFTracer,
                                localServiceName
                            });
                            resolve({ code: '23005', errMsg: `DingTalk: ${err}` || '请重试' });
                        }),
                    });
                }
                catch (error) {
                    (0, zipkin_1.setInfoOnline)({
                        title: 'DingTalk定位异常',
                        tag: {
                            err: error,
                        },
                        DFTracer,
                        localServiceName
                    });
                    reject(error);
                }
            }
            else {
                resolve({ code, errMsg: errMsg });
            }
        })).catch((err) => {
            (0, zipkin_1.setInfoOnline)({
                title: 'DingTalk注册失败',
                tag: {
                    err,
                },
                DFTracer,
                localServiceName
            });
            reject(err);
        });
    });
};
exports.getDingTalkLocation = getDingTalkLocation;
