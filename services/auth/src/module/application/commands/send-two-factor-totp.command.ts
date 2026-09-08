export class SendTwoFactorTotpCommand {
	constructor (
		public readonly userId: string,
		public readonly email: string,
		public readonly totp: string,
	) {}
}