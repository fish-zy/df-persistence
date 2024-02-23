"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocation = void 0;
const platform_1 = require("@df-persistence/platform");
const dingtalk_location_1 = require("@df-persistence/dingtalk-location");
const app_location_1 = require("@df-persistence/app-location");
const wx_location_1 = require("@df-persistence/wx-location");
const wxwork_location_1 = require("@df-persistence/wxwork-location");
const zipkin_1 = require("@df-persistence/zipkin");
const getLocation = (props) => {
    const { name } = platform_1.default;
    const { DFTracer, localServiceName } = props || {};
    return new Promise((resolve, reject) => {
        switch (name) {
            case platform_1.nameEnum.DingTalk:
                (0, dingtalk_location_1.getDingTalkLocation)(props).then((res) => { resolve(res); }).catch((err) => { reject(err); });
                break;
            case platform_1.nameEnum.MiniProgram:
            // case nameEnum.WxWork:
            case platform_1.nameEnum.WeChat:
                (0, wx_location_1.getWechatLocation)(props).then((res) => { resolve(res); }).catch((err) => { reject(err); });
                break;
            case platform_1.nameEnum.WxWork:
                (0, wxwork_location_1.getWxWorkLocation)(props).then((res) => { resolve(res); }).catch((err) => { reject(err); });
                break;
            case platform_1.nameEnum.App:
                (0, app_location_1.getAppLocation)(props).then((res) => { resolve(res); }).catch((err) => { reject(err); });
                break;
            default:
                (0, zipkin_1.setInfoOnline)({
                    title: '暂不支持其他平台的定位',
                    tag: {
                        err: { msg: '暂不支持其他平台的定位' },
                    },
                    DFTracer,
                    localServiceName
                });
                resolve({ code: '-1', errMsg: '暂不支持其他平台的定位' });
        }
    });
};
exports.getLocation = getLocation;
