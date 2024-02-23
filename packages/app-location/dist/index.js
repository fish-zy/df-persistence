"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppLocation = void 0;
const df_hybrid_1 = require("df_hybrid");
const zipkin_1 = require("@df-persistence/zipkin");
const { DFWLocation, DFWApp } = df_hybrid_1.default;
var AppGetAuthorizedStatusType;
(function (AppGetAuthorizedStatusType) {
    // 相机权限
    AppGetAuthorizedStatusType["Camera"] = "camera";
    // 访问相册权限
    AppGetAuthorizedStatusType["Photo"] = "photo";
    // 麦克风
    AppGetAuthorizedStatusType["Microphone"] = "microphone";
    // 定位
    AppGetAuthorizedStatusType["Location"] = "location";
})(AppGetAuthorizedStatusType || (AppGetAuthorizedStatusType = {}));
const getAppLocation = (props) => {
    const { timeout, DFTracer, localServiceName } = props || {};
    return new Promise((resolve, reject) => {
        if (timeout) {
            setTimeout(() => {
                (0, zipkin_1.setInfoOnline)({
                    title: 'App定位超时',
                    tag: {
                        err: 'App定位超时',
                    },
                    DFTracer,
                    localServiceName
                });
                reject("App定位超时");
            }, timeout);
        }
        DFWApp.appGetAuthorizedStatus({ type: AppGetAuthorizedStatusType.Location }, (res) => {
            if ((res === null || res === void 0 ? void 0 : res.code) == '0') {
                try {
                    DFWLocation.appGetGpsLoc((result) => {
                        const { code, data } = result;
                        if (code == '0') {
                            const { latitude, longitude } = data;
                            if (latitude && longitude) {
                                (0, zipkin_1.setInfoOnline)({
                                    title: 'App定位成功',
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
                                    title: 'APP定位没有值',
                                    tag: {
                                        err: { result },
                                    },
                                    DFTracer,
                                    localServiceName
                                });
                                resolve({ code: '21005', errMsg: 'APP定位没有值' });
                            }
                        }
                        else {
                            (0, zipkin_1.setInfoOnline)({
                                title: 'APP定位失败',
                                tag: {
                                    err: { data },
                                },
                                DFTracer,
                                localServiceName
                            });
                            resolve({ code: '21006', errMsg: 'APP定位失败' });
                        }
                    });
                }
                catch (error) {
                    (0, zipkin_1.setInfoOnline)({
                        title: 'APP定位异常',
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
                (0, zipkin_1.setInfoOnline)({
                    title: '百福得APP 未开启定位授权',
                    tag: {
                        err: { res },
                    },
                    DFTracer,
                    localServiceName
                });
                reject("百福得APP 未开启定位授权");
            }
        });
    });
};
exports.getAppLocation = getAppLocation;
