export class VerifyPhoneTelegramCommand {
	constructor(
		public readonly token: string,
		public readonly telegramUserId: number,
		public readonly contactUserId: number,
		public readonly phoneNumber: string,
	) {}
}