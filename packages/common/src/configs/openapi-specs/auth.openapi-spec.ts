/**
 * OpenAPI spec for Auth Service matching the Gateway AuthController API exactly.
 */
export const authServiceFallbackSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Auth Service',
    version: '1.0.0',
    description: 'Authentication service — sign-up, sign-in, password reset',
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints (proxied to auth-service)',
    },
  ],
  paths: {
    '/api/v1/auth/sign-up/email': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user endpoint',
        operationId: 'AuthController_signUp',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/sign-in/email': {
      post: {
        tags: ['Auth'],
        summary: 'Login user endpoint',
        operationId: 'AuthController_signIn',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse',
                },
              },
            },
          },
          '401': {
            description: 'Invalid email or password or user not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Invalid email or password',
                    },
                    code: {
                      type: 'string',
                      example: 'INVALID_EMAIL_OR_PASSWORD',
                    },
                  },
                },
                example: {
                  message: 'Invalid email or password',
                  code: 'INVALID_EMAIL_OR_PASSWORD',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/request-password-reset': {
      post: {
        tags: ['Auth'],
        summary: 'Forgot user password endpoint',
        operationId: 'AuthController_forgetPassword',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ForgetPasswordRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password reset request sent',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ForgetPasswordResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset user password endpoint',
        operationId: 'AuthController_resetPassword',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResetPasswordRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password reset completed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ResetPasswordResponse',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                examples: {
                  invalid_and_expired_token: {
                    summary: 'Invalid or expired token',
                    value: {
                      message: 'Invalid token',
                      code: 'INVALID_TOKEN',
                    },
                  },
                  validation: {
                    summary: 'Validation error',
                    value: {
                      error: 'Bad Request',
                      message: 'Password must be at least 8 characters long',
                      statusCode: 400,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      BA_UserResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'usr_123456789' },
          name: { type: 'string', example: 'John Doe' },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          emailVerified: { type: 'boolean', example: false },
          image: { type: 'string', nullable: true, example: null },
          role: {
            type: 'string',
            enum: ['PASSENGER', 'DRIVER', 'COMPANY', 'ADMIN'],
            example: 'PASSENGER',
          },
          banned: { type: 'boolean', example: false },
          banReason: { type: 'string', nullable: true, example: null },
          banExpires: { type: 'string', nullable: true, example: null },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-08-31T12:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-08-31T12:00:00.000Z',
          },
        },
        required: [
          'id',
          'name',
          'email',
          'emailVerified',
          'role',
          'createdAt',
          'updatedAt',
        ],
      },
      RegisterRequest: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['PASSENGER', 'DRIVER', 'COMPANY'],
            example: 'PASSENGER',
          },
          name: { type: 'string', example: 'John Doe' },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 64,
            example: 'securePassword123',
          },
          companyName: { type: 'string', example: 'My Company' },
          taxCode: { type: 'string', example: '12345678' },
        },
        required: [
          'type',
          'name',
          'email',
          'password',
          'companyName',
          'taxCode',
        ],
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'n4JGynlh1xgvTxfCG8PNCFhdqi84Z0mL',
          },
          user: { $ref: '#/components/schemas/BA_UserResponse' },
        },
        required: ['token', 'user'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          password: { type: 'string', example: 'securePassword123' },
        },
        required: ['email', 'password'],
      },
      LoginResponse: {
        type: 'object',
        properties: {
          redirect: { type: 'boolean', example: false },
          token: {
            type: 'string',
            example: 'n4JGynlh1xgvTxfCG8PNCFhdqi84Z0mL',
          },
          user: { $ref: '#/components/schemas/BA_UserResponse' },
        },
        required: ['redirect', 'token', 'user'],
      },
      ForgetPasswordRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          redirectTo: {
            type: 'string',
            format: 'uri',
            example: 'https://vectix.com/reset-password',
          },
        },
        required: ['email', 'redirectTo'],
      },
      ForgetPasswordResponse: {
        type: 'object',
        properties: {
          status: { type: 'boolean', example: true },
          message: {
            type: 'string',
            example:
              'If this email exists in our system, check your email for the reset link',
          },
        },
        required: ['status', 'message'],
      },
      ResetPasswordRequest: {
        type: 'object',
        properties: {
          newPassword: {
            type: 'string',
            minLength: 8,
            maxLength: 64,
            example: 'newPassword123',
          },
          token: { type: 'string', example: 'token_123456789' },
        },
        required: ['newPassword', 'token'],
      },
      ResetPasswordResponse: {
        type: 'object',
        properties: {
          status: { type: 'boolean', example: true },
        },
        required: ['status'],
      },
    },
  },
} as const;
