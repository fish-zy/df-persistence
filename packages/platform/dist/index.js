"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platforminfo = exports.nameEnum = void 0;
var nameEnum;
(function (nameEnum) {
    nameEnum["DingTalk"] = "DingTalk";
    nameEnum["Feishu"] = "Feishu";
    nameEnum["App"] = "App";
    nameEnum["WxWork"] = "WxWork";
    nameEnum["WeChat"] = "WeChat";
    nameEnum["MiniProgram"] = "MiniProgram";
})(nameEnum || (exports.nameEnum = nameEnum = {}));
function Platforminfo() {
    const ua = navigator.userAgent;
    let name;
    const isH5 = !!ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    if (ua.indexOf('DingTalk') > -1) { // 钉钉
        name = nameEnum.DingTalk;
    }
    else if (ua.match(/Feishu/)) { // 飞书
        name = nameEnum.Feishu;
    }
    else if (ua.match(/-BFD-APP/) || ua.match(/-MAX-APP/)) { // APP
        name = nameEnum.App;
    }
    else if (ua.match(/wxwork/i)) { // 企业微信
        name = nameEnum.WxWork;
    }
    else if (ua.match(/MicroMessenger\/([\d.]+)/)) { // 微信
        name = nameEnum.WeChat;
    }
    else if (ua.match(/miniProgram/)) { // 小程序
        name = nameEnum.MiniProgram;
    }
    return {
        ua,
        isH5,
        name,
    };
}
exports.platforminfo = Platforminfo();
exports.default = exports.platforminfo;
