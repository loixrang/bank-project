import { Injectable } from "@nestjs/common";
import { CreateTransferDto } from "./dto/create-transfer.dto.js";
import { InjectDrizzle } from "@nestjs/drizzle";
import { type Database } from "../database/client.js";

@Injectable()
export class TransferService {
  constructor(@InjectDrizzle() private readonly db: Database) {}
  create(createTransferDto: CreateTransferDto) {
    return "This action adds a new transfer";
  }
}
