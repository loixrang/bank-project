import { PartialType } from "@nestjs/mapped-types";
import { CreateDepositDto } from "./create-deposit.dto.js";

export class UpdateDepositDto extends PartialType(CreateDepositDto) {}
