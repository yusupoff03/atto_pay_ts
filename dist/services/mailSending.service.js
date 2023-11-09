"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailSendingService = void 0;
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
class MailSendingService {
    static async mailSender(email, code) {
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: 'yusupovulugbek73@gmail.com',
                pass: 'gbkxvdvhyfhlgiea',
            },
        });
        const mailOptions = {
            from: 'yusupovulugbek73@gmail.com',
            to: email,
            subject: 'Hello from ATTO_PAY. This is your verification code',
            text: code.toString(),
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
            }
            else {
                console.log('Email sent:', info.response);
            }
        });
    }
}
exports.MailSendingService = MailSendingService;
//# sourceMappingURL=mailSending.service.js.map