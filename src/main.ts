import { Controller, Get, Injectable, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WithdrawModule } from "./withdraw/withdraw.module.js";
import { TransferModule } from "./transfer/transfer.module.js";
import { DepositModule } from "./deposit/deposit.module.js";
import { HistoryModule } from "./history/history.module.js";
import { DrizzleModule } from "@nestjs/drizzle";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module.js";
import { database } from "./database/client.js";

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
        connection: config.getOrThrow("process.env.DATABASE_URL"),
      }),
    }),
    DatabaseModule,
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
