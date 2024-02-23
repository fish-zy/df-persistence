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
exports.getWxWorkLocation = void 0;
const wxwork_register_1 = require("@df-persistence/wxwork-register");
const zipkin_1 = require("@df-persistence/zipkin");
const getWxWorkLocation = (props) => {
    const { timeout, DFTracer, localServiceName } = props || {};
    return new Promise((resolve, reject) => {
        if (timeout) {
            setTimeout(() => {
                (0, zipkin_1.setInfoOnline)({
                    title: 'wxWork定位超时',
                    tag: {
                        err: 'wxWork定位超时',
                    },
                    DFTracer,
                    localServiceName
                });
                reject("wxWork定位超时");
            }, timeout);
        }
        return (0, wxwork_register_1.wxWorkRegister)(props).then((res) => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            const { wx } = window;
            const { code, errMsg } = res || {};
            if (code == '0') {
                try {
                    wx.getLocation({
                        type: 'wgs84',
                        success: (result) => {
                            const { latitude, longitude } = result;
                            if (latitude && longitude) {
                                (0, zipkin_1.setInfoOnline)({
                                    title: 'wxWork定位成功',
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
                                    title: 'wxWork定位没有值',
                                    tag: {
                                        err: result,
                                    },
                                    DFTracer,
                                    localServiceName
                                });
                                resolve({ code: '24006', errMsg: 'wxWork定位没有值' });
                            }
                        },
                        fail: (err) => __awaiter(void 0, void 0, void 0, function* () {
                            (0, zipkin_1.setInfoOnline)({
                                title: 'wxWork定位失败',
                                tag: {
                                    err,
                                },
                                DFTracer,
                                localServiceName
                            });
                            resolve({ code: '24005', errMsg: `wxWork: ${err === null || err === void 0 ? void 0 : err.errMsg}` || '请重试' });
                        }),
                    });
                }
                catch (err) {
                    (0, zipkin_1.setInfoOnline)({
                        title: 'wxWork定位异常',
                        tag: {
                            err,
                        },
                        DFTracer,
                        localServiceName
                    });
                    reject(err);
                }
            }
            else {
                resolve({ code, errMsg: errMsg });
            }
        })).catch((err) => {
            (0, zipkin_1.setInfoOnline)({
                title: 'wxWork注册失败',
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
exports.getWxWorkLocation = getWxWorkLocation;
