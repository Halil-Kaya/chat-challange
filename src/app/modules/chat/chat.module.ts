import { AuthModule } from "@modules/auth/auth.module";
import { ChatGateway } from "@modules/chat/chat.gateway";
import { ChatService } from "@modules/chat/service/chat.service";
import { UserModule } from "@modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [ChatGateway,ChatService],
  exports: [ChatGateway]
})
export class ChatModule {
}