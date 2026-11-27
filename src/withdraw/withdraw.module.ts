import { Module } from "@nestjs/common";
import { WithdrawService } from "./withdraw.service.js";
import { WithdrawController } from "./withdraw.controller.js";
import { AuthService } from "../auth/auth.service.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
  imports: [AuthModule],
  controllers: [WithdrawController],
  providers: [WithdrawService, AuthService],
})
export class WithdrawModule {}
