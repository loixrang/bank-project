import { Module } from "@nestjs/common";
import { HistoryService } from "./history.service.js";
import { HistoryController } from "./history.controller.js";
import { AuthModule } from "../auth/auth.module.js";
import { AuthService } from "../auth/auth.service.js";

@Module({
  imports: [AuthModule],
  controllers: [HistoryController],
  providers: [HistoryService, AuthService],
})
export class HistoryModule {}
