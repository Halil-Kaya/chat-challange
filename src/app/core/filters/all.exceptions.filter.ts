import {
  ExceptionFilter,
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { BaseError } from "@errors/base.error";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
            exception instanceof HttpException
              ? exception.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
            exception instanceof Error
              ? exception.message
              : exception.response.error;

    const innerException =
            exception instanceof BaseError
              ? exception.innerException ?? null
              : null;

    this.logger.error(
      `[ERROR:${ status }] ${ message.toUpperCase() }`,
      exception.stack
    );

    response.status(status).json({
      data : null,
      error: {
        statusCode: status,
        timestamp : new Date().toISOString(),
        path      : request.url,
        message   : message,
        innerException
      }
    });
  }
}
