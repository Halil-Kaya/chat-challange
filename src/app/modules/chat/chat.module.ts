import { WsJwtGuard } from "@guards/ws.guard";
import { AuthModule } from "@modules/auth/auth.module";
import { ChatGateway } from "@modules/chat/gateways/chat.gateway";
import { Relationship, RelationshipSchema } from "@modules/chat/model/relationship";
import { ChatService } from "@modules/chat/service/chat.service";
import { RelationshipService } from "@modules/chat/service/relationship.service";
import { User, UserSchema } from "@modules/user/model/user";
import { UserModule } from "@modules/user/user.module";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports    : [
    MongooseModule.forFeature([
      {
        name: Relationship.name,
        schema: RelationshipSchema,
      }
    ]),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers  : [ ChatGateway, ChatService, WsJwtGuard,RelationshipService ],
  exports    : [ ChatGateway ]
})
export class ChatModule {
}