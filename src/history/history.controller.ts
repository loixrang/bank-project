import { Controller, Get, UseGuards } from "@nestjs/common";
import { HistoryService } from "./history.service.js";
import { UserGuard } from "../activeUser/user.js";
import { CurrentUser } from "../activeUser/currentUser.js";
import { type UserSession } from "../types/express.js";

@UseGuards(UserGuard)
@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  findAll(@CurrentUser() req: UserSession) {
    return this.historyService.findAll(req);
  }
}
