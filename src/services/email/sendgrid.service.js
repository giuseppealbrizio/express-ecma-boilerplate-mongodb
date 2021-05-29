import MailService from '@sendgrid/mail';
import { ApplicationError } from '../../helpers/errors.helper';

MailService.setApiKey(process.env.SENDGRID_API_KEY);

export default {
  sendTestEmail: async () => {
    try {
      const msg = {
        to: process.env.SENDGRID_SENDER_EMAIL,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'This is a test email',
        text: 'This is a test email',
      };
      return await MailService.send(msg);
    } catch (error) {
      throw new Error(error);
    }
  },
  sendResetPasswordToken: async (email, token) => {
    try {
      const msg = {
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'Password change request',
        text: `Hi user, this is the token you need ${token}`,
      };
      return await MailService.send(msg);
    } catch (error) {
      throw new ApplicationError(400, error, error.message);
    }
  },
};
