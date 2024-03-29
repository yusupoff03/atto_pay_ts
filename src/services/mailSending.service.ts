import nodemailer from 'nodemailer';
import { CustomError } from '@exceptions/CustomError';
export class MailSendingService {
  public static async mailSender(email, code) {
    const transporter = nodemailer.createTransport({
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
    transporter.sendMail(
      mailOptions,

      (error, info) => {
        if (error) {
          throw new CustomError(error.message);
        } else {
          console.log('Email sent:', info.response);
        }
      },
    );
  }
}
