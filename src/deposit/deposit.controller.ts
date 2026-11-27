import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { DepositService } from "./deposit.service.js";
import { createDepositSchema, type CreateDepositDto } from "./dto/create-deposit.dto.js";
import { UserGuard } from "../activeUser/user.js";
import { CurrentUser } from "../activeUser/currentUser.js";
import { type UserSession } from "../types/express.js";

@UseGuards(UserGuard)
@Controller("deposit")
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post()
  create(
    @Body({schema: createDepositSchema}) createDepositDto: CreateDepositDto,
    @CurrentUser() req: UserSession,
  ) {
    return this.depositService.create(createDepositDto, req.user.id);
  }
}
