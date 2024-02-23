"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRegister = void 0;
const platform_1 = require("@df-persistence/platform");
const dingtalk_register_1 = require("@df-persistence/dingtalk-register");
const wx_register_1 = require("@df-persistence/wx-register");
const wxwork_register_1 = require("@df-persistence/wxwork-register");
const zipkin_1 = require("@df-persistence/zipkin");
const toRegister = (props) => {
    const { name } = platform_1.default;
    const { DFTracer, localServiceName } = props || {};
    return new Promise((resolve, reject) => {
        switch (name) {
            case platform_1.nameEnum.DingTalk:
                (0, dingtalk_register_1.dingTalkRegister)(props).then((res) => { resolve(res); }).catch((err) => { reject(err); });
                break;
            case platform_1.nameEnum.MiniProgram:
            // case nameEnum.WxWork:
            case platform_1.nameEnum.WeChat:
                (0, wx_register_1.wxRegister)(props).then((res) => { resolve(res); }).catch((err) => { reject(err); });
                break;
            case platform_1.nameEnum.WxWork:
                (0, wxwork_register_1.wxWorkRegister)(props).then((res) => { resolve(res); }).catch((err) => { reject(err); });
                break;
            default:
                (0, zipkin_1.setInfoOnline)({
                    title: '暂不支持其他平台的注册',
                    tag: {
                        err: { msg: '暂不支持其他平台的注册' },
                    },
                    DFTracer,
                    localServiceName
                });
                resolve({ code: '-1', errMsg: '暂不支持其他平台的注册' });
        }
    });
};
exports.toRegister = toRegister;
