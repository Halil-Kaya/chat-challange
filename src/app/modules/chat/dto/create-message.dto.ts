import { IsDefined, IsString, MinLength, MaxLength, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class CreateMessageDto {
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  body: string;

  @IsOptional()
  sender: Types.ObjectId;
}