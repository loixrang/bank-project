import { Module } from "@nestjs/common";
import { WithdrawService } from "./withdraw.service.js";
import { WithdrawController } from "./withdraw.controller.js";

@Module({
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {}
