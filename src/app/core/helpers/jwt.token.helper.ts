import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@source/config/environment';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export interface SignResponse {
	accessToken: string;
	refreshToken: string;
}

@Injectable()
export class JWTTokenHelper {
	private readonly jwtOptions: JwtSignOptions;
	private readonly jwtRefreshTokenOptions: JwtSignOptions;

	constructor(
		private readonly _configService: ConfigService<Environment>,
		private readonly _jwtService: JwtService,
	) {
		this.jwtOptions = {
			secret: _configService.get<string>('JWT_SECRET'),
			expiresIn: _configService.get<string>('JWT_EXPIRES'),
			algorithm: _configService.get('JWT_ALGORITHM'),
		};
		this.jwtRefreshTokenOptions = {
			secret: _configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
			expiresIn: _configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'),
			algorithm: _configService.get('JWT_REFRESH_ALGORITHM'),
		};
	}

	private getTokenForUser(payload: any): SignResponse {
		const accessToken = this._jwtService.sign(payload, this.jwtOptions);
		const refreshToken = this._jwtService.sign(
			payload,
			this.jwtRefreshTokenOptions,
		);
		return {
			accessToken: accessToken,
			refreshToken: refreshToken,
		};
	}

	public signUser(
		user: any,
		role?: string,
	): SignResponse {
		return this.getTokenForUser({
			_id: user._id
		});
	}
}
