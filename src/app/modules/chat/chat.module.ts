import { WsJwtGuard } from "@guards/ws.guard";
import { AuthModule } from "@modules/auth/auth.module";
import { ChatGateway } from "@modules/chat/gateways/chat.gateway";
import { ChatService } from "@modules/chat/service/chat.service";
import { UserModule } from "@modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports    : [
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers  : [ ChatGateway, ChatService, WsJwtGuard ],
  exports    : [ ChatGateway ]
})
export class ChatModule {
}