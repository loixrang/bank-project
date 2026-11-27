import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { TransferService } from "./transfer.service.js";
import {
  createTransferSchema,
  type CreateTransferDto,
} from "./dto/create-transfer.dto.js";
import { UserGuard } from "../activeUser/user.js";
import { CurrentUser } from "../activeUser/currentUser.js";
import { type UserSession } from "../types/express.js";
import {
  verifyAcountSchema,
  type VerifyAccountDto,
} from "./dto/verify-account.dto.js";

@UseGuards(UserGuard)
@Controller("transfer")
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  create(
    @Body({ schema: createTransferSchema })
    createTransferDto: CreateTransferDto,
    @CurrentUser() req: UserSession,
  ) {
    return this.transferService.create(createTransferDto, req);
  }

  @Post("verify")
  verify(@Body({ schema: verifyAcountSchema }) dto: VerifyAccountDto) {
    return this.transferService.verify(dto);
  }
}
