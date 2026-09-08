-- CreateEnum
CREATE TYPE "CompanyMemberRole" AS ENUM ('OWNER', 'ADMIN', 'DISPATCHER');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('AT', 'TOV', 'FOP', 'OTHER');

-- CreateEnum
CREATE TYPE "EmployeeCount" AS ENUM ('UP_TO_10', 'UP_TO_50', 'UP_TO_100', 'OVER_100');

-- CreateEnum
CREATE TYPE "TransportRange" AS ENUM ('FROM_1_TO_5', 'FROM_6_TO_15', 'FROM_16_TO_30', 'OVER_30');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('UAH', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'SUBSCRIPTION_PAYMENT', 'TICKET_PURCHASE', 'REFUND');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "catch_phrase" TEXT,
    "bs" TEXT,
    "company_type" "CompanyType" NOT NULL,
    "tax_code" TEXT NOT NULL,
    "founding_year" INTEGER NOT NULL,
    "employee_count" "EmployeeCount" NOT NULL,
    "website" TEXT,
    "transport_count" "TransportRange" NOT NULL,
    "routes_count" "TransportRange" NOT NULL,
    "invercity_transportation" BOOLEAN NOT NULL DEFAULT false,
    "tourists_trips" BOOLEAN NOT NULL DEFAULT false,
    "parcel_delivery" BOOLEAN NOT NULL DEFAULT false,
    "suburban_transportation" BOOLEAN NOT NULL DEFAULT false,
    "corporate_transportation" BOOLEAN NOT NULL DEFAULT false,
    "transfer_airport" BOOLEAN NOT NULL DEFAULT false,
    "join_code" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_addresses" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "suite" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_members" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "role" "CompanyMemberRole" NOT NULL DEFAULT 'DISPATCHER',
    "position" TEXT,
    "active" BOOLEAN DEFAULT false,
    "public_contact" BOOLEAN DEFAULT false,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_points" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_subscriptions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'BASIC',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "included_drivers" INTEGER NOT NULL DEFAULT 2,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_drivers" (
    "subscription_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,

    CONSTRAINT "subscription_drivers_pkey" PRIMARY KEY ("subscription_id","driver_id")
);

-- CreateTable
CREATE TABLE "paydesks" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "main_currency" "Currency" NOT NULL DEFAULT 'UAH',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paydesks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paydesk_balances" (
    "id" TEXT NOT NULL,
    "paydesk_id" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "paydesk_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "paydesk_id" TEXT,
    "type" "TransactionType" NOT NULL,
    "currency" "Currency" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "invoice_id" TEXT,
    "purpose" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coin_balances" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coin_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariffs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT,
    "base_price" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "weight_limit" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "extra_per_kg" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_tax_code_key" ON "companies"("tax_code");

-- CreateIndex
CREATE UNIQUE INDEX "companies_join_code_key" ON "companies"("join_code");

-- CreateIndex
CREATE INDEX "companies_name_idx" ON "companies"("name");

-- CreateIndex
CREATE INDEX "companies_tax_code_idx" ON "companies"("tax_code");

-- CreateIndex
CREATE UNIQUE INDEX "company_addresses_company_id_key" ON "company_addresses"("company_id");

-- CreateIndex
CREATE INDEX "company_addresses_company_id_idx" ON "company_addresses"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_members_user_id_key" ON "company_members"("user_id");

-- CreateIndex
CREATE INDEX "company_members_user_id_idx" ON "company_members"("user_id");

-- CreateIndex
CREATE INDEX "company_members_company_id_idx" ON "company_members"("company_id");

-- CreateIndex
CREATE INDEX "delivery_points_company_id_idx" ON "delivery_points"("company_id");

-- CreateIndex
CREATE INDEX "company_subscriptions_company_id_idx" ON "company_subscriptions"("company_id");

-- CreateIndex
CREATE INDEX "paydesks_company_id_idx" ON "paydesks"("company_id");

-- CreateIndex
CREATE INDEX "paydesk_balances_paydesk_id_currency_idx" ON "paydesk_balances"("paydesk_id", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "paydesk_balances_paydesk_id_currency_key" ON "paydesk_balances"("paydesk_id", "currency");

-- CreateIndex
CREATE INDEX "transactions_company_id_idx" ON "transactions"("company_id");

-- CreateIndex
CREATE INDEX "transactions_paydesk_id_idx" ON "transactions"("paydesk_id");

-- CreateIndex
CREATE INDEX "transactions_invoice_id_idx" ON "transactions"("invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "coin_balances_company_id_key" ON "coin_balances"("company_id");

-- CreateIndex
CREATE INDEX "coin_balances_company_id_idx" ON "coin_balances"("company_id");

-- CreateIndex
CREATE INDEX "tariffs_company_id_idx" ON "tariffs"("company_id");

-- AddForeignKey
ALTER TABLE "company_addresses" ADD CONSTRAINT "company_addresses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_points" ADD CONSTRAINT "delivery_points_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_subscriptions" ADD CONSTRAINT "company_subscriptions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_drivers" ADD CONSTRAINT "subscription_drivers_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "company_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paydesks" ADD CONSTRAINT "paydesks_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paydesk_balances" ADD CONSTRAINT "paydesk_balances_paydesk_id_fkey" FOREIGN KEY ("paydesk_id") REFERENCES "paydesks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_paydesk_id_fkey" FOREIGN KEY ("paydesk_id") REFERENCES "paydesks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coin_balances" ADD CONSTRAINT "coin_balances_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariffs" ADD CONSTRAINT "tariffs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
