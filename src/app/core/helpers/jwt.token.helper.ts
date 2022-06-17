import { UserDocument } from "@modules/user/model/user";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@source/config/environment';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export interface SignResponse {
	accessToken: string;
}

@Injectable()
export class JWTTokenHelper {
	private readonly jwtOptions: JwtSignOptions;

	constructor(
		private readonly configService: ConfigService<Environment>,
		private readonly jwtService: JwtService,
	) {
		this.jwtOptions = {
			secret: configService.get<string>('JWT_SECRET'),
			expiresIn: configService.get<string>('JWT_EXPIRES'),
			algorithm: configService.get('JWT_ALGORITHM'),
		};
	}

	private getTokenForUser(payload: any): SignResponse {
		const accessToken = this.jwtService.sign(payload, this.jwtOptions);
		return {
			accessToken: accessToken
		};
	}

	public signUser(
		user: UserDocument
	): SignResponse {
		return this.getTokenForUser({
			_id: user._id
		});
	}
}
