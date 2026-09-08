import { baseTemplate } from './base.template';

export interface ITwoFactorQrTemplateParams {
  email: string;
  qrCodeDataUrl: string;
  backupCodes: string[];
}

export const twoFactorQrTemplate = ({
  email,
  qrCodeDataUrl,
  backupCodes,
}: ITwoFactorQrTemplateParams) => {
  const renderedBackupCodes = backupCodes
    .map(
      code => `
        <span style="
          display: inline-block;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          background: #e2e8f0;
          padding: 4px 8px;
          border-radius: 4px;
          margin: 3px;
          letter-spacing: 1px;
        ">${code}</span>`,
    )
    .join('');

  return {
    subject: 'Setup Two-Factor Authentication (2FA) | Vectix',
    html: baseTemplate({
      heading: 'Set up two-factor authentication',
      email,
      subheading:
        'Scan the QR code below using your authenticator app (Google Authenticator, Apple Passwords, 1Password, etc.) to complete setup.',
      content: `
        <tr>
          <td align="center" style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 24px;">
            <div style="background: #ffffff; padding: 12px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              <img src=${qrCodeDataUrl} alt="2FA QR Code" width="180" height="180" style="display: block; border: 0;" />
              </div>
            <p style="margin: 12px 0 0; font-size: 12px; color: #94a3b8;">
              Scan via Authenticator App
            </p>
          </td>
        </tr>
      `,
      prefooter:
        'If you did not request this configuration, immediately change your Vectix password and check your active sessions.',
      additionalContent: `
        <!-- Backup Codes Section -->
        ${
          backupCodes.length > 0
            ? `
              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #475569;">
                  Backup Recovery Codes
                </p>
                <p style="margin: 0 0 12px; font-size: 12px; color: #64748b; line-height: 1.4;">
                  Save these one-time codes in a safe place. You can use them if you lose access to your authenticator app.
                </p>
                <div style="text-align: center;">
                  ${renderedBackupCodes}
                </div>
              </div>
            `
            : ''
        }
      `,
    }),
  };
};
