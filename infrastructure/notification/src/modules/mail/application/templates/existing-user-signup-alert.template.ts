import { baseTemplate } from './base.template';

export interface IExistingUserSignUpAlertTemplateParams {
  email: string;
  attemptedAt: string;
  signInUrl?: string;
  resetPasswordUrl?: string;
}

export const existingUserSignUpAlertTemplate = ({
  email,
  attemptedAt,
  signInUrl = 'https://vectix.com/auth/sign-in',
  resetPasswordUrl = 'https://vectix.com/auth/forgot-password',
}: IExistingUserSignUpAlertTemplateParams) => {
  const formattedDate = new Date(attemptedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const content = `
    <tr>
      <td style="padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size: 14px; color: #334155; line-height: 1.6;">
              Someone recently attempted to create a new Vectix account using your email address on <strong>${formattedDate}</strong> UTC.
              <br /><br />
              Since you already have an account, no changes were made to your profile or settings.
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px;">
              <table cellpadding="0" cellspacing="0" style="margin: 0;">
                <tr>
                  <td align="center" style="border-radius: 6px; background-color: #0f172a;">
                    <a
                      href="${signInUrl}"
                      target="_blank"
                      style="display: inline-block; padding: 10px 20px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;"
                    >
                      Sign In to Vectix
                    </a>
                  </td>
                  <td style="padding-left: 12px;">
                    <a
                      href="${resetPasswordUrl}"
                      target="_blank"
                      style="font-size: 14px; font-weight: 500; color: #2563eb; text-decoration: none;"
                    >
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  const additionalContent = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr>
        <td style="font-size: 13px; color: #64748b; line-height: 1.5;">
          If this was you, you can simply sign in or reset your password if you’ve forgotten it.
        </td>
      </tr>
    </table>
  `;

  return {
    subject: 'Sign-up attempt for your Vectix account',
    html: baseTemplate({
      heading: 'Sign-up attempt detected',
      email,
      subheading: 'We detected an attempt to register an account with your email address.',
      content,
      additionalContent,
      prefooter:
        'If you did not attempt this sign-up, you can safely ignore this email. Your password and personal data remain completely secure.',
    }),
  };
};