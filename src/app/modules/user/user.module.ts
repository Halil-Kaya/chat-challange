import { UserController } from "@modules/user/controller/user.controller";
import { User, UserSchema } from "@modules/user/model/user";
import { UserService } from "@modules/user/service/user.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      }
    ]),
  ],
  controllers: [ UserController ],
  providers: [ UserService ],
  exports: [ UserService ]
})
export class UserModule {
}
