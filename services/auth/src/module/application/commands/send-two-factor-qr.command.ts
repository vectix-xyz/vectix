export class SendTwoFactorQrCommand {
	constructor (
		public readonly userId: string,
		public readonly email: string,
		public readonly totpUri: string,
		public readonly backupCodes?: string[],
	) {}
}