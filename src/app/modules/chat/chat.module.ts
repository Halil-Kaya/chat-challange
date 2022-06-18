import { WsJwtGuard } from "@guards/ws.guard";
import { AuthModule } from "@modules/auth/auth.module";
import { ChatGateway } from "@modules/chat/gateways/chat.gateway";
import { Message, MessageSchema } from "@modules/chat/model/message";
import { Relationship, RelationshipSchema } from "@modules/chat/model/relationship";
import { ChatService } from "@modules/chat/service/chat.service";
import { MessageService } from "@modules/chat/service/message.service";
import { RelationshipService } from "@modules/chat/service/relationship.service";
import { UserModule } from "@modules/user/user.module";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports    : [
    MongooseModule.forFeature([
      {
        name  : Relationship.name,
        schema: RelationshipSchema
      },
      {
        name  : Message.name,
        schema: MessageSchema
      }
    ]),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers  : [ ChatGateway, ChatService, WsJwtGuard, RelationshipService, MessageService ],
  exports    : [ ChatGateway ]
})
export class ChatModule {
}