import { Module } from "@nestjs/common";
import { TransferService } from "./transfer.service.js";
import { TransferController } from "./transfer.controller.js";
import { AuthModule } from "../auth/auth.module.js";
import { AuthService } from "../auth/auth.service.js";

@Module({
  imports: [AuthModule],
  controllers: [TransferController],
  providers: [TransferService, AuthService],
})
export class TransferModule {}
