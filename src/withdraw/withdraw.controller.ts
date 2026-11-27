import { Controller, Post, Body, UseGuards, Session } from "@nestjs/common";
import { WithdrawService } from "./withdraw.service.js";
import {
  createWithdrawSchema,
  type CreateWithdrawDto,
} from "./dto/create-withdraw.dto.js";
import { UserGuard } from "../activeUser/user.js";
import { type UserSession } from "../types/express.js";
import { CurrentUser } from "../activeUser/currentUser.js";

@UseGuards(UserGuard)
@Controller("withdraw")
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post()
  create(
    @Body({ schema: createWithdrawSchema })
    createWithdrawDto: CreateWithdrawDto,
    @CurrentUser() user: UserSession,
  ) {
    return this.withdrawService.create(createWithdrawDto, user);
  }
}
