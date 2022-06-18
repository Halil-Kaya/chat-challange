import { IsDefined, IsArray } from "class-validator";

export class ChatMessageMakeSeenDto {
  @IsDefined()
  @IsArray()
  messageIds: string[];
}
