import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type as TransformType } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail as IsEmailValidator,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { ROLES } from '../constants';

export const IsHash = ({ title }: { title: string }) =>
  applyDecorators(
    ApiProperty({
      example: 'n4JGynlh1xgvTxfCG8PNCFhdqi84Z0mL',
    }),
    IsString({ message: `${title} must be a string` }),
  );

export const IsSize = ({ title }: { title: string }) =>
  applyDecorators(
    ApiProperty({
      example: 145,
      description: 'mm',
    }),
    IsNumber({}, { message: `${title} must be a number in mm` }),
  );

export const IsEmbedded = ({ to }: { to: Type }) =>
  applyDecorators(
    ApiProperty({ type: () => to }),
    ValidateNested(),
    TransformType(() => to),
  );

export const IsBool = ({ title }: { title: string }) =>
  applyDecorators(
    ApiProperty({
      example: true,
    }),
    IsBoolean({ message: `${title} must be a boolean` }),
  );

export const IsRole = () =>
  applyDecorators(
    ApiProperty({
      enum: ROLES,
      example: ROLES.PASSENGER,
    }),
    IsEnum(ROLES, { message: 'Invalid role' }),
  );

export const IsName = () =>
  applyDecorators(
    ApiProperty({
      example: 'Peter',
    }),
    MinLength(2, { message: 'Name must be at least 2 characters long' }),
    MaxLength(50, { message: 'Name must be less than 50 characters long' }),
  );

export const IsTitle = () =>
  applyDecorators(
    ApiProperty({
      example: 'Freedom Miro dining table',
    }),
    MinLength(2, { message: 'Title must be at least 2 characters long' }),
    MaxLength(60, { message: 'Title must be less than 60 characters long' }),
  );

export const IsPrice = () =>
  applyDecorators(
    ApiProperty({
      example: 1999.99,
      description: 'Price in UAH',
    }),
    IsNumber({}, { message: 'Price must be a number' }),
    Min(0.01, { message: 'Price must be greater than 0' }),
  );

export const IsStock = () =>
  applyDecorators(
    ApiProperty({
      example: 120,
      description: 'Stock of product',
    }),
    IsNumber({}, { message: 'Stock must be a number' }),
    Min(1, { message: 'Stock must be greater than 0' }),
  );

export const IsMinSellUnits = () =>
  applyDecorators(
    ApiPropertyOptional({
      example: 10,
      nullable: true,
      default: null,
      description: 'Minimum sell units quantity',
    }),
    IsOptional(),
    IsInt({ message: 'Min sell units quantity must be an integer' }),
    Min(1, { message: 'Min sell units quantity must be at least 1' }),
  );

export const IsQuantity = () =>
  applyDecorators(
    ApiPropertyOptional({
      example: 10,
      default: 1,
      description: 'Quantity',
    }),
    IsInt({ message: 'Quantity must be an integer' }),
    Min(1, { message: 'Quantity must be at least 1' }),
  );

export const IsImages = () =>
  applyDecorators(
    ApiProperty({
      example: ['products/abc/image1.png', 'products/abc/image2.png'],
      type: [String],
    }),
    IsArray({ message: 'Images must be an array' }),
    ArrayMinSize(1, { message: 'At least one image is required' }),
    ArrayMaxSize(10, { message: 'Maximum 10 images allowed' }),
    IsString({ each: true, message: 'Each image must be a string' }),
  );

export const IsImage = () =>
  applyDecorators(
    ApiProperty({
      example: 'products/abc/image1.png',
      type: String,
      nullable: true,
    }),
  );

export const IsTerms = () =>
  applyDecorators(
    ApiProperty({
      example: 'company/terms/terms.pdf',
      type: String,
      nullable: true,
    }),
  );

export const IsAddress = () =>
  applyDecorators(
    ApiProperty({
      example: 'Via della Spiga, 15, Milan',
      type: String,
      nullable: true,
    }),
  );

export const IsLeadTime = () =>
  applyDecorators(
    ApiProperty({
      example: '6 - 8 weeks',
      type: String,
      nullable: true,
    }),
  );

// catalog/application/dto/requests/create-product.request.ts
export const IsProductTags = () =>
  applyDecorators(
    ApiProperty({
      example: ['Nordic', 'Scandinavian'],
      type: [String],
      description: 'Tag titles — will be created automatically if not exist',
    }),
    IsArray({ message: 'Tags must be an array' }),
    ArrayMinSize(1, { message: 'At least one tag is required' }),
    IsString({ each: true, message: 'Each tag must be a string' }),
    MinLength(2, {
      each: true,
      message: 'Each tag must be at least 2 characters',
    }),
    MaxLength(50, {
      each: true,
      message: 'Each tag must be less than 50 characters',
    }),
  );

export const IsCategoryId = () =>
  applyDecorators(
    ApiProperty({
      example: 'abc123',
      description: 'Category ID',
    }),
    IsString({ message: 'Category ID must be a string' }),
  );

export const IsVendor = () =>
  applyDecorators(
    ApiProperty({
      example: 'Noble Furniture Co.',
    }),
  );

export const IsVerified = () =>
  applyDecorators(
    ApiProperty({
      example: false,
    }),
  );

export const IsSpaceType = () =>
  applyDecorators(
    ApiProperty({
      example: ['Office', 'House'],
      type: [String],
      description: 'Space titles — will be created automatically if not exist',
    }),
    IsArray({ message: 'Spaces must be an array' }),
    ArrayMinSize(1, { message: 'At least one space is required' }),
    IsString({ each: true, message: 'Each space must be a string' }),
    MinLength(2, {
      each: true,
      message: 'Each space must be at least 2 characters',
    }),
    MaxLength(50, {
      each: true,
      message: 'Each space must be less than 50 characters',
    }),
  );

export const IsEmail = () =>
  applyDecorators(
    ApiProperty({
      example: 'name@company.com',
    }),
    IsEmailValidator({}, { message: 'Invalid email address' }),
    IsNotEmpty({ message: 'Email is required' }),
  );

export const IsPassword = () =>
  applyDecorators(
    ApiProperty({
      example: 'Password123',
    }),
    MinLength(8, { message: 'Password must be at least 8 characters long' }),
    MaxLength(100, {
      message: 'Password must be less than 100 characters long',
    }),
    Matches(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    }),
    Matches(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    }),
    Matches(/[0-9]/, { message: 'Password must contain at least one number' }),
  );

export const IsCompanyName = () =>
  applyDecorators(
    ApiProperty({
      example: 'Apple Inc',
    }),
    MinLength(2, {
      message: 'Company name must be at least 2 characters long',
    }),
    MaxLength(100, {
      message: 'Company name must be less than 100 characters long',
    }),
  );

export const IsTaxCode = () =>
  applyDecorators(
    ApiProperty({
      example: '12345678',
      description: 'EDRPOU: 8 or 10 digits',
    }),
    IsNumberString({}, { message: 'EDRPOU must contain only digits' }),
    MinLength(8, { message: 'EDRPOU must be at least 8 characters long' }),
    MaxLength(10, { message: 'EDRPOU must be less than 10 characters long' }),
  );

export const IsSpecialisations = () =>
  applyDecorators(
    ApiProperty({
      example: ['Interior Design', 'Architecture'],
      type: [String],
    }),
    IsArray({
      message: 'Specialisations must be an array of strings',
    }),
    IsString({
      each: true,
      message: 'Each specialisation must be a string',
    }),
    MinLength(2, {
      each: true,
      message: 'Each specialisation must be at least 2 characters long',
    }),
    MaxLength(100, {
      each: true,
      message: 'Each specialisation must be less than 100 characters long',
    }),
  );

export const IsDate = () =>
  applyDecorators(
    ApiProperty({
      example: '2026-03-21T21:30:00.000Z',
    }),
  );

export const IsAbbreviation = () =>
  applyDecorators(
    ApiProperty({
      example: 'HC',
      description: 'Like company name, was HruCorp, abbreviation will be HC',
    }),
  );

export const IsSku = () =>
  applyDecorators(
    ApiProperty({
      example: 'GYP6-0000BKJ9NTNBR002-HC',
      description:
        'SKU of product, GYP6-<hash of name and price>NBR<sequence>-<manufacturerCode>',
    }),
  );

export const IsDescription = () =>
  applyDecorators(
    ApiProperty({
      example: 'Some text about something',
      nullable: true,
      description: 'description',
    }),
    IsString({ message: 'Description must be a string' }),
  );

export const IsUserImage = () =>
  applyDecorators(
    ApiProperty({
      example: 'user/<user-id>/profile.png',
      nullable: true,
      default: null,
    }),
  );

export const IsCompanyImage = () =>
  applyDecorators(
    ApiPropertyOptional({
      example: 'company/<company-id>/logo.png',
      nullable: true,
      default: null,
    }),
  );

export const IsBanReason = () =>
  applyDecorators(
    ApiProperty({
      example: "Cause you've been used hate-speach",
      nullable: true,
      default: null,
    }),
  );

export const IsBanExpires = () =>
  applyDecorators(
    ApiProperty({
      example: '2026-03-21T21:30:00.000Z',
      nullable: true,
      default: null,
    }),
  );

export const IsCompanyDescription = () =>
  applyDecorators(
    ApiPropertyOptional({
      example: 'We sell furniture',
      nullable: true,
      default: null,
    }),
  );

export const IsCompanyTerms = () =>
  applyDecorators(
    ApiPropertyOptional({
      example: 'Our terms...',
      nullable: true,
      default: null,
    }),
  );

export const IsRatingAvg = () =>
  applyDecorators(
    ApiProperty({
      example: 4.5,
    }),
  );

export const IsCompanyRatingAvg = () =>
  applyDecorators(
    ApiProperty({
      example: 4.5,
    }),
  );

export const IsCompanyRatingCount = () =>
  applyDecorators(
    ApiProperty({
      example: 0,
    }),
  );

export const IsOtpCode = () =>
  applyDecorators(
    ApiProperty({
      example: '123456',
    }),
    IsString({ message: 'Code must be a string' }),
    Length(6, 6, { message: 'Code must be exactly 6 characters' }),
  );

export const IsPriceSnapshot = () =>
  applyDecorators(
    ApiProperty({ example: 1450.5, description: 'Price snapshot in UAH' }),
    IsNumber({}, { message: 'Price snapshot must be a number' }),
    Min(0.01),
  );

export const IsLink = () =>
  applyDecorators(
    ApiProperty({
      example: 'http://localhost:3000/auth/reset-password',
    }),
    IsUrl(
      {
        require_tld: false, // Дозволяє localhost без .com/.net
        require_protocol: true, // Обов'язково http:// або https://
        allow_underscores: true,
      },
      { message: 'Invalid URL' },
    ),
    // note: in prod change to real domen, not localhost
    Matches(/^(http:\/\/localhost:3000|https:\/\/your-app\.com)/, {
      message: 'Redirect URL is not allowed',
    }),
  );

export const IsNullableString = ({
  example,
  description,
}: {
  example: string;
  description?: string;
}) =>
  applyDecorators(
    ApiProperty({
      example,
      description,
      nullable: true,
      default: null,
    }),
  );

export const IsSlug = () => applyDecorators(ApiProperty({ example: 'nordic' }));
