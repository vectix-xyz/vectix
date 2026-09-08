import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, openAPI, twoFactor } from 'better-auth/plugins';

export const auth = betterAuth({
  database: prismaAdapter({}, { provider: 'postgresql' }),
  plugins: [twoFactor({}), admin(), openAPI()],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'PASSENGER',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});

export default auth;
