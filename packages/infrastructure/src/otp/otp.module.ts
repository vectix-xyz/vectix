import { Global, Module } from '@nestjs/common';
import { TModuleProviders } from '@repo/common/types';

import { OtpService } from './otp.service';

const services: TModuleProviders = [OtpService];

@Global()
@Module({
  providers: [...services],
  exports: [...services],
})
export class OtpModule {}
