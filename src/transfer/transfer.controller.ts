import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { TransferService } from "./transfer.service.js";
import { CreateTransferDto } from "./dto/create-transfer.dto.js";
import { UserGuard } from "../activeUser/user.js";
import { CurrentUser } from "../activeUser/currentUser.js";
import { type UserSession } from "../types/express.js";

@UseGuards(UserGuard)
@Controller("transfer")
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  create(
    @Body() createTransferDto: CreateTransferDto,
    @CurrentUser() req: UserSession,
  ) {
    return this.transferService.create(createTransferDto);
  }
}
