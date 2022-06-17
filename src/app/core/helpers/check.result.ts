import { BaseError } from '@errors/base.error';
import { ErrorMessage } from '@errors/error.message';
import { ErrorStatus } from '@errors/error.status';

export enum CheckType {
	IS_TRUE = 'IS_TRUE',
	IS_FALSE = 'IS_FALSE',
	IS_NULL_OR_UNDEFINED = 'IS_NULL_OR_UNDEFINED',
	IS_NOT_NULL_OR_UNDEFINED = 'IS_NOT_NULL_OR_UNDEFINED',
	IS_OBJECT_EMPTY = 'IS_OBJECT_IS_EMPTY',
	IS_AN_NUMBER = 'IS_AN_NUMBER',
	IS_NOT_AN_NUMBER = 'NOT_AN_NUMBER',
	IS_IT_A_NEGATIVE_NUMBER = 'IS_IT_A_NEGATIVE_NUMBER',
	IS_IT_EMPTY_STRING = 'IS_IT_EMPTY_STRING',
}

export function checkResult(
	data: any,
	checkType: CheckType | CheckType[],
	status: ErrorStatus,
	message: ErrorMessage | string,
) {
	const checkTypes = Array.isArray(checkType) ? [...checkType] : [checkType];
	checkTypes.forEach((checkType) => {
		switch (checkType) {
			case CheckType.IS_NULL_OR_UNDEFINED:
				checkConditionAndThrowError(!data, status, message);
				break;
			case CheckType.IS_NOT_NULL_OR_UNDEFINED:
				checkConditionAndThrowError(data, status, message);
				break;
			case CheckType.IS_OBJECT_EMPTY:
				checkConditionAndThrowError(
					!Object.keys(data).length,
					status,
					message,
				);
				break;
			case CheckType.IS_IT_EMPTY_STRING:
				checkConditionAndThrowError(
					typeof data == 'string' && data.length <= 0,
					status,
					message,
				);
				break;
			case CheckType.IS_AN_NUMBER:
				checkConditionAndThrowError(
					typeof data == 'number',
					status,
					message,
				);
				break;
			case CheckType.IS_IT_A_NEGATIVE_NUMBER:
				checkConditionAndThrowError(
					typeof data == 'number' && data < 0,
					status,
					message,
				);
				break;
			case CheckType.IS_NOT_AN_NUMBER:
				checkConditionAndThrowError(isNaN(data), status, message);
				break;
			case CheckType.IS_TRUE:
				checkConditionAndThrowError(data === true, status, message);
				break;
			case CheckType.IS_FALSE:
				checkConditionAndThrowError(data === false, status, message);
				break;
			default:
				throw new BaseError(500, ErrorMessage.ERROR_CHECK_TYPE);
		}
	});
}

function checkConditionAndThrowError(
	condition: boolean,
	status: number,
	message: ErrorMessage | string,
) {
	if (condition) {
		throw new BaseError(status, message);
	}
}
