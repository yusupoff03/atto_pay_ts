"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MailSendingService", {
    enumerable: true,
    get: function() {
        return MailSendingService;
    }
});
const _nodemailer = /*#__PURE__*/ _interop_require_default(require("nodemailer"));
const _CustomError = require("../exceptions/CustomError");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let MailSendingService = class MailSendingService {
    static async mailSender(email, code) {
        const transporter = _nodemailer.default.createTransport({
            service: 'Gmail',
            auth: {
                user: 'yusupovulugbek73@gmail.com',
                pass: 'gbkxvdvhyfhlgiea'
            }
        });
        const mailOptions = {
            from: 'yusupovulugbek73@gmail.com',
            to: email,
            subject: 'Hello from ATTO_PAY. This is your verification code',
            text: code.toString()
        };
        transporter.sendMail(mailOptions, (error, info)=>{
            if (error) {
                throw new _CustomError.CustomError(error.message);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    }
};

//# sourceMappingURL=mailSending.service.js.map