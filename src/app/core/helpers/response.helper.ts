export interface MetaInterface {
	controller?: any;
	headers: any;
	params: any;
	status: boolean;
	timestamp: Date;
	size: number;
	[key: string]: any;
}

export interface ResponseInterface {
	data: any;
	meta: MetaInterface;
}

export enum DefaultResponse {
  OK = "OK"
}

namespace ResponseHelper {
	export const set = (data: any, meta: MetaInterface | any = null): any => {
		return <ResponseInterface>{
			data: data,
			meta: {
				timestamp: new Date(),
				...meta,
			},
			error: null,
		};
	};
}

export { ResponseHelper };
