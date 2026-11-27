import {
  Controller,
  Get,
  Injectable,
  Module,
  StandardSchemaValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WithdrawModule } from "./withdraw/withdraw.module.js";
import { TransferModule } from "./transfer/transfer.module.js";
import { DepositModule } from "./deposit/deposit.module.js";
import { HistoryModule } from "./history/history.module.js";
import { DrizzleModule } from "@nestjs/drizzle";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module.js";
import { database } from "./database/client.js";
import { AuthModule } from "./auth/auth.module.js";
import { CurrentUser } from "./activeUser/currentUser.js";
import cookieParser from "cookie-parser";
import { UserGuard } from "./activeUser/user.js";
import { type UserSession } from "./types/express.js";

@Injectable()
class AppService {
  getHello(): string {
    return "Hello World!";
  }
}

@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(UserGuard)
  @Get("me")
  getMe(@CurrentUser() req: UserSession) {
    return req;
  }
}

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    WithdrawModule,
    TransferModule,
    DepositModule,
    HistoryModule,
    DrizzleModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        db: database,
        connection: config.getOrThrow("DATABASE_URL"),
      }),
    }),
    DatabaseModule,
    AuthModule,
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
