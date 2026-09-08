// ⚠️ AUTOMATIC GENERATED. DO NOT EDIT!

export const Role = {
  PASSENGER: 'PASSENGER',
  DRIVER: 'DRIVER',
  COMPANY: 'COMPANY',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const AdminLevel = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPPORT: 'SUPPORT',
  MODERATOR: 'MODERATOR',
} as const;

export type AdminLevel = (typeof AdminLevel)[keyof typeof AdminLevel];

export const CompanyMemberRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  DISPATCHER: 'DISPATCHER',
} as const;

export type CompanyMemberRole =
  (typeof CompanyMemberRole)[keyof typeof CompanyMemberRole];

export const CompanyType = {
  AT: 'AT',
  TOV: 'TOV',
  FOP: 'FOP',
  OTHER: 'OTHER',
} as const;

export type CompanyType = (typeof CompanyType)[keyof typeof CompanyType];

export const EmployeeCount = {
  UP_TO_10: 'UP_TO_10',
  UP_TO_50: 'UP_TO_50',
  UP_TO_100: 'UP_TO_100',
  OVER_100: 'OVER_100',
} as const;

export type EmployeeCount = (typeof EmployeeCount)[keyof typeof EmployeeCount];

export const TransportRange = {
  FROM_1_TO_5: 'FROM_1_TO_5',
  FROM_6_TO_15: 'FROM_6_TO_15',
  FROM_16_TO_30: 'FROM_16_TO_30',
  OVER_30: 'OVER_30',
} as const;

export type TransportRange =
  (typeof TransportRange)[keyof typeof TransportRange];

export const DriverStatus = {
  ON_THE_WAY: 'ON_THE_WAY',
  FREE: 'FREE',
  PENDING: 'PENDING',
} as const;

export type DriverStatus = (typeof DriverStatus)[keyof typeof DriverStatus];

export const DriverType = {
  SELF_EMPLOYED: 'SELF_EMPLOYED',
  COMPANY_DRIVER: 'COMPANY_DRIVER',
} as const;

export type DriverType = (typeof DriverType)[keyof typeof DriverType];

export const VehicleFeature = {
  AIR_CONDITIONING: 'AIR_CONDITIONING',
  CHARGING_CAPABILITIES: 'CHARGING_CAPABILITIES',
  WIFI: 'WIFI',
  TV: 'TV',
  TOILET: 'TOILET',
  WHEELCHAIR_ACCESS: 'WHEELCHAIR_ACCESS',
  AUDIO_SYSTEM: 'AUDIO_SYSTEM',
  BAGGAGE_COMPARTMENT: 'BAGGAGE_COMPARTMENT',
} as const;

export type VehicleFeature =
  (typeof VehicleFeature)[keyof typeof VehicleFeature];

export const FuelType = {
  PETROL: 'PETROL',
  DIESEL: 'DIESEL',
  ELECTRIC: 'ELECTRIC',
  HYBRID: 'HYBRID',
} as const;

export type FuelType = (typeof FuelType)[keyof typeof FuelType];

export const TransmissionType = {
  MANUAL: 'MANUAL',
  AUTOMATIC: 'AUTOMATIC',
  SEMI_AUTOMATIC: 'SEMI_AUTOMATIC',
} as const;

export type TransmissionType =
  (typeof TransmissionType)[keyof typeof TransmissionType];

export const TechnicalCondition = {
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD',
  SATISFACTORY: 'SATISFACTORY',
  POOR: 'POOR',
} as const;

export type TechnicalCondition =
  (typeof TechnicalCondition)[keyof typeof TechnicalCondition];

export const RoutePointType = {
  START: 'START',
  INTERMEDIATE: 'INTERMEDIATE',
  END: 'END',
} as const;

export type RoutePointType =
  (typeof RoutePointType)[keyof typeof RoutePointType];

export const TripStatus = {
  PLANNED: 'PLANNED',
  ON_THE_WAY: 'ON_THE_WAY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type TripStatus = (typeof TripStatus)[keyof typeof TripStatus];

export const TripStopStatus = {
  PLANNED: 'PLANNED',
  COMPLETED: 'COMPLETED',
} as const;

export type TripStopStatus =
  (typeof TripStopStatus)[keyof typeof TripStopStatus];

export const TripItemType = {
  PASSENGER: 'PASSENGER',
  PACKAGE: 'PACKAGE',
  PASSENGER_WITH_PACKAGE: 'PASSENGER_WITH_PACKAGE',
} as const;

export type TripItemType = (typeof TripItemType)[keyof typeof TripItemType];

export const Currency = {
  UAH: 'UAH',
  USD: 'USD',
  EUR: 'EUR',
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export const TicketStatus = {
  ACTIVE: 'ACTIVE',
  USED: 'USED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const PackageStatus = {
  WAITING: 'WAITING',
  TAKEN: 'TAKEN',
  ON_THE_WAY: 'ON_THE_WAY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type PackageStatus = (typeof PackageStatus)[keyof typeof PackageStatus];

export const SubscriptionPlan = {
  BASIC: 'BASIC',
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM',
} as const;

export type SubscriptionPlan =
  (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];

export const TransactionType = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  SUBSCRIPTION_PAYMENT: 'SUBSCRIPTION_PAYMENT',
  TICKET_PURCHASE: 'TICKET_PURCHASE',
  REFUND: 'REFUND',
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];
export const OutboxStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED',
} as const;

export type OutboxStatus = (typeof OutboxStatus)[keyof typeof OutboxStatus];

export const OutboxTransportType = {
  EMIT: 'EMIT',
  SEND: 'SEND',
} as const;

export type OutboxTransportType =
  (typeof OutboxTransportType)[keyof typeof OutboxTransportType];
