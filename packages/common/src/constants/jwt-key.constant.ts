export const JWT_KEYS = {
  ALGORITHMS: {
    RS256: 'RS256',
  },
  EXPIRES_IN: {
    TEN_SECONDS: '10s',
  },
  AUDIENCES: {
    INTERNAL_SERVICES: 'internal-services',
  },
  ISSUERS: {
    GATEWAY: 'api-gateway',
  },
} as const;
