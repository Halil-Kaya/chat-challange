import { ErrorMessage } from '@errors/error.message';
import { ErrorStatus } from '@errors/error.status';

export class BaseError extends Error {
	constructor(
		public status: ErrorStatus = ErrorStatus.BAD_REQUEST,
		public message: string = ErrorMessage.UNEXPECTED,
		public innerException: Error = null,
	) {
		super();
		Error.apply(this, arguments);
	}
}
