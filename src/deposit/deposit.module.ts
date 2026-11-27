import { Module } from "@nestjs/common";
import { DepositService } from "./deposit.service.js";
import { DepositController } from "./deposit.controller.js";
import { AuthModule } from "../auth/auth.module.js";
import { AuthService } from "../auth/auth.service.js";

@Module({
  imports: [AuthModule],
  controllers: [DepositController],
  providers: [DepositService, AuthService],
})
export class DepositModule {}
