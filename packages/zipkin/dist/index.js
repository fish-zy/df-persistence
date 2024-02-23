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
exports.setInfoOnline = void 0;
const utils_1 = require("@df-persistence/utils");
function setInfoOnline(props) {
    const { title, tag, DFTracer, localServiceName } = props;
    console.log(title, 'title-----');
    try {
        //@ts-ignore
        const windowDFTracer = DFTracer || window.DFTracer;
        new Promise((resolve, reject) => {
            //@ts-ignore
            if (!windowDFTracer || typeof DFZipkinCreateWebEntry === 'undefined') {
                console.log('没有调用链，进入搭建阶段');
                (0, utils_1.loadScript)('https://oss-dffl-static.dongfangfuli.com/df-opentelemetry-js/zwe.js')
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    console.log('没有调用链，搭建成功');
                    //@ts-ignore
                    if (typeof DFZipkinCreateWebEntry !== 'undefined') {
                        //@ts-ignore
                        window.DFTracer = DFZipkinCreateWebEntry({
                            // 服务缩写，不能有空格冒号引号等，否则会影响模糊查询，建议使用中划线分割
                            localServiceName: localServiceName || 'df-persistence',
                            // 页面打开或者路由切换后，3秒内的请求都算页面traceId的子集（默认3秒）
                            limit: 3000,
                            // 可选
                            httpLoggerOptions: {
                                // 监控发送的频率。 可选（默认为 1000）
                                httpInterval: 1000
                            },
                        });
                        //@ts-ignore
                        resolve(window.DFTracer);
                    }
                    else {
                        reject('试图搭建调用链失败');
                    }
                })).catch((error) => {
                    console.log(error);
                    reject(error);
                });
            }
            else if (windowDFTracer) {
                resolve(windowDFTracer);
            }
            else {
                reject('其他不在预期的问题');
            }
        }).then((Tracer) => {
            //@ts-ignore
            Tracer === null || Tracer === void 0 ? void 0 : Tracer.local('df-persistence-info', () => {
                // 附带的属性
                if (tag) {
                    //@ts-ignore
                    Tracer === null || Tracer === void 0 ? void 0 : Tracer.setTags(Object.assign(Object.assign({}, tag), { title }));
                }
            });
        }).catch((err) => {
            console.log(err, '上报失败');
        });
    }
    catch (error) {
        console.log(error, '上报失败');
    }
}
exports.setInfoOnline = setInfoOnline;
