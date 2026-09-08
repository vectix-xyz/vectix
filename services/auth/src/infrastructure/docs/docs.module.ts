import { Module } from '@nestjs/common';
import { TModuleControllers } from '@repo/common/types';

import { DocsController } from './docs.controller';

const controllers: TModuleControllers = [DocsController];

@Module({
  controllers: [...controllers],
})
export class DocsModule {}
