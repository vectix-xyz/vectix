import { RegisterUseCase } from '@module/application/use-cases';
import { Injectable } from '@nestjs/common';
import {
  AfterHook,
  type AuthHookContext,
  Hook,
  BeforeHook,
} from '@thallesp/nestjs-better-auth';

@Injectable()
@Hook()
export class AuthHook {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  // @BeforeHook('/sign-up/email')
  // async beforeSignUp(context: AuthHookContext) {
  // }

  @AfterHook('/sign-up/email')
  async afterSignUp(context: AuthHookContext) {
    await this.registerUseCase.afterSignUp(context);
  }
}
