import { Controller, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { loginSchema, type LoginDto } from "./dto/create-auth.dto.js";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async createSession(
    @Body({ schema: loginSchema }) dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const session = await this.authService.create(dto);
    res.cookie("session", session.session.userId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    return { id: session.session.userId };
  }
}
