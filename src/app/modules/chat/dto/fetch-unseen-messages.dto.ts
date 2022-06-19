import { PaginationInfo } from "@modules/chat/dto/pagination-info.dto";
import { Message } from "@modules/chat/model/message";

export class FetchUnseenMessagesDto {
  messages: Message[];
  paginationInfo?: PaginationInfo;
}