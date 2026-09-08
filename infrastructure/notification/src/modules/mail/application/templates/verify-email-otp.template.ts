import { baseTemplate } from './base.template';

export interface IVerifyEmailOtpTemplateParams {
  code: string;
  email: string;
}

export const verifyEmailOtpTemplate = ({
  code,
  email,
}: IVerifyEmailOtpTemplateParams) => ({
  subject: 'Verify Your Email | Vectix',
  html: baseTemplate({
    heading: 'Verify your email',
    email,
    subheading: 'Use the code below to confirm your email address.',
    content: `
			<tr>
				<td align="center" style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 28px;">
					<p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase;">
						Verification Code
					</p>
					<p style="margin: 0; font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #0f172a; font-family: 'Courier New', monospace;">
						${code}
					</p>
					<p style="font-size:12px;color:#94a3b8;margin:10px 0 0 0;">
						Expires in <strong style="color:#64748b;">5 minutes</strong>
					</p>
				</td>
			</tr>
		`,
    prefooter:
      'If you did not create an account on Vectix, you can safely ignore this email.',
		additionalContent: null,
  }),
});
