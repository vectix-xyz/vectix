export interface IBaseTemplateParams {
  heading: string;
  email: string;
  subheading: string;
  prefooter: string;
  content: string;
  additionalContent: string | null;
}

export const baseTemplate = ({
  heading,
  email,
  subheading,
  prefooter,
  content,
  additionalContent = null,
}: IBaseTemplateParams) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

                <!-- Header -->
                <tr>
                  <td style="background-color: #0f172a; padding: 32px 48px; display: flex; align-items: center; gap: 12px;">
                    <img
                      src="https://storage.googleapis.com/vectix_bucket/logo.png"
                      alt="Vectix Logo"
                      width="34"
                      height="34"
                      style="display: block; margin-bottom: 16px; border: 0;"
                    />
                    <div style="margin-left: 8px;">
                      <p style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                        Vectix
                      </p>
                      <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">
                        Vectix is a platform for self logistics
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 40px 48px 32px;">
                    <h1 style="margin: 0 0 12px; font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px;">
                      ${heading}
                    </h1>
                    <p style="font-size: 14px; color: #64748b; margin: 0 0 8px;">
                      For account: <strong style="color: #0f172a;">${email}</strong>
                    </p>
                    <p style="margin: 0 0 24px; font-size: 14px; color: #64748b; line-height: 1.5;">
                      ${subheading}
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                      ${content}
                    </table>

                    ${additionalContent}

                    <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                      ${prefooter}
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 48px;">
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0;" />
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 48px 32px;">
                    <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
                      © ${new Date().getFullYear()} Vectix.com · Self Logistics Platform<br/>
                      This is an automated message, please do not reply.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
