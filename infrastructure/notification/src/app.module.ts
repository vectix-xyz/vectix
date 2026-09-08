import { MailModule } from '@mail/mail.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { commonEnvConfig, notificationEnvConfig } from '@repo/common/configs';
import { TModuleImports } from '@repo/common/types';
import { SmsModule } from '@sms/sms.module';

const infrastructure: TModuleImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [commonEnvConfig, notificationEnvConfig],
  }),
];
const modules: TModuleImports = [MailModule, SmsModule];

@Module({
  imports: [...infrastructure, ...modules],
})
export class AppModule {}
