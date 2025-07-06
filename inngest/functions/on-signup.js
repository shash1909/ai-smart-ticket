import { inngest } from '../client.js';
import { sendVerificationEmail } from '../../utils/mailer.js';

export const onSignup = inngest.createFunction(
  { id: 'user-signup' },
  { event: 'user/signup' },
  async ({ event, step }) => {
    const { userId, email, name, verificationToken } = event.data;

    await step.run('send-verification-email', async () => {
      const verificationUrl = `${process.env.APP_URL}verify/${verificationToken}`;
      
      await sendVerificationEmail({
        to: email,
        name: name,
        verificationUrl: verificationUrl
      });

      console.log(`Verification email sent to ${email}`);
    });

    return { success: true };
  }
);