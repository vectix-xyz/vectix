import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { authEnvConfig } from '@repo/common/configs';
import { PHONE_VERIFICATION_STATUS } from '@repo/common/constants';
import { Markup, Telegraf } from 'telegraf';

import { PhoneVerificationStorage } from './phone-verification.storage';
import { VerifyPhoneTelegramUseCase } from './verify-phone-telegram.use-case';

@Injectable()
export class TelegramAuthBotService implements OnModuleInit {
  private readonly logger = new Logger(TelegramAuthBotService.name);
  private bot: Telegraf;

  constructor(
    @Inject(authEnvConfig.KEY)
    private readonly authEnv: ConfigType<typeof authEnvConfig>,
    private readonly storage: PhoneVerificationStorage,
    private readonly verifyPhoneUseCase: VerifyPhoneTelegramUseCase,
  ) {
    this.bot = new Telegraf(this.authEnv.telegram.botToken, );
  }

  async onModuleInit() {
    this.registerHandlers();
    this.bot
      .launch()
      .then(() => {
        this.logger.log('🤖 Telegram Verification Bot started successfully');
      })
      .catch(err => {
        this.logger.error(`Failed to start Telegram Bot: ${err.message}`);
      });
  }

  private registerHandlers() {
    this.bot.start(async ctx => {
      const token = ctx.payload;
      if (!token) {
        return ctx.reply(
          '👋 Welcome at Vectix. Please follow the link from the website.',
        );
      }

      const session = await this.storage.getSession(token);
      if (!session || session.status !== PHONE_VERIFICATION_STATUS.PENDING) {
        return ctx.reply(
          '⚠️ Session expired or invalid. Please try again in the app.',
        );
      }

      await this.storage.bindTelegramUserToToken(ctx.from.id, token);

      return ctx.reply(
        `Confirming number for Vectix:\n\nPress the button below to verify your phone number.`,
        Markup.keyboard([
          [Markup.button.contactRequest('📱 Share phone number')],
        ])
          .oneTime()
          .resize(),
      );
    });

    this.bot.on('contact', async ctx => {
      const contact = ctx.message.contact;
      const tgUserId = ctx.from.id;

      const token = await this.storage.getTokenByTelegramUser(tgUserId);

      if (!token) {
        return ctx.reply(
          'Session expired. Please start the process again in the app.',
          Markup.removeKeyboard(),
        );
      }

      try {
        await this.verifyPhoneUseCase.execute({
          token,
          telegramUserId: tgUserId,
          contactUserId: contact.user_id ?? 0,
          phoneNumber: contact.phone_number,
        });

        await ctx.reply(
          '✅ Phone number successfully verified! You can return to the website.',
          Markup.removeKeyboard(),
        );
      } catch (error: any) {
        await ctx.reply(`❌ Error: ${error.message}`, Markup.removeKeyboard());
      }
    });
  }
}
