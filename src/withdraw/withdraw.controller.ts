import {
  Controller,
  Post,
  Body,
  UseGuards,
  Session,
} from "@nestjs/common";
import { WithdrawService } from "./withdraw.service.js";
import { createWithdrawSchema, type CreateWithdrawDto } from "./dto/create-withdraw.dto.js";
import {UserGuard } from "../activeUser/user.js";
import {type User } from "../types/user.js";

@UseGuards(UserGuard)
@Controller("withdraw")
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

@Post()
create(@Body({schema: createWithdrawSchema}) createWithdrawDto: CreateWithdrawDto, @Session() user: User) {
    return this.withdrawService.create(createWithdrawDto, user);
  }
}
